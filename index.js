import express, { json } from "express";
import cors from "cors";
import { createConnection } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import {insertPromotion} from "./promotion/insertPromotion.js"
import {getPromotion,getAllPromotion} from "./promotion/get_p.js"
import { login } from "./employee/login.js";
import {applyWork} from "./employee/applyWork.js"
import {insertWage} from "./employee/employee_wage/insertWage.js"
import {insertWorkLeave} from "./employee/workleave/insertworkLeave.js"
import {insertWorkTime} from "./employee/workTime/insertworkTime.js"
import { getOneEmployee } from "./employee/getEmployeeOne.js";
import { getAllEmployee } from "./employee/getEmployeeAll.js";
import {register} from "./customer/insertCustomer.js"
import {getCustomeByc} from './customer/getCustomer.js'
import {insertService} from "./service/insertService.js";
import {getSerivecByc} from "./service/getService.js";
import {getAllService} from "./service/getServiceAll.js";
import {insertCommission} from "./commission/insertComission.js";
import {insertPackage} from "./package/insertPackage.js"
import {insertOrderlist} from "./orderList/insertOrder.js"
import { getOrderlist } from "./orderList/getOrderlist.js";
import {insertBuy} from "./customer/Buy/insertBuy.js";
import {insertMakeCommission} from "./employee/makeCommission/insertMakecommission.js"
import { getCommissionOne } from "./commission/getCommission.js";
import { getCommissionAll } from "./commission/getCommissionAll.js";
import { getPackageOne } from "./package/getPackageOne.js";
import { getAllpackage } from "./package/getPackageAll.js";
import { loginC } from "./customer/loginC.js"; 
import { deleteCustomer } from "./customer/deleteCustomer.js";


const app = express();
app.use(cors({
  origin: '*'
}));
app.use(json());

const con = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carcare",
  multipleStatements:true
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

app.get("/employee/login", (req, res) => {
  login(con, req, res);
})

app.get("/employee/one", (req, res) => {
  getOneEmployee(con, req, res);
})

app.get("/employee/all", (req, res) => {
  getAllEmployee(con, req, res);
})


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

app.post("/employee/makeCommission", (req, res) => {
  insertMakeCommission(con, req, res)
})

app.get("/customer", (req, res) => {
  getCustomeByc(con, req, res);
})

app.get("/customer/check", (req, res) => {
  loginC(con, req, res);
})


app.post("/customer/register", (req, res) => {
  register(con, req, res)
})

app.post("/customer/buy",(req, res) => {
  insertBuy(con, req, res)
})

app.delete("/customer", (req, res) => {
  deleteCustomer(con, req, res)
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

app.get("/commission/one", (req, res) => {
  getCommissionOne(con, req ,res)
})

app.get("/commission/all", (req, res) => {
  getCommissionAll(con, req ,res)
})

app.post("/commission/insert", (req, res) => {
  insertCommission(con, req, res)
})

app.get("/package/one", (req, res) => {
  getPackageOne(con, req ,res)
})

app.get("/package/all", (req, res) => {
  getAllpackage(con, req ,res)
})

app.post("/package/insert", (req, res) => {
  insertPackage(con, req, res)
})

app.post("/order/insert", (req, res) => {
  insertOrderlist(con ,req, res)
})

app.get("/order/one", (req, res) => {
  getOrderlist(con ,req, res)
})

app.put("", (req, res) => {
  if (req.body?.fname){
    //! update
  }
})

const port = process.env.PORT || 3307;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//? `INSERT INTO users(userid, nickname, picture) VALUES("${uuid}","${nickname}", "${pic}")`
//? `SELECT * FROM users WHERE u_id = '${uuid}' `
