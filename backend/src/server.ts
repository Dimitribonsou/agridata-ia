import express from "express"
import dotnv from "dotenv";
import cors from "cors";
dotnv.config();
const app: express.Application = express();
app.use(cors(
 {origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true}
));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port http://localhost:${process.env.PORT}`);
});