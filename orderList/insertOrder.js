import e from "express";
import { v4 as uuidv4 } from "uuid";

const createText = async (order_id, services) => {
  var txt = `("${order_id}", "${services[0].service_id}")`;
  for (let i = 1; i < services.length; i++) {
    txt += `,("${order_id}", "${services[i].service_id}")`;
  }
  return txt;
};

const haveService = async (con, services) => {
  var txt = `("${services[0].service_id}"`;
  for (let i = 1; i < services.length; i++) {
    txt += `,"${services[i].service_id}"`;
  }
  txt += `)`;
  console.log(txt);

  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM service WHERE service_id IN ${txt}`,
      (err, result) => {
        if (err) throw err;
        if (result.length != services.length) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const isPhoneNumber = (phone) => {
  var phoneno =
    /((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))|((\+๖๖|๐)([๐-๙]{1,2}\-?[๐-๙]{3}\-?[๐-๙]{3,4}))/gm;
  if (phone.match(phoneno)) {
    return true;
  } else {
    return false;
  }
};

const haveOrderId = (con, order_id) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM orderlist WHERE order_id = "${order_id}"`, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined) {
        //? Not duplicate
        resolve(false);
        console.log("Can insert order");
      } else {
        //? duplicate
        resolve(true);
        console.log("key duplicate please insert again");
      }
    });
  });
};

const haveCustomerId = (con, customer_id) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM customer WHERE customer_id = "${customer_id}"`, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined) {
        //? Not duplicate
        resolve(false);
        console.log("Have not customer");
      } else {
        //? duplicate
        resolve(true);
        console.log("Have customer");
      }
    });
  });
};

const insertIncluded = async (con, txt) => {
  con.query(
    `INSERT INTO included(order_id, service_id) VALUES ${txt}`,
    (err, result) => {
      if (err) throw err;
    }
  );
};


const upRank = async (con, customer_id) => {
  var rank = "";
  con.query(`SELECT * FROM rank_info WHERE customer_id = "${customer_id}"`, (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result[0].sumPrice >= 1000 && result[0].sumPrice < 3000 && result[0].rank == "BRONZE"){
      rank = "SILVER"
    }else if (result[0].sumPrice >= 3000 && result[0].rank == "SILVER"){
      rank = "GOLD"
    }
    if(rank != ""){
      const sql = `UPDATE customer SET rank = "${rank}" WHERE customer_id = "${customer_id}"`
      con.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`Up rank! --> ${rank}`);
      })
    }
  })
}

// const canReceiveCommission = async(con, order_id) => {
//   const sql1 =`SELECT s.commission_id AS commission_id,COUNT(s.commission_id) AS spend
//   FROM orderlist AS o, included AS i, service AS s
//   WHERE o.order_id = i.order_id AND i.service_id = s.service_id AND o.order_id = "${order_id}"
//   GROUP BY s.commission_id;`
//   return new Promise((resolve, reject) => {
//     con.query(sql1, (err, result1) => {
//       if (err) throw err;
//         for (let i = 0; i < result1.length; i++){
//           con.query(`SELECT commission_id, quota_amount, usages 
//                      FROM commission_limit 
//                      WHERE commission_id = "${result1[i].commission_id}"`, (err, result2) => {
//             if (err) throw err;
//             console.log(`${result1[i].spend}`+ "+" + `${result2[0].usages}` +"<"+`${result2[0].quota_amount}`);
//             if (result1[i].spend + result2[0].usages > result2[0].quota_amount){
              
//             }
//           })
//         }
//     })
//   })
// }

// const canReceiveCom = async(con, order_id) => {
//   const sql1 = `SELECT service_id FROM included WHERE order_id = "${order_id}"`
//   con.query(sql1,  async (err, result1) => {
//     if (err) throw err;
//     for (let i = 0; i < result1.length; i++){
//       con.query(`SELECT commission_id FROM service WHERE service_id = "${result1[i].service_id}"`,  async(err, result2) => {
//         if (err) throw err;
//         con.query(`SELECT quota_amount,usages FROM commission_limit WHERE commission_id = "${result2[0].commission_id}"`, async (err, result3) => {
//           if (err) throw err;
//           console.log(result3);
//           if (result3[0] == undefined){
//             await updateCanReceive(con, order_id, result1[i].service_id)
//           }else if (result3[0].usages + 1 <= result3[0].quota_amount){
//             await updateCanReceive(con, order_id, result1[i].service_id)
//           }
//         })
//       })
//     }
//   })
// }

// const updateCanReceive = async(con, order_id, service_id) => {
//   const sql1 = `UPDATE included SET can_receive_commission = 1 WHERE order_id = "${order_id}" AND service_id = "${service_id}"`;
//   con.query(sql1, (err, result) => {
//     if (err) throw err;
//     console.log(`Set can_receive_commission = 1 WHERE order_id = "${order_id}" AND service_id = "${service_id}"`);
//   })
// }

const checkHavePackage = async(con, customer_id, services) => {
  const sql1 = `SELECT * FROM member_info WHERE customer_id = "${customer_id}"`
  return new Promise((resolve, reject) => {
    con.query(sql1, (err, result1) => {
      if (err) throw err;
      for (let i = 0; i < result1.length ; i++){
        for (let j = 0; j < services.length; j++){
          if (result1[i].service_id == services[j].service_id){
            if (result1[i].totalUse > result1[i].usages){
              console.log("totalUse > usages");
              resolve(true);
              break
            }
          }
        }
      }
      resolve(false);
    })
  })
}

function insertOrderlist(con, req, res) {
  const customer_id = req.body.customer_id; //! please verify
  console.log(customer_id);
  const order_id = uuidv4(); //! please verify
  const type_car = req.body.type_car;
  const color_car = req.body.color_car;
  const license_car = req.body.license_car; //! url
  const nickname = req.body.nickname;
  const order_status = req.body.order_status; //! url
  const tel = req.body.tel; //! url
  const is_booking = req.body.is_booking;
  var booking_time = req.body?.booking_time ?? undefined;
  var arrival_time = Date.now();
  const code = req.body.code; //! please verify
  var order_type = "GENERAL";
  const comment = req.body?.comment ?? undefined;
  const services = req.body.services;


  
  con.connect(async (err) => {
    if (err) throw err;
    console.log("\nConnected!");

    // if (!(await haveEmployeeId(con, sqlEmployee))){
    //   res.status(501).send({msg:"Not have employee id"})
    //   return 0;
    // }

    if (!(await haveCustomerId(con, customer_id))) {
      res.status(501).send({ msg: "Not have customer id" });
      return 0;
    }

    if (booking_time == undefined || booking_time == null) {
      console.log("Not have booking time");
      res.status(501).send({ msg: "Not have booking time" });
      return 0;
    }

    if (await haveOrderId(con, order_id)) {
      res.status(501).send({ msg: "key duplicate please insert again" });
      return 0;
    }

    if (!isPhoneNumber) {
      console.log("is not phone number");
      res.status(501).send({ msg: "is not phone number" });
      return 0;
    }

    if (!(await haveService(con, services))) {
      console.log("Not have service");
      res.status(501).send({ msg: "Not have service" });
      return 0;
    }

    if((await checkHavePackage(con, customer_id, services))){
      console.log("Is member");
      order_type = "MEMBER"
    }
    var sqlB = `INSERT INTO orderlist(order_id,type_car,color_car,license_car,nickname,order_status,tel,is_booking,booking_time,code,order_type, comment) 
                VALUES("${order_id}","${type_car}","${color_car}","${license_car}","${nickname}","${order_status}","${tel}",${is_booking},${booking_time},"${code}","${order_type}","${comment}");`;

    var sqlNB = `INSERT INTO orderlist(order_id,type_car,color_car,license_car,nickname,order_status,tel,is_booking,arrived_time,code,order_type, comment) 
                  VALUES("${order_id}","${type_car}","${color_car}","${license_car}","${nickname}","${order_status}","${tel}",${is_booking},${arrival_time},"${code}","${order_type}","${comment}");`;
    //

    var txtO = await createText(order_id, services);
    if (is_booking) {
      console.log("Booking");
      con.query(sqlB, (err, result) => {
        if (err) throw err;
        con.query(
          `INSERT INTO make_order VALUES("${customer_id}","${order_id}");`,
          async (err, result) => {
            if (err) throw err;

            await insertIncluded(con, txtO);
            await upRank(con, customer_id);
            // await canReceiveCom(con, order_id);

            res.status(200).send({ msg: "Insert order success" });
            console.log("Insert order success");
          }
        );
      });
    } else {
      console.log("Not booking");
      con.query(sqlNB, (err, result) => {
        if (err) throw err;
        con.query(
          `INSERT INTO make_order VALUES("${customer_id}","${order_id}");`,//! insert make order
          async (err, result) => {
            if (err) throw err;

            await insertIncluded(con, txtO);
            await upRank(con, customer_id);
            // await canReceiveCom(con, order_id);

            res.status(200).send({ msg: "Insert order success" });
            console.log("Insert order success");
          }
        );
      });
    }
  });
}

export { insertOrderlist };
