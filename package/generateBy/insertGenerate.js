async function insertGenerateBy(con, txt, res) {
      con.query(`INSERT INTO generate_by VALUES ${txt};`, (err ,result) => {
        if (err) throw err;
        res.status(200).send({msg:"Insert package success"})
        console.log("Insert generate_by success");
      })
  }

export {insertGenerateBy}