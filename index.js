import express, { json } from "express";
import cors from "cors";
import { createConnection } from "mysql2";

import { insertPromotion } from "./promotion/insertPromotion.js"
import { getPromotion} from "./promotion/getPromotion.js"
import { deletePromotion } from "./promotion/deletePromotion.js";

import { login } from "./employee/login.js";
import { applyWork } from "./employee/applyWork.js"
import { insertWage } from "./employee/employee_wage/insertWage.js"
import { insertWorkLeave } from "./employee/workleave/insertworkLeave.js"
import { insertWorkTime } from "./employee/workTime/insertworkTime.js"
import { insertMakeCommission}  from "./employee/makeCommission/insertMakecommission.js"
import { getEmployee } from "./employee/getEmployee.js";

import { register } from "./customer/insertCustomer.js"
import { getCustomer } from './customer/getCustomer.js'
import { updateCustomer } from "./customer/updateCustomer.js";

import { insertService } from "./service/insertService.js";
import { getService } from "./service/getService.js";
import { deleteService } from "./service/deleteService.js";

import { insertCommission } from "./commission/insertComission.js";
import { getCommission } from "./commission/getCommission.js";
import { deleteCommission } from "./commission/deleteCommission.js";

import { insertPackage } from "./package/insertPackage.js"
import { getPackage } from "./package/getPackage.js";
import { deletePackage } from "./package/deletePackage.js";

import { insertOrderlist } from "./orderList/insertOrder.js"
import { getOrderlist } from "./orderList/getOrderlist.js";
import { deleteOrder } from "./orderList/deleteOrder.js";

import { insertBuy } from "./customer/Buy/insertBuy.js";
import { getBuy } from "./customer/Buy/getBuy.js";
import { deleteBuy } from "./customer/Buy/deleteBuy.js";




import { deleteCustomer } from "./customer/deleteCustomer.js";


const app = express();
app.use(cors({
  origin: '*'
}));
app.use(json());

const loginMiddleware = (req, res, next) => {
  if(req.headers.username === "ABC" && 
     req.headers.password === "ABC") next();
  else res.send({msg:"Wrong username and password"}) 
  //ถ้า username password ไม่ตรงให้ส่งว่า Wrong username and password
}

// app.post("/login", loginMiddleware, loginMiddleware, (req, res) => {
//   res.send("Login success");
// });

const con = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carcare",
  multipleStatements:true
});
con.connect();

app.get("/", loginMiddleware, (req, res) => {
  res.send("Hello Peem");
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/promotion", loginMiddleware, (req, res) => {
  getPromotion(con, req, res);
})

app.post("/promotion", loginMiddleware, (req, res) => {
  insertPromotion(con, req, res);
});

app.delete("/promotion", loginMiddleware, (req, res) => {
  deletePromotion(con, req, res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/employee/login", loginMiddleware, (req, res) => {
  login(con, req, res);
})

app.get("/employee", loginMiddleware, (req, res) => {
  getEmployee(con, req, res);
})

app.post("/employee/applywork", loginMiddleware, (req, res) => {
  applyWork(con, req, res);
});

app.post("/employee_wage/addwage", loginMiddleware, (req, res) => {
  insertWage(con, req, res)
})

app.post("/employee/workleave", loginMiddleware, (req, res) => {
  insertWorkLeave(con, req, res)
})

app.post("/employee/workTime", loginMiddleware, (req, res) => {
  insertWorkTime(con, req, res)
})

app.post("/employee/makeCommission", loginMiddleware, (req, res) => {
  insertMakeCommission(con, req, res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/customer", loginMiddleware, (req, res) => {
  getCustomer(con, req, res);
})

app.post("/customer/", loginMiddleware, (req, res) => {
  register(con, req, res)
})

app.put("/customer", loginMiddleware, (req, res) => {
  updateCustomer(con, req, res)
})

app.delete("/customer", loginMiddleware, (req, res) => {
  deleteCustomer(con, req, res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/customer/buy", loginMiddleware, (req, res) => {
  getBuy(con, req, res)
})

app.post("/customer/buy",loginMiddleware, (req, res) => {
  insertBuy(con, req, res)
})

app.delete("/customer/buy", loginMiddleware, (req, res) => {
  deleteBuy(con, req, res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/service", loginMiddleware, (req, res) => {
  getService(con, req, res);
})

app.post("/service", loginMiddleware, (req, res) => {
  insertService(con, req, res)
})

app.delete("/service", loginMiddleware, (req, res) => {
  deleteService(con, req, res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/commission", loginMiddleware, (req, res) => {
  getCommission(con, req ,res)
})

app.post("/commission", loginMiddleware, (req, res) => {
  insertCommission(con, req, res)
})

app.delete("/commission", loginMiddleware, (req, res) => {
  deleteCommission(con, req, res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/package", loginMiddleware, (req, res) => {
  insertPackage(con, req, res)
})

app.get("/package", loginMiddleware, (req, res) => {
  getPackage(con, req ,res)
})

app.delete("/package", loginMiddleware, (req, res) => {
  deletePackage(con, req ,res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/order", loginMiddleware, (req, res) => {
  insertOrderlist(con ,req, res)
})

app.get("/order", loginMiddleware, (req, res) => {
  getOrderlist(con ,req, res)
})

app.delete("/order", loginMiddleware, (req, res) => {
  deleteOrder(con ,req, res)
})
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const port = process.env.PORT || 3307;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//? `INSERT INTO users(userid, nickname, picture) VALUES("${uuid}","${nickname}", "${pic}")`
//? `SELECT * FROM users WHERE u_id = '${uuid}' `
