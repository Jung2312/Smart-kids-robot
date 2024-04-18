const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { swaggerUi, specs } = require("./swagger");
const db = require("./routers/db");
const oracledb = require("oracledb");
const app = express();
const path = require("path");

init();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Swagger UI 설정
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", db);

function init() {
  //오라클 db용 init 설정
  oracledb.initOracleClient({
    libDir:
      "C:\\instantclient-basic-windows.x64-11.2.0.4.0\\instantclient_11_2",
  });
}

const server = app.listen(8080, function () {
  console.log("Server is running...");
});
