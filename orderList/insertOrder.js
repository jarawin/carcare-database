import e from "express";
import { v4 as uuidv4 } from "uuid";



const isPhoneNumber = (phone) => {
  var phoneno = /((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))|((\+๖๖|๐)([๐-๙]{1,2}\-?[๐-๙]{3}\-?[๐-๙]{3,4}))/gm;
  if(phone.match(phoneno)){
      return true;
    }else{
      return false;
    }
}

const haveOrderId = (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined){//? Not duplicate
        resolve(false)
        console.log("Can insert order");
      }else{//? duplicate
        resolve(true)
        console.log("key duplicate please insert again");
      }
    });
  })
}

const haveCustomerId = (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined){//? Not duplicate
        resolve(false)
        console.log("Have not customer");
      }else{//? duplicate
        resolve(true)
        console.log("Have customer");
      }
    });
  })
}

const haveEmployeeId = async (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      console.log(result);
      if (err) throw err;
      if (result[0] == undefined){//? Not duplicate
        resolve(false)
        console.log("Have not employee");
      }else{//? duplicate
        resolve(true)
        console.log("Have employee");
      }
    });
  })
}

function insertOrderlist(con, req, res) {
    const customer_id = req.body.customer_id; //! please verify
    console.log(customer_id);
    const order_id = uuidv4(); //! please verify
    const employee_id = req.body.employee_id; //! please verify
    console.log(employee_id);
    const type_car = req.body.type_car;
    const color_car = req.body.color_car;
    const license_car = req.body.license_car;//! url
    const nickname = req.body.nickname;
    const order_status = req.body.order_status;//! url
    const tel = req.body.tel;//! url
    const is_booking = req.body.is_booking;
    var booking_time = req.body?.booking_time ?? undefined;
    var arrival_time = Date.now();;
    const code = req.body.code; //! please verify
    const order_type = req.body.order_type;
    const comment = req.body?.comment??undefined;


    const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
    const sqlCustoemr = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
    const sqlorder = `SELECT * FROM orderlist WHERE order_id = "${order_id}"`;
    var sqlB = `INSERT INTO orderlist(order_id,type_car,color_car,license_car,nickname,order_status,tel,is_booking,booking_time,arrived_time,code,order_type, comment) 
                  VALUES("${order_id}","${type_car}","${color_car}","${license_car}","${nickname}","${order_status}","${tel}",${is_booking},${booking_time},${arrival_time},"${code}","${order_type}","${comment}");`;
    
    var sqlNB = `INSERT INTO orderlist(order_id,type_car,color_car,license_car,nickname,order_status,tel,is_booking,arrived_time,code,order_type, comment) 
                  VALUES("${order_id}","${type_car}","${color_car}","${license_car}","${nickname}","${order_status}","${tel}",${is_booking},${arrival_time},"${code}","${order_type}","${comment}");`;
    con.connect(async (err) => {
      if (err) throw err;
      console.log("\nConnected!");
      
      if (!(await haveEmployeeId(con, sqlEmployee))){
        res.status(501).send({msg:"Not have employee id"})
        return 0;
      }

      if (!(await haveCustomerId(con, sqlCustoemr))){
        res.status(501).send({msg:"Not have customer id"})
        return 0;
      }

      if (booking_time == undefined || booking_time == null){
        console.log("Not have booking time");
        res.status(501).send({msg:"Not have booking time"})
        return 0;
      }

      if (await haveOrderId (con, sqlorder)){
        res.status(501).send({msg:"key duplicate please insert again"})
        return 0;
      }

      if (!isPhoneNumber){
        console.log("is not phone number");
        res.status(501).send({msg:"is not phone number"})
        return 0;
      }


      if (is_booking){
        console.log("Booking");
        con.query(sqlB, (err ,result) => {
          if (err) throw err;
          res.status(200).send({msg:"Insert order success"})
          console.log("Insert order success");
        })
      }else{
        console.log("Not booking");
        con.query(sqlNB, (err ,result) => {
          if (err) throw err;
          res.status(200).send({msg:"Insert order success"})
          console.log("Insert order success");
        })
      }
  })}
  
  export {insertOrderlist}