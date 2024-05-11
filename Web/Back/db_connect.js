const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("./DB/db_config");
const { readImage, processImages } = require("./DB/imageHandler.js");

const router = express.Router();
async function selectDatabase(query) {
  try {
    console.log("db 연결");
    let connection = await oracledb.getConnection(dbConfig);

    let binds = {};
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

    if (education === "wordQuiz") {
      query = `SELECT * FROM ${education} where category = :category`;
      binds.category = category;
    } else {
      query = `SELECT * FROM ${education} where ${category} IS NOT NULL`;
    }

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

module.exports = router;
