/**
 * If the order_id exists, delete the order_id from the database. If the order_id does not exist,
 * return a message saying that the order_id does not exist.
 * @param con - connection to the database
 * @param req - request
 * @param res - response object
 * @returns The result of the query.
 */
const deleteOrder = (con, req, res) => {
    var order_id = req.query?.order_id;
    if (!order_id){
        // console.log(JSON.stringify(Order_id));
        res.status(200).send({msg:"Order id does not exist"})
        return 0;
    }else{
        const sql1 = `SELECT * FROM orderlist WHERE order_id = "${order_id}"`;
        con.query(sql1, (err, result1) => {
            if (err) throw err;
            if (!result1[0]){
                res.status(200).send({msg:"Order id does not exist",data:result1[0]})
            }else{
                con.query(`DELETE FROM orderlist WHERE Order_id = "${order_id}"`, (err, result) => {
                    if (err) throw err;
                    res.status(200).send({msg:"Delete success",data:result[0]})
                })
            }
        })    
    }
}

export {deleteOrder}

// `SELECT * FROM orderlist WHERE order_id = "${order_id}"`
// //TODO check have order id
// `DELETE FROM orderlist WHERE Order_id = "${order_id}"`
// //TODO delete order