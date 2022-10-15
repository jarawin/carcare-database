const insertCus = (con, sql2, res) => {
    con.query(sql2, (err, result) => {
      if (err) throw err;
      res.status(200).send({msg:"insert customer success"});
      console.log("insert customer success");
    });
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

const isPhoneNumber = (phone) => {
  var phoneno = /((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))|((\+๖๖|๐)([๐-๙]{1,2}\-?[๐-๙]{3}\-?[๐-๙]{3,4}))/gm;
  if(phone.match(phoneno)){
      return true;
  }else{
      return false;
  }
}

async function register(con, req, res) {
    var customer_id = req.body?.customer_id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const picture_url = req.body.picture_url;//! url
    const firstlogin_time = Date.now();
    const lastlogin_time = Date.now();
    const rank = "BRONZE";
    const customer_type = "GENERAL";
    const tel = req.body.tel;
    const sql1 = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
    const sql2 = `INSERT INTO customer(customer_id, fname, lname, email, picture_url, firstlogin_time, lastlogin_time, rank, customer_type, tel) 
                  VALUES("${customer_id}","${fname}","${lname}","${email}","${picture_url}","${firstlogin_time}","${lastlogin_time}","${rank}","${customer_type}","${tel}");`;

    if(customer_id == undefined){
      res.status(501).send(`Invalid customer id`)
      console.log(`Invalid customer id`);
      return 0;
    }
    
    //TODO check phone
    if (!isPhoneNumber(tel)){
      res.status(501).send("Not phone format")
      console.log("Not phone format");
      return 0;
    }else{
      console.log("\ncheck phone success");
    }

    //TODO check URL
    
    if (!isValidHttpUrl(picture_url)){
        res.status(501).send(`picture_url is not url`)
        console.log(`image is not url`);
        return 0;
      }else{
        console.log("\ncheck url success");
        con.connect((err) => {
          if (err) throw err;
          console.log("Connected!");
          
          con.query(sql1, (err, result) => {
            if (err) throw err;
            if (result[0] == undefined){//? Not duplicate
              insertCus(con, sql2, res)
            }else{//? duplicate
              res.status(200).send({msg:"Get customer success",data:result[0]});
              console.log("Get customer success");
            }
          });
        });
      }
  }
  
  export { register };