import express, { json } from "express";
import cors from "cors";
import { createConnection } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import {insertPromotion} from "./promotion/insert_p.js"
import {getPromotion,getAllPromotion} from "./promotion/get_p.js"
import {applyWork} from "./employee/applyWork.js"
import {insertWage} from "./employee/employee_wage/insertWage.js"
import {register} from "./customer/insertCustomer.js"
import {insertService} from "./service/insertService.js";
import {insertCommission} from "./commission/insertComission.js";

const app = express();
app.use(cors());
app.use(json());

const con = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carcare",
});
con.connect();

app.get("/", (req, res) => {
  res.send("Hello Peem");
});

app.get("/promotion", (req, res) => {
  getPromotion(con, req, res);
})

app.get("/allpromotion", (req, res) => {
  getAllPromotion(con, req, res);
})

app.put("/promotion", (req, res) => {
  insertPromotion(con, req, res);
});

app.post("/employee/applywork", (req, res) => {
  applyWork(con, req, res);
});

app.post("/employee_wage/addwage", (req, res) => {
  insertWage(con, req, res)
})

app.post("/customer/register", (req, res) => {
  register(con, req, res)
})

app.post("/service/insert", (req, res) => {
  insertService(con, req, res)
})

app.post("/commission/insert", (req, res) => {
  insertCommission(con, req, res)
})

const port = process.env.PORT || 3307;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//? `INSERT INTO users(userid, nickname, picture) VALUES("${uuid}","${nickname}", "${pic}")`
//? `SELECT * FROM users WHERE u_id = '${uuid}' `
