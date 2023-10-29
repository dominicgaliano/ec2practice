const express = require("express");
const app = express();
const port = 3000;

const morgan = require("morgan");
const path = require("path");

app.use(morgan("combined"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
