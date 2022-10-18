const insertCom = (con, sql2, res) => {
    con.query(sql2, (err, result) => {
      if (err) throw err;
      res.status(200).send({msg:"insert commission success"});
      console.log("insert commission success");
    });
  }
  



function insertCommission(con, req, res) {
    const commission_id = req.body.commission_id;
    const topic = req.body.topic;
    const description = req.body.description;
    const quota_type = req.body.quota_type;
    const quota_amount = req.body.quota_amount;
    const amount_type = req.body.amount_type;
    const amount = req.body.amount;
    const order_type = req.body.order_type;
    
    const sql1 = `SELECT * FROM commission WHERE commission_id = "${commission_id}"`;
    const sql2 = `INSERT INTO commission(commission_id, topic, description, quota_type, quota_amount, amount_type, amount, order_type)
                  VALUES("${commission_id}","${topic}","${description}","${quota_type}","${quota_amount}","${amount_type}","${amount}","${order_type}");`;
    
    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
          insertCom(con, sql2, res)
        }else{//? duplicate
          res.status(501).send({msg:"Commission already exists"});
          console.log("Commission already exists");
        }
      });
    });
  }
  
  export { insertCommission };

  // `SELECT * FROM commission WHERE commission_id = "${commission_id}"`
  // //TODO check have commission
  // `INSERT INTO commission(commission_id, topic, description, quota_type, quota_amount, amount_type, amount, order_type)
  //  VALUES("${commission_id}","${topic}","${description}","${quota_type}","${quota_amount}","${amount_type}","${amount}","${order_type}");`
  // //TODO insert commission