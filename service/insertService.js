const insertSer = (con, sql2, res) => {
    con.query(sql2, (err, result) => {
      if (err) throw err;
      res.status(200).send("insert service success");
      console.log("insert service success");
    });
  }
  
const checkCommission = (con, sql0, res) => {
    con.query(sql0, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){
            res.status(501).send("Please add commission before add service")
            console.log("Please add commission before add service");
            return 0;
        }
        return 1;
    })
}

function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }
function insertService(con, req, res) {
    const service_id = req.body.service_id;
    const name = req.body.name;
    const description = req.body.description;
    const image = req.body.image;
    const commission_id = req.body.commission_id;
    const sql0 = `SELECT * FROM commission WHERE commission_id = "${commission_id}"`
    const sql1 = `SELECT * FROM service WHERE service_id = "${service_id}"`;
    const sql2 = `INSERT INTO service(service_id, name, description, image, commission_id)
                  VALUES("${service_id}","${name}","${description}","${image}","${commission_id}");`;
    //TODO check URL

    if (!isValidHttpUrl(image)){
        res.status(501).send(`image is not url`)
        console.log(`image is not url`);
        return 0;
        }
    console.log("check url success");
    
    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");

      if(!checkCommission(con, sql0, res)){
        return 0;
      }
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
          insertSer(con, sql2, res)
        }else{//? duplicate
          res.status(501).send("Service already exists");
          console.log("Service already exists");
        }
      });
    });
  }
  
  export { insertService };