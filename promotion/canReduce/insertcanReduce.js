const insertCanReduce = async (con, sql, res) => {
  con.query(sql, (err, result) => {
    if (err) throw err;

    console.log("insert can_reduce success");
    res.status(200).send({msg : "OK"});
  });
};

export { insertCanReduce };
