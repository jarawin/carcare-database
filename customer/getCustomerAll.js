
async function checkEmployee(con, sql1, res){
    return new Promise((resolve, reject) => {
        con.query(sql1, (err, result) => {
            if (err) throw err;
            // console.log(result);
            // console.log("result[0] == undefined --> "+ result[0] == undefined);
            if (result[0] == undefined){
                // console.log("return true");
                resolve(true);
            }else{
                // console.log("return false");
                resolve(false);
            }
        })
    })
}

const getAllcustomerBye = (con, req, res) => {
    const employee_id = req.body.employee_id;
    var sql1 = `SELECT employee_id FROM employee WHERE employee_id = "${employee_id}"`;
    
    con.connect(async (err) => {
        if (err) throw err;
        console.log("\nConnected!");

        // console.log(checkEmployee(con, sql1, res));
        if(await checkEmployee(con, sql1, res)){
            res.status(501).send({msg:"Not employee"});
            console.log("Not employee");
            return 0;
        }
        con.query("SELECT * FROM customer", (err, result) => {
            res.status(200).send(result);
            console.log("Get all success");
        })
    })
}

export {getAllcustomerBye}