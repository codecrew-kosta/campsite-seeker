const express = require('express');
const app = express();
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
//APIKEY는 반드시 Decoding 값을 받아와야 합니다(URL 삽입 목적의 Encoding 키는 사용 불가능)
//따라서 APIKEY는 노출이 되어서는 안되며, dotenv 라이브러리 npm으로 받은 후 '.env'로 관리 부탁드립니다.
//APIKEY는 사용 할당량이 존재하므로(1000회), 각자 발급받은 키를 사용합시다.
app.options('*', cors()); // 모든 경로에 대해 OPTIONS 요청을 허용
app.use(cors());

// process.env.API_KEY
const port = process.env.PORT || 3333;

const TOTALNUMOFROW = 4016;

app.get('/', (req, res) => {
    res.redirect(`/list`);
})

app.get('/basedList', async (req, res) => {
    const url = `https://apis.data.go.kr/B551011/GoCamping/basedList`;
    const { numOfRows = 10, pageNo = 1 } = req.query;

    try {
        const response = await axios.get(url, {
            params: {
                numOfRows,
                pageNo,
                MobileOS: 'ETC',
                MobileApp: 'codecrew',
                _type: 'json',
                serviceKey: process.env.API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/searchList', async (req, res) => {
    const url = `https://apis.data.go.kr/B551011/GoCamping/searchList`;
    const { keyword } = req.query;

    try {
        const response = await axios.get(url, {
            params: {
                numOfRows: TOTALNUMOFROW,
                pageNo: 1,
                MobileOS: 'ETC',
                MobileApp: 'codecrew',
                _type: 'json',
                serviceKey: process.env.API_KEY,
                keyword,
            }
        });
        res.json(response.data);
        console.log(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


app.get('/naver-map', async (req, res) => {
    try {

        const response = await axios.get(`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NAVER_MAP_API_ID}`);
        // res.setHeader('Content-Type', 'application/javascript');
        // console.log(response.data);

        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching API data');
    }
});


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})