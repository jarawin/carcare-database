const insertCanReduce = async (con, sql) => {
  con.query(sql, (err, result) => {
    if (err) throw err;

    console.log("insert can_reduce success");
    
  });
};

export { insertCanReduce };
