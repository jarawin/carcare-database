import { insertCanReduce } from "./canReduce/insertcanReduce.js";

const createText = async (code, price_per_type) => {
  var txt1 = `("${code}", "${price_per_type[0].type_of_car}", "${price_per_type[0].reduce_type}", ${price_per_type[0].reduce})`;
  for (let i = 1; i < price_per_type.length; i++) {
    txt1 += `,("${code}", "${price_per_type[i].type_of_car}", "${price_per_type[i].reduce_type}", ${price_per_type[i].reduce})`;
  }
  return txt1;
};

const createTextDay = async (code, promotion_by_day) => {
  var txt1 = `("${code}", "${promotion_by_day[0].day}")`;
  for (let i = 1; i < promotion_by_day.length; i++) {
    txt1 += `,("${code}", "${promotion_by_day[i].day}")`;
  }
  return txt1;
};

const createTextReduce = async (code, can_reduce) => {
  var txt1 = `("${code}", "${can_reduce[0].service_id}")`;
  for (let i = 1; i < can_reduce.length; i++) {
    txt1 += `,("${code}", "${can_reduce[i].service_id}")`;
  }
  return txt1;
};

const insertPDay = async (con, sql2) => {
  con.query(sql2, (err, result) => {
    //! insert promotion_by_day
    if (err) throw err;
  });
};

const insertPricePerTypeP = async (con, txt) => {
  con.query(`INSERT INTO price_per_type_p VALUES ${txt}`, (err, result) => {
    if (err) throw err;
  });
};

const checkCanReduce = async (con) => {
  var can_reduce2 = [];
  return new Promise((resolve, reject) => {
    if (!can_reduce2[0]) {
      // console.log(can_reduce2[0] == undefined);
      con.query(`SELECT service_id FROM service`, (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
          console.log({ service_id: `${result[i].service_id}` });
          can_reduce2.push({ service_id: `${result[i].service_id}` });
        }
        resolve(can_reduce2);
      });
    }
  });
};

async function insertPromotion(con, req, res) {
  const code = req.body?.code;
  const name = req.body?.name;
  const desciption = req.body?.desciption;
  const image = req.body?.image;
  const starttime = req.body?.starttime;
  const endtime = req.body?.endtime;
  const price_per_type = req.body?.price_per_typeP;
  const is_member = req.body?.is_member == "TRUE" ? 1 : 0;
  var can_reduce = req.body.can_reduce;
  // console.log(can_reduce);
  can_reduce = await checkCanReduce(con);

  console.log(can_reduce);

  var limitflag = 0;
  var limit_amount;
  var limit_type;
  if (true) {
    limit_amount = req.body?.limit_amount ?? null;
    limit_type = req.body?.limit_type ?? null;
    if (limit_amount != null || limit_type != null) {
      limitflag = 1;
    }
  }

  var dayflag = 0;
  var promotion_by_day;
  if (true) {
    promotion_by_day = req.body?.promotion_by_day ?? null;
    if (promotion_by_day != null) {
      dayflag = 1;
    }
  }

  // var rankflag = req.body?.rankflag == "TRUE" ? 1 : 0;
  // var rank = req.body?.rank ?? null;
  var rankflag = req.body?.rankflag == "TRUE" ? 1 : 0;
  var rank = req.body?.rank ?? null;

  var sql1 = `INSERT INTO promotion(code, name, desciption, image, starttime, endtime, limitflag, limit_amount, limit_type, dayflag, rankflag, rank, is_member) 
  VALUES("${code}", "${name}", "${desciption}", "${image}", "${starttime}", "${endtime}", "${limitflag}", "${limit_amount}", "${limit_type}", "${dayflag}", "${rankflag}", "${rank}", "${is_member}")`;

  var txt = await createText(code, price_per_type);
  con.connect((err) => {
    if (err) throw err;
    console.log("\nConnected!");

    con.query(
      `SELECT code FROM promotion WHERE code in ("${code}")`,
      (err, result) => {
        if (result[0] == undefined) {
          //! result == []
          con.query(sql1, async (err, result) => {
            //! insert promotion
            if (err) throw err;
            await insertPricePerTypeP(con, txt);
            console.log("insert promotion success");

            if (can_reduce[0] != undefined) {
              var txt3 = await createTextReduce(code, can_reduce);
              var sql3 = `INSERT INTO can_reduce VALUES ${txt3}`;
              await insertCanReduce(con, sql3);
            }

            if (dayflag == true) {
              var txt2 = await createTextDay(code, promotion_by_day);
              var sql2 = `INSERT INTO promotion_by_day(code, day) VALUES ${txt2}`;
              await insertPDay(con, sql2);
            }

            res.status(200).send({ msg: "OK" });
          });
        } else {
          console.log(`code ${result[0].code} is duplicate`);
          res.status(501).send({ msg: `code ${result[0].code} is duplicate` });
          return 0;
        }
      }
    );
  });
}

export { insertPromotion };

// `SELECT code FROM promotion WHERE code in ("${code}")`

// const createText = async (code, price_per_type) => {
//   var txt1 = `("${code}", "${price_per_type[0].type_of_car}", "${price_per_type[0].reduce_type}", ${price_per_type[0].reduce})`;
//   for (let i = 1; i < price_per_type.length; i++) {
//     txt1 += `,("${code}", "${price_per_type[i].type_of_car}", "${price_per_type[i].reduce_type}", ${price_per_type[i].reduce})`;
//   }
//   return txt1;
// };

// const createTextDay = async (code, promotion_by_day) => {
//   var txt1 = `("${code}", "${promotion_by_day[0].day}")`;
//   for (let i = 1; i < promotion_by_day.length; i++) {
//     txt1 += `,("${code}", "${promotion_by_day[i].day}")`;
//   }
//   return txt1;
// };

// const createTextReduce = async (code, can_reduce) => {
//   var txt1 = `("${code}", "${can_reduce[0].service_id}")`;
//   for (let i = 1; i < can_reduce.length; i++) {
//     txt1 += `,("${code}", "${can_reduce[i].service_id}")`;
//   }
//   return txt1;
// };
// `INSERT INTO promotion(code, name, desciption, image, starttime, endtime, limitflag, limit_amount, limit_type, dayflag, rankflag, rank)
// VALUES("${code}", "${name}", "${desciption}", "${image}", "${starttime}", "${endtime}", "${limitflag}", "${limit_amount}", "${limit_type}", "${dayflag}", "${rankflag}", "${rank}")`

// `INSERT INTO price_per_type_p VALUES ${txt}`

// `INSERT INTO promotion_by_day(code, day) VALUES ${txt2}`

// `INSERT INTO can_reduce VALUES ${txt3}`
