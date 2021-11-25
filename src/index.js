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
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//set view engine
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
const path = require ('path');
app.use(express.static(path.join(__dirname + '/public')));
// function xulyform(req,res){
//     //nhan data tu from ne
//     bot.sendMessage(-509974063,'baodeptrai');
// }
bot.on('message', async function (msg) {
    console.log(msg);
    //du lieu chuyen qua server khac
    // goi api doan nay gưi server 2 xu ly

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
                    // bot.sendMessage(id, reply,{parse_mode: 'HTML'});
                    bot.sendMessage(groupId, reply, {parse_mode: 'HTML'});
                    // bot.sendMessage(chanelId, reply, {parse_mode: 'HTML'});
                    // bot.sendPhoto(id, pic);
                    // bot.sendPhoto(groupId, pic);
                    // bot.sendPhoto(chanelId, pic);
                    // bot.sendVideo(id, video);
                    // bot.sendVideo(chanelId, video);
                    // bot.sendVideo(groupId, video);


                }
            })
            .catch(error => console.log(error));
})

app.get('/telegram/bot/v1', (req, res) => {
    const id = '1921711761';
    bot.sendMessage(id,"hello");
})

app.post('/health', (req, res) => {
    const data = req.body.sizeForm;
    const reply =
        '<strong>Tờ Khai Y Tế </strong>\n' +
        '<strong>Họ và tên: </strong>' + data.name + '\n' +
        '<b>Số Chứng minh thư: </b>' + data.card + '\n' +
        '<b>Số điện thoại: </b>' + data.phone + '\n' +
        '<b>Giới tính: </b>' + data.sex + '\n' +
        '<b>Ngày sinh: </b>' + new Date(data.date)  + '\n' +
        '<b>Địa chỉ: </b>' + data.address+ '\n' +
        '<b>Thông tin di chuyển: </b>' + data.subtext + '\n'
    bot.sendMessage(-509974063,reply,{parse_mode: 'HTML'});
    return res.status(200);
})
app.post('/travelPaper', (req, res) => {
    const data = req.body.sizeForm;
    const reply =
        '<strong>Đơn xin giấy đi đường </strong>\n' +
        '<strong>Họ và tên: </strong>' + data.name + '\n' +
        '<b>Số Chứng minh thư: </b>' + data.card + '\n' +
        '<b>Số điện thoại: </b>' + data.phone + '\n' +
        '<b>Giới tính: </b>' + data.sex + '\n' +
        '<b>Ngày sinh: </b>' + new Date(data.date)  + '\n' +
        '<b>Địa chỉ: </b>' + data.address+ '\n' +
        '<b>Thông tin di chuyển: </b>' + data.subtext + '\n'
    bot.sendMessage(-509974063,reply,{parse_mode: 'HTML'});
    return res.status(200).send();
})
app.listen(process.env.PORT || 3000)