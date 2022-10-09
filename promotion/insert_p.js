const insertPDay = (con, sql2, res) => {
  con.query(sql2, (err, result) => {//! insert promotion_by_day
    if (err) throw err;
    console.log("insert promotion_by_day success");
    res.status(200).send("{Message : OK}")
  })
}

function insertPromotion(con, req, res) {
  const code = req.body?.code;
  const name = req.body?.name;
  const desciption = req.body?.desciption;
  const image = req.body?.image;
  const starttime = req.body?.starttime;
  const endtime = req.body?.endtime;

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
  var day;
  if (true) {
    day = req.body?.day ?? null;
    if (day != null) {
      dayflag = 1;
    }
  }

  var rankflag = 0;
  var rank;
  if (true) {
    rank = req.body?.rank ?? null;
    if (rank != null) {
      rankflag = 1;
    }
  }

  var sql1 = `INSERT INTO promotion(code, name, desciption, image, starttime, endtime, limitflag, limit_amount, limit_type, dayflag, rankflag, rank) 
  VALUES("${code}", "${name}", "${desciption}", "${image}", "${starttime}", "${endtime}", "${limitflag}", "${limit_amount}", "${limit_type}", "${dayflag}", "${rankflag}", "${rank}")`;

  var sql2 = `INSERT INTO promotion_by_day(code, day) VALUES("${code}", "${day}")`;

  con.connect((err) => {
    if (err) throw err;
    console.log("\nConnected!");

    con.query(`SELECT code FROM promotion WHERE code in ("${code}")`,(err, result) => {
        if (result[0] == undefined) {
          //! result == []
          con.query(sql1, async (err, result) => { //! insert promotion
            if (err) throw err;
            console.log("insert promotion success");
            if (dayflag == true) {
              insertPDay(con, sql2, res)
            }else{
              console.log("no promotion_by_day");
              res.status(200).send("Message : OK")
            }
          });
        } else {
          console.log(`code ${result[0].code} is duplicate`);
          res.status(404).send("{code : duplicate}");
          return 0;
        }
      }
    );
  });
}

export {insertPromotion};