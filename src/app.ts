import express from "express";
import bodyParser from "body-parser";
import router from "./routes/appeals.router";
import { AppDataSource } from "./database.config";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = Number(process.env.APP_PORT)
app.use(bodyParser.json());

AppDataSource.initialize().then(() => {
  app.use("/api", router);
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch((error) => console.log(error));
