function insertPromotion(con, req, res) {
  const code = req.body?.code;
  const name = req.body?.name;
  const desciption = req.body?.desciption;
  const image = req.body?.image;
  const starttime = req.body?.starttime;
  const endtime = req.body?.endtime;

  var limitflag = req.body?.limitflag;
  var limit_amount;
  var limit_type;
  if (limitflag == 1) {
    limit_amount = req.body?.limit_amount ?? null;
    limit_type = req.body?.limit_type ?? null;
    if (limit_amount == null || limit_type == null) {
      limitflag = 0;
    }
  }

  var dayflag = req.body?.dayflag;
  var day;
  if (dayflag == 1) {
    day = req.body?.day ?? null;
    if (day == null) {
      dayflag = 0;
    }
  }

  var rankflag = req.body?.rankflag;
  var rank;
  if (rankflag == 1) {
    rank = req.body?.rank ?? null;
    if (rank == null) {
      rankflag = 0;
    }
  }

  con.connect((err) => {
    if (err) throw err;
    console.log("\nConnected!");

    con.query(
      `SELECT code FROM promotion WHERE code in ("${code}")`,
      (err, result) => {
        if (result[0] == undefined) {
          //! result == []
          var sql1 = `INSERT INTO promotion(code, name, desciption, image, starttime, endtime, limitflag, limit_amount, limit_type, dayflag, rankflag, rank) 
                    VALUES("${code}", "${name}", "${desciption}", "${image}", "${starttime}", "${endtime}", "${limitflag}", "${limit_amount}", "${limit_type}", "${dayflag}", "${rankflag}", "${rank}")`;
          con.query(sql1, (err, result) => {
            if (err) throw err;
            console.log("insert promotion success");
            res.status(200).send("Message : OK")
            if (dayflag == true) {
              var sql2 = `INSERT INTO promotion_by_day(code, day) 
                                        VALUES("${code}", "${day}")`;
              con.query(sql2, (err, result) => {
                if (err) throw err;
                console.log("insert promotion_by_day success");
                res.status(200).send("{Message : OK}")
              });
            } else {
              console.log("no promotion_by_day");
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