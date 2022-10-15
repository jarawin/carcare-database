   async function getPackage(con, req, res) {
      const package_id = req.query?.package_id;
      
      const sql1 = `SELECT * FROM package_info WHERE package_id = "${package_id}"`;
     
      con.connect(async (err) => {
        if (err) throw err;
        console.log("\nConnected!");

        if(!package_id){
          con.query("SELECT * FROM package_info", (err, result) => {
            if(err) throw err;
            res.status(200).send({msg: "OK" ,data:result});
            
          })
          return 0;
        }
  
        con.query(sql1, (err, result) => {
          if (err) throw err;
          if (result[0] == undefined){//? Not have account
              res.status(501).send({msg : "Package id does not exists"});
              console.log("Package id does not exists");
          }else{//? Have account
            res.status(200).send({msg: "OK",isCustomer: true, data: result[0]});
            console.log("Get Package success");
          }
        });
      });
    }
    
    export { getPackage };