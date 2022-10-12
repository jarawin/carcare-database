
import { v4 as uuidv4 } from "uuid";
import {insertGenerateBy} from "./generateBy/insertGenerate.js"

const insertPack = async (con, sql2, res) => {
    con.query(sql2, (err, result) => {
      if (err) throw err;
      // res.status(200).send({status:"insert package success"});
      console.log("insert package success");
    });
  }

const checkService = async (con, res, service_id) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM service WHERE service_id = "${service_id}"`, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined){
          resolve(false)
      }else{
        resolve(true)
      }
    })
  })
}

  
  function insertPackage(con, req, res) {
      const package_id = uuidv4();
      const package_name = req.body.package_name;
      const package_desciption = req.body.package_desciption;
      const reduce_type = req.body.reduce_type;
      const reduce = req.body.reduce;
      const detail = req.body.detail;

      const sql1 = `SELECT package_name, package_desciption, reduce_type, reduce 
                    FROM package_info
                    WHERE package_name = "${package_name}"`;
      const sql2 = `INSERT INTO package_info(package_id,package_name,package_desciption,reduce_type,reduce) 
                    VALUES("${package_id}","${package_name}","${package_desciption}","${reduce_type}","${reduce}");`;  
      
      
      con.connect(async (err) => {
        if (err) throw err;
        console.log("\nConnected!");
        
        //! check service
        var txt = ``
        for (let i = 0; i < detail.length; i++){
          if (!(await checkService(con, res, detail[i].service_id))){
            res.status(501).send({status:`service does not exist`})
            console.log("service does not exist");
            return 0;
          }
          if (i == 0){
            txt += `("${package_id}","${detail[0].service_id}",${detail[0].max})`
          }else{
            txt += `,("${package_id}","${detail[i].service_id}",${detail[i].max})`
          }
          
        }

        console.log("Have service");
        con.query(sql1, async (err, result) => {
          if (err) throw err;
          if (result[0] == undefined){//? Not duplicate
            await insertPack(con, sql2, res)
            await insertGenerateBy(con, txt, res)
          }else{//? duplicate
            res.status(501).send("Package already exists");
            console.log("Package already exists");
          }
        });
      });
    }
    
    export {insertPackage};

/*
{
    "package_name":"asd",
    "package_desciption":"asdasd",
    "reduce_type":"PERCENT",
    "reduce":"10",
    "detail":[
        {
            "service_id":"asd",
            "max":"10"
        },{
            "service_id":"qwe",
            "max":"10"}]
}
*/