const deleteBuy = (con, req, res) => {
    var customer_id = req.query?.customer_id;
    var package_id = req.query?.package_id;
    var time = req.query?.time;
    if (!customer_id && !package_id && !time){
        // console.log(JSON.stringify(Buy_id));
        res.status(200).send({msg:"Buy_id does not exist"})
        return 0;
    }else{
        const sql1 = `SELECT * FROM buy WHERE customer_id = "${customer_id}" AND package_id = "${package_id}" AND time = "${time}"`;
        con.query(sql1, (err, result1) => {
            if (err) throw err;
            if (!result1[0]){
                res.status(200).send({msg:"Buy id does not exist",data:result1[0]})
            }else{
                con.query(`DELETE FROM buy WHERE customer_id = "${customer_id}" AND package_id = "${package_id}" AND time = "${time}"`, (err, result) => {
                    if (err) throw err;
                    res.status(200).send({msg:"Delete success",data:result[0]})
                })
            }
        })    
    }
}

export {deleteBuy}