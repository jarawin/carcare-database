import express, { json } from "express";
import cors from "cors";
import { createConnection } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import {insertPromotion} from "./promotion/insertPromotion.js"
import {getPromotion,getAllPromotion} from "./promotion/get_p.js"
import {applyWork} from "./employee/applyWork.js"
import {insertWage} from "./employee/employee_wage/insertWage.js"
import {insertWorkLeave} from "./employee/workleave/insertworkLeave.js"
import {insertWorkTime} from "./employee/workTime/insertworkTime.js"
import {register} from "./customer/insertCustomer.js"
import {getCustomeByc} from './customer/getCustomer.js'
import {getAllcustomerBye} from "./customer/getCustomerAll.js"
import {insertService} from "./service/insertService.js";
import {getSerivecByc} from "./service/getService.js";
import {getAllService} from "./service/getServiceAll.js";
import {insertCommission} from "./commission/insertComission.js";
import {insertPackage} from "./package/insertPackage.js"
import {insertOrderlist} from "./orderList/insertOrder.js"
import {insertBuy} from "./customer/Buy/insertBuy.js";


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

app.post("/promotion", (req, res) => {
  insertPromotion(con, req, res);
});

app.post("/employee/applywork", (req, res) => {
  applyWork(con, req, res);
});

app.post("/employee_wage/addwage", (req, res) => {
  insertWage(con, req, res)
})

app.post("/employee/workleave", (req, res) => {
  insertWorkLeave(con, req, res)
})

app.post("/employee/workTime", (req, res) => {
  insertWorkTime(con, req, res)
})

app.get("/customer/one", (req, res) => {
  getCustomeByc(con, req, res);
})

app.get("/customer/all", (req, res) => {
  getAllcustomerBye(con, req, res);
})

app.post("/customer/register", (req, res) => {
  register(con, req, res)
})

app.post("/customer/buy",(req, res) => {
  insertBuy(con, req, res)
})

app.get("/service/one", (req, res) => {
  getSerivecByc(con, req, res);
})

app.get("/service/all", (req, res) => {
  getAllService(con, req, res);
})

app.post("/service/insert", (req, res) => {
  insertService(con, req, res)
})

app.post("/commission/insert", (req, res) => {
  insertCommission(con, req, res)
})

app.post("/package/insert", (req, res) => {
  insertPackage(con, req, res)
})

app.post("/order/insert", (req, res) => {
  insertOrderlist(con ,req, res)
})

const port = process.env.PORT || 3307;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//? `INSERT INTO users(userid, nickname, picture) VALUES("${uuid}","${nickname}", "${pic}")`
//? `SELECT * FROM users WHERE u_id = '${uuid}' `
