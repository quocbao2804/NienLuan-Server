const TelegramBot = require('node-telegram-bot-api');
const token = '1952043068:AAGIZ1lZ3TBfmnluSFgbdCt98R7oN4gzy3I';
const opt = {polling:true};
const bot = new TelegramBot(token,opt);
const axios = require('axios');
const fuzz = require('fuzzball');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()

//set view engine
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
const path = require ('path');
app.use(express.static(path.join(__dirname + '/public')));

bot.on('message', async function (msg) {
    console.log(msg);
    // https://api.covid19api.com/countries
    const result = await axios.get(`https://api.covid19api.com/countries`)
    let maxRatio = 0;
    let country;
    result.data.map(information => {
        // console.log(fuzz.ratio(information.Country, msg.text));
        let ratio = fuzz.ratio(information.Country, msg.text);
        if (ratio > maxRatio) {
            country = information.Country;
            maxRatio = ratio;
        }
    })
    const today = new Date();
    let temp = new Date(today);
    temp.setDate(temp.getDate() - 1);
    const yesterday = temp.toISOString();
    // https://api.telegram.org/bot1952043068:AAGIZ1lZ3TBfmnluSFgbdCt98R7oN4gzy3I/getUpdates
        axios.get(`https://api.covid19api.com/live/country/${country}/status/confirmed/date/${yesterday}`)
            .then(result => {
                const dataArr = result.data;
                for (const element of dataArr) {
                    const groupId = '-509974063';
                    const id = msg.chat.id;
                    const chanelId = '-1001554507187'
                    const pic = 'https://res.cloudinary.com/dcyb0xzun/image/upload/v1632297547/sample.jpg';
                    const video = 'https://res.cloudinary.com/dcyb0xzun/video/upload/v1632318446/video2_uhp6w9.mp4';
                    const reply =
                        '<strong>Đất nước: </strong>' + element.Country + '\n' +
                        '<b>Số ca nhiễm: </b>' + element.Confirmed + '\n' +
                        '<b>Đã và đang điều trị: </b>' + element.Active + '\n' +
                        '<b>Tử Vong: </b>' + element.Deaths + '\n'
                    bot.sendMessage(id, reply,{parse_mode: 'HTML'});
                    bot.sendMessage(groupId, reply, {parse_mode: 'HTML'});
                    bot.sendMessage(chanelId, reply, {parse_mode: 'HTML'});
                    bot.sendPhoto(id, pic);
                    bot.sendPhoto(groupId, pic);
                    bot.sendPhoto(chanelId, pic);
                    bot.sendVideo(id, video);
                    bot.sendVideo(chanelId, video);
                    bot.sendVideo(groupId, video);


                }
            })
            .catch(error => console.log(error));
})

app.get('/telegram/bot/v1', (req, res) => {
    const id = '1921711761';
    bot.sendMessage(id,"hello");
})
app.listen(process.env.PORT || 3000)