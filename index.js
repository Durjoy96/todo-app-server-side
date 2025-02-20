const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
require("dotenv").config();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("server working...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
