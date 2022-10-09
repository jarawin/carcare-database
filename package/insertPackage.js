import e from "express";
import { v4 as uuidv4 } from "uuid";

const insertPack = (con, sql2, res) => {
    con.query(sql2, (err, result) => {
      if (err) throw err;
      res.status(200).send({status:"insert package success"});
      console.log("insert package success");
    });
  }

const checkService = async (con, res, detail) =>{
    var flag = true
    detail.forEach(async val => {
            console.log(val);
            await con.query( "SELECT service_id FROM service WHERE service_id = ?",val.service_id, async (err, result) => {
                            if (err) throw err;
                            if (result[0] == undefined){
                                res.status(501).send([{service_id:`${val.service_id}`},{status:`service does not exist`}])
                                console.log(`${val.service_id} service does not exist`);
                                flag = false;
                            }
                        });
        })
    return flag;
}

// const asd = (con, res, detail) =>{
//     detail.forEach(val => {
//         console.log(val);
//         con.query( "SELECT service_id FROM service WHERE service_id = ?",val.service_id, (err, result) => {
//                           if (err) throw err;
//                           if (result[0] == undefined){
//                             res.status(501).send([{service_id:`${val.service_id}`},{status:`service does not exist`}])
//                             console.log(`${val.service_id} service does not exist`);
//                             return false;
//                         }
//                       });
//     })
// }

  
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
      
      
      con.connect((err) => {
        if (err) throw err;
        console.log("\nConnected!");
        
        if (!checkService(con, res, detail)){
            console.log("Have not service");
            return 0;
        }else{
            console.log("Have service");
            con.query(sql1, (err, result) => {
                if (err) throw err;
                if (result[0] == undefined){//? Not duplicate
                  insertPack(con, sql2, res)
                }else{//? duplicate
                  res.status(501).send("Package already exists");
                  console.log("Package already exists");
                }
              });
        }
 
        
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