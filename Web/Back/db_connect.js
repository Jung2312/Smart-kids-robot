const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("./DB/db_config");
const { readImage, processImages } = require("./DB/imageHandler.js");

const app = express();
const router = express.Router();

async function selectDatabase(query, binds = {}) {
  try {
    console.log("db 연결");
    let connection = await oracledb.getConnection(dbConfig);

    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    };

    let result = await connection.execute(query, binds, options);

    console.log(result.rows);
    await connection.close();

    return result.rows;
  } catch (error) {
    console.error("오류 발생:", error);
    throw error;
  }
}

router.get("/db", async function (req, res) {
  try {
    const education = req.query.education; // 한글, 영어, 퀴즈
    const category = req.query.category; // 자음, 모음, 쌍자음, 단어, 알파벳, 동물, 과일, 교통
    console.log(education);
    let query = null;
    let binds = {}; // binds 객체 초기화

    if (education === "english" && category === "word") {
      query = `SELECT * FROM ${education} where EWORD_IMG IS NOT NULL`;
    } else {
      query = `SELECT * FROM ${education} where ${category} IS NOT NULL`;
    }
    const result = await selectDatabase(query, binds);

    const resultWithUrls = await processImages(result);

    res.json({
      WORD: resultWithUrls,
    });
  } catch (error) {
    console.error("db error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/db/nation", async function (req, res) {
  try {
    const education = req.query.education; // 퀴즈
    console.log(education);
    let query = null;
    let binds = {}; // binds 객체 초기화

    if (education === "Nation") { // education이 'Nation'일 때의 처리 추가
      query = `SELECT * FROM Nation`; // 'Nation' 테이블에서 모든 데이터를 가져오도록 쿼리 설정
    } 

    const result = await selectDatabase(query, binds);

    const resultWithUrls = await processImages(result);

    res.json({
      WORD: resultWithUrls,
    });
  } catch (error) {
    console.error("db error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/db/wordquiz", async function (req, res) {
  try {
    const education = req.query.education;
    const category = req.query.category; // 동물, 과일, 교통
    console.log(`Education: ${education}, Category: ${category}`);
    let query = null;
    let binds = {};

    if (education === "wordQuiz" && (category === "동물" || category === "과일" || category === "교통")) {
      query = `SELECT * FROM wordQuiz WHERE category = :category`;
      binds = { category };
    } else {
      query = `SELECT * FROM ${education} WHERE ${category} IS NOT NULL`;
    }

    const result = await selectDatabase(query, binds);
    const resultWithUrls = await processImages(result);

    res.json({
      WORD: resultWithUrls,
    });
  } catch (error) {
    console.error("db error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 라우터를 앱에 등록
app.use(router);

module.exports = router;
