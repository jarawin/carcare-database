

function getCustomeByc(con, req, res) {
    const customer_id = req.body.customer_id;
    const sql1 = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
    
    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not have account
            res.status(501).send({msg : "Account does not exists"});
            console.log("Account does not exists");
        }else{//? Have account
          res.status(200).send(result);
          console.log("Get customer success");
        }
      });
    });
  }
  
  export { getCustomeByc };