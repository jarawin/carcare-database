const haveEmployeeId = async (con, sql) => {
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined) {
          //? Not duplicate
          resolve(false);
          console.log("Invalid employee id");
        } else {
          //? duplicate
            // if (result[0].apply_status != "pending"){

            // }
          resolve(true);
          console.log("Valid employee id");
        }
      });
    });
  };

function getOrderlist(con, req, res) {
    const employee_id = req.body.employee_id;
    const order_id = req.body.order_id;
    
    const sql0 = `SELECT *
                  FROM make_commission AS mc
                  WHERE order_id = "${order_id}";`
    const sql1 = `SELECT c.customer_id, c.fname, c.picture_url, c.rank, c.customer_type, o.order_id, o.type_car, o.color_car, o.license_car, o.nickname, o.order_status, o.tel, o.is_booking, o.booking_time, o.arrived_time, o.code, o.order_type
                  FROM customer AS c, make_order AS mo, orderlist AS o
                  WHERE c.customer_id = mo.customer_id AND mo.order_id = o.order_id AND o.order_id = "${order_id}";
                  SELECT si.service_id, si.name, si.period_time, i.is_done
                  FROM  orderlist AS o, included AS i, service AS s, service_items AS si
                  WHERE o.order_id = i.order_id AND i.service_id = s.service_id AND s.service_id = si.service_id AND o.order_id = "${order_id}";`

    const sql2 = `SELECT c.customer_id, c.fname, c.picture_url, c.rank, c.customer_type, o.order_id, o.type_car, o.color_car, o.license_car, o.nickname, o.order_status, o.tel, o.is_booking, o.booking_time, o.arrived_time, o.code, o.order_type, e.employee_id, e.fname, e.lname, e.picture_url
                 FROM customer AS c, make_order AS mo, orderlist AS o, make_commission AS mc, employee AS e
                 WHERE c.customer_id = mo.customer_id AND mo.order_id = o.order_id AND o.order_id = mc.order_id AND mc.employee_id = e.employee_id AND o.order_id = "${order_id}";

                 SELECT si.service_id, si.name, si.period_time, i.is_done
                 FROM  orderlist AS o, included AS i, service AS s, service_items AS si
                 WHERE o.order_id = i.order_id AND i.service_id = s.service_id AND s.service_id = si.service_id AND o.order_id = "${order_id}";

                 SELECT 
                     CASE WHEN mc.order_id IS NULL THEN 'True' ELSE 'FALSE' END AS isMakeCommission
                 FROM make_commission AS mc
                 WHERE order_id = "${order_id}";`
    const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
    con.connect(async (err) => {
        if (err) throw err;
        console.log("\nConnected!");

        if (!(await haveEmployeeId(con, sqlEmployee))){
            res.status(501).send({ msg: "Invalid employee id" });
            return 0;
        }

        con.query(sql1, (err, result) => {
            if (err) throw err;
            result[0][0].commission = 123
            result[0][0].promotion = 123
            res.status(200).send(result)
            // con.query(sql2, (err, result) => {
            //     if (err) throw err;
            //     result[1] = {isMakeCommission : "True"}
            //     res.status(200).send(result)
    
            // })

        })
    })
}

export { getOrderlist };
