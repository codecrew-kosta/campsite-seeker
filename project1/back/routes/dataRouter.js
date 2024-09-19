const express = require("express");
const router = express.Router();
const axios = require("axios");

const client_secret = process.env.data_ENCODING_KEY;

router.get("/", async (req, res) => {
  try {
    res.send(`<h1>dd</h1>`);
  } catch (error) {
    res.status(400).json({ message: "오류" });
  }
});

router.get("/api", async (req, res) => {
  const api_url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=dd&serviceKey=sxw1mCZZJwnC6FC%2B%2Fci%2FW7VFzjuAjH7nnTXpDgP16dniQXRLsMEUAlVkUN3PAN6epAP46wNuIzUJ4GdMSoKcUw%3D%3D&_type=json`;

  try {
    const response = await axios.get(api_url);
    const data = await response.data.response.body.items;
    // console.log(data);
    // res.send(`<h1>${data}</h1>`);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.get("/api2", async (req, res) => {
  try {
    // const lat = req.query.lat;
    // const lng = req.query.lng;

    const lat = 37.3595704;
    const lng = 127.105399;

    if (!lat || !lng) {
      return res.status(400).json({ message: "위도와 경도가 필요합니다." });
    }

    const api_url = `https://apis.data.go.kr/B551011/GoCamping/locationBasedList?numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=CodeCrew&serviceKey=${client_secret}&_type=json&mapX=${lng}&mapY=${lat}&radius=20000`;
    // console.log(api_url);

    // api 요청 보내기
    const response = await axios.get(api_url);

    // 데이터를 클라이언트에 전달
    const data = await response.data.response.body.items;
    // console.log(data);

    res.status(200).json(data);
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    res.status(500).json({ message: "API 요청 중 오류가 발생했습니다." });
  }
});

router.get("/search", async (req, res) => {
  //키워드 검색 목록 조회 받아오기 https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15101933#/API%20%EB%AA%A9%EB%A1%9D/searchList
  let { keyword, numOfRows, pageNo } = req.query;
  console.log(keyword);

  if (!keyword) {
    keyword = "야영장";
  }
  if (!pageNo) {
    pageNo = 1;
  }
  if (!numOfRows) {
    numOfRows = 20;
  }
  const api_url = `https://apis.data.go.kr/B551011/GoCamping/searchList?numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=CodeCrew&serviceKey=sxw1mCZZJwnC6FC%2B%2Fci%2FW7VFzjuAjH7nnTXpDgP16dniQXRLsMEUAlVkUN3PAN6epAP46wNuIzUJ4GdMSoKcUw%3D%3D&_type=json&keyword=${keyword}`;
  // console.log(api_url);

  try {
    const response = await axios.get(api_url);
    const data = await response.data.response.body.items;
    // console.log(data);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
