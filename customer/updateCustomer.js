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

const updateCustomer = (con, req, res) => {
    var customer_idH = req.query?.customer_id;
    var customer_id = req.body.customer_id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const picture_url = req.body.picture_url;//! url
    const firstlogin_time = req.body.firstlogin_time;
    const lastlogin_time = req.body.lastlogin_time;
    const rank = req.body.rank;
    const customer_type = req.body.customer_type;
    const tel = req.body.tel;
    con.connect(async (err) => {
        if(err) throw err;
        console.log("\nConnected!");

    if (!customer_idH){
        res.status(200).send({msg:"Customer id does not exist eiei",isCustomer: false})
        return 0;
    }else{
        con.query(`SELECT * FROM customer WHERE customer_id ="${customer_idH}"`, (err, result) => {
            if(err) throw err;
            if(!result[0]){
                res.status(501).send({msg:"Customer_id does not exist", isCustomer:false})
                console.log("Not have customer");
            }else{
                if (!isValidHttpUrl(picture_url)){ //TODO check URL
                    res.status(501).send(`picture_url is not url`)
                    console.log(`image is not url`);
                    return 0;
                  }
                    
                if (!isPhoneNumber(tel)){//TODO check phone
                    res.status(501).send("Not phone format")
                    console.log("Not phone format");
                    return 0;
                }else{
                    console.log("\ncheck phone success");
                }

                con.query(`UPDATE customer 
                    SET 
                        customer_id ="${customer_id}",
                        fname = "${fname}",
                        lname = "${lname}",
                        email = "${email}",
                        picture_url = "${picture_url}",
                        firstlogin_time = ${firstlogin_time},
                        lastlogin_time = ${lastlogin_time},
                        rank = "${rank}",
                        customer_type = "${customer_type}",
                        tel = "${tel}"
                      WHERE customer_id = "${customer_idH}"`,(err, result) => {
                        if(err) throw err;
                        console.log("Update customer success");
                        res.status(200).send({msg:"OK", isCustomer: true})
                })
            }
           })
        // const sql1 = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
        // con.query(sql1, (err, result1) => {
        //     if (err) throw err;
        //     if (!result1[0]){
        //         res.status(200).send({msg:"Customer id does not exist",data:result1[0]})
        //     }else{
        //         con.query(`DELETE FROM customer WHERE customer_id = "${customer_id}"`, (err, result) => {
        //             if (err) throw err;
        //             res.status(200).send({msg:"Delete success",data:result[0]})
        //         })
        //     }
            
            
        // })
        
    }
    })
    
}

export {updateCustomer}


// `SELECT * FROM customer WHERE customer_id ="${customer_idH}"`
// //TODO check have customer
// `UPDATE customer SET customer_id ="${customer_id}",fname = "${fname}", lname = "${lname}", email = "${email}",picture_url = "${picture_url}",
// firstlogin_time = ${firstlogin_time},lastlogin_time = ${lastlogin_time},rank = "${rank}",customer_type = "${customer_type}",tel = "${tel}"
// WHERE customer_id = "${customer_idH}"`
// //TODO update customer