const express = require("express");
const router = express.Router();
const axios = require("axios");

const client_secret = process.env.data_DECODING_KEY;

router.get("/", async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ message: "오류" });
  }
});

router.get("/locationBasedList", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;

    if (!lat || !lng) {
      return res.status(400).json({ message: "위도와 경도가 필요합니다." });
    }

    const api_url = `https://apis.data.go.kr/B551011/GoCamping/locationBasedList?numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=CodeCrew&serviceKey=${client_secret}&_type=json&mapX=${lat}&mapY=${lng}&radius=20000`;
    console.log(api_url);

    // api 요청 보내기
    const response = await axios.get(api_url, {
      headers: {
        "cache-control": "private",
        "content-length": 7763,
        "content-type": "application/json",
      },
    });

    // 데이터를 클라이언트에 전달
    res.status(200).json(response.data);
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    res.status(500).json({ message: "API 요청 중 오류가 발생했습니다." });
  }
});

module.exports = router;
