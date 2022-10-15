async function getBuy(con, req, res) {
    const customer_id = req.query?.customer_id;
    // const employee_id = req.query.employee_id;
    const sql1 = `SELECT * FROM buy WHERE customer_id = "${customer_id}"`;
    
    con.connect(async (err) => {
      if (err) throw err;
      console.log("\nConnected!");

      if(!customer_id){
        con.query("SELECT * FROM buy", (err, result) => {
          if(err) throw err;
          res.status(200).send({msg: "OK" ,data:result});
        })
      }else{
        con.query(sql1, (err, result) => {
          if (err) throw err;
          if (result[0] == undefined){//? Not have account
            res.status(200).send({msg: "OK",isCustomer: false, 
            data: result[0]});
            console.log("Account not exists");
          }else{//? Have account
            res.status(200).send({msg: "OK",isCustomer: true, 
            data: result[0]});
            console.log("Account already exists");
          }
        });
      }
    });
  }
  
  export { getBuy };