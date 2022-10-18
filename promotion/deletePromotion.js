const deletePromotion = (con, req, res) => {
    var code = req.query?.code;
    if (!code){
        // console.log(JSON.stringify(code));
        res.status(200).send({msg:"code does not exist"})
        return 0;
    }else{
        const sql1 = `SELECT * FROM promotion WHERE code = "${code}"`;
        con.query(sql1, (err, result1) => {
            if (err) throw err;
            if (!result1[0]){
                res.status(200).send({msg:"code does not exist",data:result1[0]})
            }else{
                con.query(`DELETE FROM promotion WHERE code = "${code}"`, (err, result) => {
                    if (err) throw err;
                    res.status(200).send({msg:"Delete success",data:result[0]})
                })
            }
        })    
    }
}

export {deletePromotion}

// `SELECT * FROM promotion WHERE code = "${code}"`
// //TODO check have code
// `DELETE FROM promotion WHERE code = "${code}"`
// //TODO delete code