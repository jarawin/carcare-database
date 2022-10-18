// const haveEmployeeId = async (con, sql) => {
//     return new Promise((resolve, reject) => {
//       con.query(sql, (err, result) => {
//         if (err) throw err;
//         if (result[0] == undefined) {
//           //? Not duplicate
//           resolve(false);
//           console.log("Invalid employee id");
//         } else {
//           //? duplicate
//           resolve(true);
//           console.log("Valid employee id");
//         }
//       });
//     });
//   };
  
  async function getCommission(con, req, res) {
      const commission_id = req.query?.commission_id;
      // const employee_id = req.query.employee_id;
      const sql1 = `SELECT * FROM commission WHERE commission_id = "${commission_id}"`;
      // const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
      
      con.connect(async (err) => {
        if (err) throw err;
        console.log("\nConnected!");
  
  
        // if (!(await haveEmployeeId(con, sqlEmployee))) {
        //   res.status(501).send({ msg: "Invalid employee id" });
        //   return 0;
        // }
  
        if (!commission_id){
          con.query("SELECT * FROM commission", (err, result) => {
            if(err) throw err;
            res.status(200).send({msg: "OK" ,data:result});
          })
        }else{
          con.query(sql1, (err, result) => {
            if (err) throw err;
            if (result[0] == undefined){//? Not have account
              res.status(200).send({msg: "OK",isCommission: false, 
              data: result[0]});
              console.log("Commission not exists");
            }else{//? Have account
              res.status(200).send({msg:"OK", isCommission: true,data:result[0]});
              console.log("Get commission success");
            }
          });
        }
      });
    }
    
    export { getCommission };

    // `SELECT * FROM commission WHERE commission_id = "${commission_id}"`
    // //TODO get one
    // "SELECT * FROM commission"
    // //TODO get all