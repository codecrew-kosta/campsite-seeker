const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const dataRouter = require("./routes/dataRouter.js");

const port = process.env.PORT || 3333;

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../front")));
app.use(morgan("dev"));
app.use(cors()); // 모든 도메인 허용

// 라우터 설정
app.use("/", dataRouter);

// 기본 경로로 index.html 제공
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/index.html"));
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
