const express = require("express");
const app = express();
const port = 3000;

const morgan = require("morgan");
const path = require("path");

app.use(morgan("combined"));
app.use("/", express.static(path.join(__dirname, "public")));

// demo, adding route to test out gh push action
app.get("/api", (req, res) => {
  res.status(200);
  res.send('API route');
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
