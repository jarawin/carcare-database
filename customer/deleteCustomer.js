const deleteCustomer = (con, req, res) => {
    var customer_id = req.query?.customer_id;
    if (!customer_id){
        // console.log(JSON.stringify(customer_id));
        res.status(200).send({msg:"Customer id does not exist"})
        return 0;
    }else{
        const sql1 = `SELECT * FROM customer WHERE customer_id = "${customer_id}"`;
        con.query(sql1, (err, result1) => {
            if (err) throw err;
            if (!result1[0]){
                res.status(200).send({msg:"Customer id does not exist",data:result1[0]})
            }else{
                con.query(`DELETE FROM customer WHERE customer_id = "${customer_id}"`, (err, result) => {
                    if (err) throw err;
                    res.status(200).send({msg:"Delete success",data:result[0]})
                })
            }
        })    
    }
}

export {deleteCustomer}