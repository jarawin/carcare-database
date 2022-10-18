import e from "express";
import { v4 as uuidv4 } from "uuid";


const havePackageId = async (con, packages) => {
    var txt = `("${packages[0].package_id}"`
    for (let i = 1; i < packages.length; i++){
      txt += `,"${packages[i].package_id}"`
    }
    txt += `)`
    console.log(txt);
  
    return new Promise((resolve, reject) => {
      con.query(`SELECT * FROM package_info WHERE package_id IN ${txt}`, (err, result) => {
        if (err) throw err;
        if (result.length != packages.length){
            resolve(false)
        }else{
          resolve(true)
        }
      })
    })
  }

const createText = async (customer_id, packages, time) => {
  var txt = `("${customer_id}", "${packages[0].package_id}", ${time})`;
  for (let i = 1; i < packages.length; i++){
    txt += `,("${customer_id}", "${packages[i].package_id}", ${time})`
  }
  return txt
}

const haveCustomerId = (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined){//? Not duplicate
        resolve(false)
        console.log("Have not customer");
      }else{//? duplicate
        resolve(true)
        console.log("Have customer");
      }
    });
  })
}




function insertBuy(con, req, res) {
    const customer_id = req.body.customer_id; //! please verify
    const packages = req.body.packages; //! please verify
    const time = Date.now();

    const sqlCustoemr = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
   
    con.connect(async (err) => {
      if (err) throw err;
      console.log("\nConnected!");

      if (!(await haveCustomerId(con, sqlCustoemr))){
        res.status(501).send({msg:"Not have customer id"})
        return 0;
      }

      if (!(await havePackageId (con, packages))){
        console.log("Not have package");
        res.status(501).send({msg:"Not have package"})
        return 0;
      }

      var txtO = await createText(customer_id, packages, time);
      con.query(`INSERT INTO buy VALUES ${txtO};`, (err ,result) => {
        if (err) throw err;
        console.log("Insert buy success");
        con.query(`UPDATE customer SET customer_type = "MEMBER" WHERE customer_id = "${customer_id}"`, (err, result) => {
          if (err) throw err;
          res.status(200).send({msg:"Insert buy success"})
        })
      })
  })}
  
  export {insertBuy}

  // `SELECT * FROM package_info WHERE package_id IN ${txt}`
  // //TODO check have package_id
  // `SELECT * FROM customer WHERE customer_id = "${customer_id}"`
  // //TODO check have package_id
  // `INSERT INTO buy VALUES ${txtO};`
  // //TODO insert buy
  // `UPDATE customer SET customer_type = "MEMBER" WHERE customer_id = "${customer_id}"`
  // //TODO update customer type จาก general เป็น member