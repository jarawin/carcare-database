const haveCustomer = async (con, customer_id) => {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM customer WHERE customer_id = "${customer_id}" `,
      (err, result) => {
        if (err) throw err;
        if (!result[0]) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const haveCode = async (con, code) => {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM promotion WHERE code = "${code}" `,
      (err, result) => {
        if (err) throw err;
        if (!result[0]) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const haveService = async (con, service_id) => {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM service WHERE service_id = "${service_id}" `,
      (err, result) => {
        if (err) throw err;
        // console.log(result);
        if (!result[0]) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

const canUseP = (con, req, res) => {
  const code = req.query.code;
  const customer_id = req.query.customer_id;
  const services = req.body.services;
  const type_car = req.query.type_car;
  // console.log(services);

  con.connect(async (err) => {
    if (err) throw err;
    console.log("\nConnected!");

    if (!(await haveCustomer(con, customer_id))) {
      res.status(200).send({ msg: "Not have customer id" });
      return 0;
    }

    if (!(await haveCode(con, code))) {
      res.status(200).send({ msg: "Not have code" });
      return 0;
    }
    try {
      let x = services.length;
    } catch (error) {
      res.status(200).send({ msg: "Array" });
      return 0;
    }
    for (let i = 0; i < services.length; i++) {
      if (!(await haveService(con, services[i].service_id))) {
        res.status(200).send({ msg: "Not have service" });
        return 0;
      }
    }

    const sql1 = `SELECT * FROM promotion WHERE code = "${code}" `;
    const sql2 = `SELECT * FROM customer WHERE customer_id = "${customer_id}" `;
    // const sql3 = `SELECT * FROM service WHERE service_id = "${service_id}" `
    con.query(sql1, (err, result1) => {
      if (err) throw err;
      // console.log(result1);
      con.query(sql2, (err, result2) => {
        if (err) throw err;

        if (result1[0].rankflag == 1) {
          if (result1[0].rank == "SILVER" && result2[0].rank == "BRONZE") {
            console.log("Condition not match");
            res
              .status(200)
              .send({ msg: "Condition not match", isCanUse: false });
            return 0;
          }
          if (result1[0].rank == "GOLD" && result2[0].rank != "GOLD") {
            console.log("Condition not match");
            res
              .status(200)
              .send({ msg: "Condition not match", isCanUse: false });
            return 0;
          }
        }

        if (result1[0].member == 1 && result2[0].customer_type != "MEMBER") {
          res
            .status(200)
            .send({ msg: "Customer is not member", isCanUse: false });
          return 0;
        }

        if (
          !(result1[0].starttime < Date.now || Date.now < result1[0].endtime)
        ) {
          res.status(200).send({ msg: "Time not match", isCanUse: false });
          return 0;
        }

        if (result1[0].dayflag == 1) {
          console.log("eiei");
          con.query(
            `SELECT *,(SELECT DAYNAME(CURRENT_DATE)) AS DAYNOW FROM promotion_by_day WHERE code = "${code}";`,
            (err, result11) => {
              if (err) throw err;

              for (let i = 0; i < result11.length; i++) {
                if (result11[i].day != result11[i].DAYNOW) {
                  res
                    .status(200)
                    .send({ msg: "Day not match", isCanUse: false });
                  return 0;
                }
              }
            }
          );
        }

        if (result1[0].limitflag == 1) {
          if (result1[0].limit_type == "DAILY") {
            con.query(
              `SELECT COUNT(*) AS count FROM orderlist WHERE code = "${code}"`,
              (err, result12) => {
                if (err) throw err;

                if (result1[0].limit_amount < result12[0].count) {
                  res
                    .status(200)
                    .send({ msg: "limit per day", isCanUse: false });
                  return 0;
                }
              }
            );
          }
          // if(result1[0].limit_type == "MONTHLY"){

          // }
        }
        con.query(
          `SELECT * FROM can_reduce WHERE code = "${code}"`,
          (err, result33) => {
            if (err) throw err;

            var reduce = [];
            for (let i = 0; i < services.length; i++) {
              for (let j = 0; j < result33.length; j++) {
                if (services[i].service_id == result33[j].service_id) {
                  con.query(
                    `SELECT * FROM price_per_type_p WHERE code = "${code}" AND type_of_car = "${type_car}"`,
                    (err, result333) => {
                      if (err) throw err;
                      console.log(result333);
                      reduce.push({
                        service_id: `${services[i].service_id}`,
                        type_of_car: "type_car",
                        reduce_type: `${result333[0].reduce_type}`,
                        reduce: `${result333[0].reduce}`,
                      });
                    }
                  );
                }
              }
            }
            res.status(200).send(reduce);
          }
        );

        if (result1[0].member == 1 && result2[0].customer_type != "MEMBER") {
          res
            .status(200)
            .send({ msg: "Customer is not member", isCanUse: false });
          return 0;
        }

        if (
          !(result1[0].starttime < Date.now || Date.now < result1[0].endtime)
        ) {
          res.status(200).send({ msg: "Time not match", isCanUse: false });
          return 0;
        }

        if (result1[0].dayflag == 1) {
          console.log("eiei");
          con.query(
            `SELECT *,(SELECT DAYNAME(CURRENT_DATE)) AS DAYNOW FROM promotion_by_day WHERE code = "${code}";`,
            (err, result11) => {
              if (err) throw err;

              for (let i = 0; i < result11.length; i++) {
                if (result11[i].day != result11[i].DAYNOW) {
                  res
                    .status(200)
                    .send({ msg: "Day not match", isCanUse: false });
                  return 0;
                }
              }
            }
          );
        }

        if (result1[0].limitflag == 1) {
          if (result1[0].limit_type == "DAILY") {
            con.query(
              `SELECT COUNT(*) AS count FROM orderlist WHERE code = "${code}"`,
              (err, result12) => {
                if (err) throw err;

                if (result1[0].limit_amount < result12[0].count) {
                  res
                    .status(200)
                    .send({ msg: "limit per day", isCanUse: false });
                  return 0;
                }
              }
            );
          }
          // if(result1[0].limit_type == "MONTHLY"){

          // }
        }
        con.query(
          `SELECT * FROM can_reduce WHERE code = "${code}"`,
          async (err, result33) => {
            if (err) throw err;

            var reduce = [];
            for (let i = 0; i < services.length; i++) {
              for (let j = 0; j < result33.length; j++) {
                if (services[i].service_id == result33[j].service_id) {
                  reduce.push(
                    await nestedddd(con, code, type_car, services, i)
                  );
                }
              }
            }
            console.log(reduce);
            res.status(200).send({ msg: "OK", isCanUse: 1, data: reduce });
          }
        );
      });
    });
  });
};

export { canUseP };

const nestedddd = async (con, code, type_car, services, i) => {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM price_per_type_p WHERE code = "${code}" AND type_of_car = "${type_car}"`,
      (err, result333) => {
        if (err) throw err;
        // console.log(result333);
        // console.log({"service_id":`${services[i].service_id}`,"type_of_car":"type_car", "reduce_type":`${result333[0].reduce_type}` , "reduce":`${result333[0].reduce}`});
        // reduce.push({"service_id":`${services[i].service_id}`,"type_of_car":"type_car", "reduce_type":`${result333[0].reduce_type}` , "reduce":`${result333[0].reduce}`})
        // console.log(reduce);
        resolve({
          service_id: `${services[i].service_id}`,
          type_of_car: `${type_car}`,
          reduce_type: `${result333[0].reduce_type}`,
          reduce: `${result333[0].reduce}`,
        });
      }
    );
  });
};
