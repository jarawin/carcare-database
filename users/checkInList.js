async function checkInUserList(idExternal, con, fromForSql, callBack){
    con.connect( async (err) => {
        if (err)
            throw err;

        con.query(`SELECT social_id  FROM users WHERE social_id  = "${idExternal}"`,(err, result) => {
            if (err) throw err;

            if (result[0] == undefined) { //! allow to register because userid from... not duplicate
                callBack(false)
            } else {                      //! not allowed to register because userid from... duplicate
                callBack(true)
            }
        });
    });
}

export default checkInUserList;