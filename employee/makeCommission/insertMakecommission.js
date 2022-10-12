const haveEmployeeId = async (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined) {
        //? Not duplicate
        resolve(false);
        console.log("Not have employee id");
      } else {
        //? duplicate
        resolve(true);
        console.log("Have employee id");
      }
    });
  });
};

const haveOrderId = (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined) {
        //? Not duplicate
        resolve(false);
        console.log("Not have order id");
      } else {
        //? duplicate
        resolve(true);
        console.log("Have order id");
      }
    });
  });
};

const haveOrderIdInMakeCommmission = (con, sql) => {
  //! no one to pick up
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined) {
        //? Not duplicate
        resolve(false);
        console.log("Can insert");
      } else {
        //? duplicate
        resolve(true);
        console.log("Can not insert because one order one employee");
      }
    });
  });
};

async function insertMakeCommission(con, req, res) {
  const employee_id = req.body?.employee_id;
  const order_id = req.body?.order_id;

  const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
  const sqlOrder = `SELECT * FROM orderlist WHERE order_id = "${order_id}"`;
  const sqlMc = `SELECT * FROM make_commission WHERE order_id = "${order_id}"`;
  var sql1 = `INSERT INTO make_commission(employee_id, order_id) 
                VALUES("${employee_id}", "${order_id}")`;

  con.connect(async (err) => {
    if (err) throw err;
    console.log("\nConnected!");

    if (!(await haveOrderId(con, sqlOrder))) {
      res.status(501).send({ msg: "Not have order id" });
      return 0;
    }
    if (!(await haveEmployeeId(con, sqlEmployee))) {
      res.status(501).send({ msg: "Not have employee id" });
      return 0;
    }
    if (await haveOrderIdInMakeCommmission(con, sqlMc)) {
      res
        .status(501)
        .send({ msg: "Can not insert because one order one employee" });
      return 0;
    }

    con.query(sql1, (err, result) => {
      if (err) throw err;
      console.log("insert make commission success");
      res.status(200).send({ msg: "insert make commission success" });
    });
  });
}

export { insertMakeCommission };
