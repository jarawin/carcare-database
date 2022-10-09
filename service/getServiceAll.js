

const getAllService = (con, req, res) => {
    var sql1 = `SELECT * FROM service`;
    
    con.connect(async (err) => {
        if (err) throw err;
        console.log("\nConnected!");

        con.query(sql1, (err, result) => {
            if (err) throw err;
            res.status(200).send(result);
            console.log("Get all success");
        })
    })
}

export {getAllService }