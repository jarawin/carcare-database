const deletePackage = (con, req, res) => {
    var package_id = req.query?.package_id;
    if (!package_id){
        res.status(200).send({msg:"Package id does not exist"})
        return 0;
    }else{
        const sql1 = `SELECT * FROM package_info WHERE package_id = "${package_id}"`;
        con.query(sql1, (err, result1) => {
            if (err) throw err;
            if (!result1[0]){
                res.status(200).send({msg:"Package id does not exist",data:result1[0]})
            }else{
                con.query(`DELETE FROM package_info WHERE package_id = "${package_id}"`, (err, result) => {
                    if (err){
                        res.status(200).send({msg:"Please delete package relavent"})
                    }else{
                        res.status(200).send({msg:"Delete success",data:result[0]})
                    }
                })
            }
        })    
    }
}

export {deletePackage}

// `SELECT * FROM package_info WHERE package_id = "${package_id}"`
// //TODO check have package_id
// `DELETE FROM package_info WHERE package_id = "${package_id}"`
// //TODO delete package_id