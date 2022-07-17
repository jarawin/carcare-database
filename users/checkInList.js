async function checkInUserList(idExternal, fromForSql, con,callBack){
    var status;
    await con.connect(err => {
        if (err)
            throw err;

        if (fromForSql == "Facebook") {
            con.query(`SELECT idFromF FROM linkuserid WHERE idFromF = "${idExternal}"`, function (err, result) {
                if (err){
                    throw err;
                }else if (result[0] == undefined){
                    status = false
                    console.log(status+ " after process");
                    callBack(status)
                }else{
                    status = true
                    console.log(status+ " after process");
                    callBack(status)
                }
            });
        }
    });
}

export default checkInUserList;