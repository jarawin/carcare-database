const createText = async (service_id,service_items, pricePerType) => {
  var txt1 = `("${service_id}", "${service_items[0].name}", ${service_items[0].period_time})`;
  for (let i = 1; i < service_items.length; i++){
    txt1 += `,("${service_id}", "${service_items[i].name}", ${service_items[i].period_time})`
  }

  var txt2 = `("${service_id}", "${pricePerType[0].type_of_car}", ${pricePerType[0].price})`;
  for (let i = 1; i < pricePerType.length; i++){
    txt2 += `,("${service_id}", "${pricePerType[i].type_of_car}", ${pricePerType[i].price})`
  }
  return [txt1, txt2]
}

const insertSer = async (con, sql2) => {
    con.query(sql2, (err, result) => {
      if (err) throw err;
    });
  }

const insertPricePerTypeS = async (con, txt) => {
  con.query(`INSERT INTO price_per_type_s VALUES ${txt}`, (err, result) => {
    if (err) throw err;
  });
}

const insertServiceItem = async (con, txt) =>{
  con.query(`INSERT INTO service_items VALUES ${txt}`, (err, result) => {
    if (err) throw err;
  });
}
  
const checkCommission = async (con, sql0, res) => {
    return new Promise((resolve, reject) => {
      con.query(sql0, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){
            resolve(false)
        }else{
          resolve(true)
        }  
      })
    })
}

async function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {//! not url
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

async function insertService(con, req, res) {
    const service_id = req.body?.service_id;
    const name = req.body.name;
    const description = req.body.description;
    const image = req.body.image;
    const commission_id = req.body.commission_id;
    const pricePerType = req.body.price_per_typeS;
    const service_items = req.body.service_items;
    var sql0 = `SELECT * FROM commission WHERE commission_id = "${commission_id}"`
    var sql1 = `SELECT * FROM service WHERE service_id = "${service_id}"`;
    var sql2 = `INSERT INTO service(service_id, name, description, image, commission_id)
                  VALUES("${service_id}","${name}","${description}","${image}","${commission_id}");`;
    //TODO check URL

    if (!(await isValidHttpUrl(image))){
        res.status(501).send({msg:"image is not url"})
        console.log(`\nimage is not url`);
        return 0;
        }
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log("\ncheck url success");
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    con.connect(async (err) => {
      if (err) throw err;
      console.log("Connected!");

      if(!(await checkCommission(con, sql0, res))){
        res.status(501).send({msg:"Please add commission before add service"})
        console.log("Please add commission before add service");
        return 0;
      }

      console.log("insert");
      con.query(sql1, async (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
          var [txt1,txt2] = await createText(service_id,service_items, pricePerType)
          await insertSer(con, sql2, res)
          await insertPricePerTypeS(con, txt2);
          await insertServiceItem(con, txt1);
          
          res.status(200).send({msg:"insert service success"});
          console.log("insert service success");
        }else{//? duplicate
          res.status(501).send({msg:"Service already exists"});
          console.log("Service already exists");
        }
      });
    });
    
  }
  
  export { insertService };



  // `SELECT * FROM commission WHERE commission_id = "${commission_id}"`
  // //TODO check Commission
  // `SELECT * FROM service WHERE service_id = "${service_id}"`;
  // //TODO get service for check duplicate
  // `INSERT INTO service(service_id, name, description, image, commission_id)
  //  VALUES("${service_id}","${name}","${description}","${image}","${commission_id}");`
  // //TODO insert service
  //   `INSERT INTO price_per_type_s VALUES ${txt}`
  // //TODO insert PricePerTypeS
  // `INSERT INTO service_items VALUES ${txt}`
  // //TODO insert ServiceItem

  