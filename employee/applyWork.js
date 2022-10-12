import e from "express";

const checkWageType = async (con, wage_type) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM employee_wage WHERE wage_type = "${wage_type}"`, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined){
        resolve(false);
      }else{
        resolve(true);
      }
    })
  })
}
const insertApply = (con, sql2, res) => {
  con.query(sql2, (err, result) => {
    if (err) throw err;
    res.status(200).send("applyment pending");
    console.log("applyment pending");
  });
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const isPhoneNumber = (phone) => {
  var phoneno = /((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))|((\+๖๖|๐)([๐-๙]{1,2}\-?[๐-๙]{3}\-?[๐-๙]{3,4}))/gm;
  if(phone.match(phoneno)){
      return true;
    }else{
      return false;
    }
}


async function applyWork(con, req, res) {
    const employee_id = req.body.employee_id;
    // const firstwork_time = req.body.firstwork_time;
    const lastlogin_time = Date.now();
    const tel = req.body.tel;
    const email = req.body.email;
    const picture_url = req.body.picture_url;//! url
    const employee_type = req.body.employee_type;
    const work_background = req.body.work_background;//! url
    const graduation_certificate = req.body.graduation_certificate;//! url
    const prefixname = req.body.prefixname;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const nickname = req.body.nickname;
    const wage_type = req.body.wage_type;
    const apply_status = req.body.apply_status;
    const address = req.body.address;
    const id_card = req.body.id_card;//! url
    const resume = req.body.resume;//! url
    const house_registration = req.body.house_registration;//! url
    const sql1 = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
    const sql2 = `INSERT INTO employee(employee_id, lastlogin_time, tel, email, picture_url, employee_type, work_background, graduation_certificate,prefixname, fname, lname, nickname, wage_type, apply_status, address, id_card, resume, house_registration) 
                  VALUES("${employee_id}","${lastlogin_time}","${tel}","${email}","${picture_url}","${employee_type}","${work_background}","${graduation_certificate}","${prefixname}","${fname}","${lname}","${nickname}","${wage_type}", ${apply_status},"${address}","${id_card}","${resume}","${house_registration}");`;

    //TODO check phone
    if (!isPhoneNumber(tel)){
      res.status(501).send("Not phone format")
      console.log("Not phone format");
      return 0;
    }else{
      console.log("\ncheck phone success");
    }

    //TODO check URL
    const arrayOfUrl = [["picture_url",picture_url], ["work_background",work_background], ["graduation_certificate",graduation_certificate], ["id_card",id_card], ["resume",resume ], ["house_registration",house_registration]]
    for (let i = 0; i < arrayOfUrl.length; i++){
      if (!isValidHttpUrl(arrayOfUrl[i][1])){
        res.status(501).send(`${arrayOfUrl[i][0]} is not url`)
        return 0;
      }
    }
    console.log("check url success");

    if (!(await checkWageType(con, wage_type))){
      console.log(`Not have ${wage_type} please insert wage_type before insert employee`);
      res.status(501).send({msg:`Not have ${wage_type} please insert wage_type before insert employee`})
      return 0;
    }
    
    
    con.connect((err) => {
      if (err) throw err;
      console.log("Connected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
          insertApply(con, sql2, res)
        }else{//? duplicate
          res.status(501).send("Account already exists");
          console.log("Account already exists");
        }
      });
    });
  }
  
  export {applyWork};