import e from "express";

function applyWork(con, req, res) {
    const employee_id = req.body.employee_id;
    const phone = req.body.phone;
    const email = req.body.email;
    const picture_url = req.body.picture_url;
    const lastlogin_time = Date.now();
    const work_background = req.body.work_background;
    const graduation_certificate = req.body.graduation_certificate;
    const prefixname = req.body.prefixname;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const nickname = req.body.nickname;
    const wage_type = req.body.wage_type;
    const employee_type = req.body.employee_type;
    const address = req.body.address;
    const id_card = req.body.id_card;
    const resume = req.body.resume;
    const house_registration = req.body.house_registration;
    const sql1 = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
    const sql2 = `INSERT INTO employee(employee_id,phone,email,picture_url,lastlogin_time,work_background,graduation_certificate,prefixname,fname,lname,nickname,wage_type,employee_type,address,id_card,resume,house_registration) 
                  VALUES("${employee_id}","${phone}","${email}","${picture_url}","${lastlogin_time}","${work_background}","${graduation_certificate}","${prefixname}","${fname}","${lname}","${nickname}","${wage_type}","${employee_type}","${address}","${id_card}","${resume}","${house_registration}");`;

    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){
          con.query(sql2, (err, result) => {
            if (err) throw err;
            res.status(200).send("applyment pending");
            console.log("applyment pending");
            con.end();
          });
        }else{
          res.status(501).send("Account already exists");
          console.log("Account already exists");
          con.end();
        }
      });
    });
  }
  
  export {applyWork};