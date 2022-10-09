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

function register(con, req, res) {
    const customer_id = req.body.customer_id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const picture_url = req.body.picture_url;//! url
    const firstlogin_time = Date.now();
    const lastlogin_time = Date.now();
    const rank = req.body.rank;
    const customer_type = req.body.customer_type;
    const sql1 = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
    const sql2 = `INSERT INTO customer(customer_id, fname, lname, email, picture_url, firstlogin_time, lastlogin_time, rank, customer_type) 
                  VALUES("${customer_id}","${fname}","${lname}","${email}","${picture_url}","${firstlogin_time}","${lastlogin_time}","${rank}","${customer_type}");`;


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
              res.status(200).send(result);
              console.log("Get customer success");
            }
          });
        });
      }

    
    
    
  }
  
  export { register };