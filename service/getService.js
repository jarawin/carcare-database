

function getSerivecByc(con, req, res) {
    const service_id = req.body.service_id;
    const sql1 = `SELECT * FROM service WHERE service_id = "${service_id}"`;
    
    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not have Service
            res.status(501).send({msg : "Service does not exists"});
            console.log("Service does not exists");
        }else{//? Have Service
          res.status(200).send(result);
          console.log("Get customer success");
        }
      });
    });
  }
  
  export { getSerivecByc };