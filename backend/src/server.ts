import express from "express"
import dotnv from "dotenv";
dotnv.config();
const app: express.Application = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port http://localhost:${process.env.PORT}`);
});