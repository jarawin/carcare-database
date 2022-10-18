const deleteService = (con, req, res) => {
    var service_id = req.query?.service_id;
    if (!service_id){
        res.status(200).send({msg:"Service id does not exist"})
        return 0;
    }else{
        const sql1 = `SELECT * FROM service WHERE service_id = "${service_id}"`;
        con.query(sql1, (err, result1) => {
            if (err) throw err;
            if (!result1[0]){
                res.status(200).send({msg:"Service id does not exist",data:result1[0]})
            }else{
                con.query(`DELETE FROM service WHERE service_id = "${service_id}"`, (err, result) => {
                    if (err) {
                        res.status(404).send({msg:"Please delete service relavent"})
                    }else{
                        res.status(200).send({msg:"Delete success",data:result[0]})
                    }
                    
                })
            }
        })    
    }
}

export {deleteService}

// `SELECT * FROM service WHERE service_id = "${service_id}"`
// //TODO check have service_id
// `DELETE FROM service WHERE service_id = "${service_id}"`
// //TODO delete service_id