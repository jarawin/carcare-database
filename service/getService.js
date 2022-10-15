function getService(con, req, res) {
    const service_id = req.query?.service_id;
    const sql1 = `SELECT * FROM service WHERE service_id = "${service_id}"`;
    
    con.connect(async (err) => {
      if (err) throw err;
      console.log("\nConnected!");

      if (!service_id) {
        con.query("SELECT * FROM service", (err, result) => {
          if(err) throw err;
          res.status(200).send({msg: "OK" ,data:result});
          console.log("Get all service success");
        })
        return 0;
      }
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not have Service
          res.status(200).send({msg: "OK",isService: false, data: result[0]});
            console.log("Service does not exists");
        }else{//? Have Service
          res.status(200).send({msg: "OK",isService: true, data: result[0]});
          console.log("Get service success");
        }
      });
    });
  }
  
  export { getService };