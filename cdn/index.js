const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.listen(8081, () => {
  console.log("CDN server is listening in port 8081");
});
