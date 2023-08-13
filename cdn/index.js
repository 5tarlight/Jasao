const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("../jasao-frontend/ssl/private.key"),
  cert: fs.readFileSync("../jasao-frontend/ssl/certificate.crt"),
};

const app = express();

app.use(express.static(path.join(__dirname, "public")));

https.createServer(options, app).listen(8081, () => {
  console.log("Server is listening in port 8081");
});
