
async function checkEmployee(con, sql1, res){
    return new Promise((resolve, reject) => {
        con.query(sql1, (err, result) => {
            if (result[0] == undefined){
                resolve(true);
            }else{
                resolve(false);
            }
        })
    })
}

const getAllpackage = (con, req, res) => {
    const employee_id = req.query.employee_id;
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
        con.query("SELECT * FROM package_info", (err, result) => {
            res.status(200).send({msg:"OK",data:result});
            console.log("Get all success");
        })
    })
}

export {getAllpackage}