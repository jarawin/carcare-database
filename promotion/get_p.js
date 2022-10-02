function getPromotion(con, req, res) {
  var code = req.body?.code ?? null;
  if (code == null) {
    console.log("code is null");
    res.status(404).send("code is null");
    return 0;
  } else {
    const sql1 = `SELECT * FROM promotion WHERE code = "${req.body.code}"`;
    const sql2 = `SELECT * 
                  FROM promotion AS p
                  INNER JOIN promotion_by_day AS pd ON p.code = pd.code
                  WHERE pd.code= "${req.body.code}";`;
    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");

      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined) {
          console.log("Not found code");
          res.status(404).send("{code : Not found}");
        } else {
          if (result[0].dayflag == 1) {
            console.log("Join!");
            con.query(sql2, (err, result) => {
              if (err) throw err;
              res.status(200).send(result);
              console.log("get promotion success");
            });
          } else {
            res.status(200).send(result);
            console.log("get promotion success");
          }
        }
      });
    });
  }
}

function getAllPromotion(con, req, res) {
  const sql1 = `SELECT * FROM promotion`;
  const sql2 = `SELECT * 
                FROM promotion AS p
                LEFT JOIN promotion_by_day AS pd ON p.code = pd.code;`;
  con.connect((err) => {
    if (err) throw err;
    console.log("\nConnected!");

    con.query(sql1, (err, result) => {
      if (err) throw err;
      res.status(200).send(result);
      console.log("get all promotion success");
    });
  });
}

export { getPromotion, getAllPromotion };
