async function loginC(con, req, res) {
    const customer_id = req.query.customer_id;
    const sql1 = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
    
    con.connect((err) => {
      if (err) throw err;
      console.log("Connected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
            res.status(200).send({msg: "OK",isCustomer: false, 
            data: result[0]});
            console.log("Account not exists");
        }else{//? duplicate
            res.status(200).send({msg: "OK",isCustomer: true, 
            data: result[0]});
            console.log("Account already exists");
        }
      });
    });
  }
  
export {loginC};