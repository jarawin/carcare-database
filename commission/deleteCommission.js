const deleteCommission = (con, req, res) => {
    var commission_id  = req.query?.commission_id ;
    if (!commission_id ){
        res.status(200).send({msg:"Commission_id does not exist"})
        return 0;
    }else{
        const sql1 = `SELECT * FROM commission WHERE commission_id  = "${commission_id}"`;
        con.query(sql1, (err, result1) => {
            if (err) throw err;
            if (!result1[0]){
                res.status(200).send({msg:"Commission_id does not exist",data:result1[0]})
            }else{
                con.query(`DELETE FROM commission WHERE commission_id = "${commission_id}"`, (err, result) => {
                    if (err) {
                        res.status(404).send({msg:"Please delete all service relavent"})
                        return 0;
                    }else{
                        res.status(200).send({msg:"Delete success",data:result[0]})
                    }
                    
                })
            }
        })
    }
}

export {deleteCommission}

// `SELECT * FROM commission WHERE commission_id  = "${commission_id}"`
// //TODO have commission_id
// `DELETE FROM commission WHERE commission_id = "${commission_id}"`
// //TODO delete commisison