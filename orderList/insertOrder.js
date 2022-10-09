
const insertOrder = (con, sql2, res) => {
  con.query(sql2, (err, result) => {
    if (err) throw err;
    res.status(200).send("applyment pending");
    console.log("applyment pending");
  });
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const isPhoneNumber = (phone) => {
  var phoneno = /((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))|((\+๖๖|๐)([๐-๙]{1,2}\-?[๐-๙]{3}\-?[๐-๙]{3,4}))/gm;
  if(phone.match(phoneno)){
      return true;
    }else{
      return false;
    }
}


function insertOrderlist(con, req, res) {
    const order_id = req.body.order_id;
    const type_car = req.body.type_car;
    const color_car = req.body.color_car;
    const license_car = req.body.license_car;//! url
    const nickname = req.body.nickname;
    const order_status = req.body.order_status;//! url
    const tel = req.body.tel;//! url
    const is_booking = req.body.is_booking;
    const booking_time = req.body.booking_time;
    const arrival_time = req.body.arrival_time;
    const code = req.body.code;
    const order_type = req.body.order_type;
    const sql1 = `SELECT * FROM orderlist WHERE order_id = "${order_id}"`;
    const sql2 = `INSERT INTO orderlist(order_id,type_car,color_car,license_car,nickname,order_status,tel,is_booking,booking_time,arrival_time,nickname,code,order_type) 
                  VALUES("${order_id}","${type_car}","${color_car}","${license_car}","${nickname}","${order_status}","${tel}","${is_booking}","${booking_time}","${arrival_time}","${nickname}","${code}","${order_type}");`;

    //TODO check phone
    if (!isPhoneNumber(tel)){
      res.status(501).send({status:"Not tel format"})
      console.log("Not tel format");
      return 0;
    }else{
      console.log({status:"check phone success"});
    }

    // //TODO check URL
    // const arrayOfUrl = [["license_car",license_car], ["order_status",order_status], ["tel",tel], ["id_card",id_card], ["resume",resume ], ["house_registration",house_registration]]
    // for (let i = 0; i < arrayOfUrl.length; i++){
    //   if (!isValidHttpUrl(arrayOfUrl[i][1])){
    //     res.status(501).send(`${arrayOfUrl[i][0]} is not url`)
    //     return 0;
    //   }
    // }
    // console.log("check url success");

    
    
    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
          insertOrder(con, sql2, res)
        }else{//? duplicate
          res.status(501).send("Account already exists");
          console.log("Account already exists");
        }
      });
    });
  }
  
  export {insertOrderlist};