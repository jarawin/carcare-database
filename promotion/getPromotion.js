const getAllCanReduce = async(con, result1) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM can_reduce`, (err, result4) => {
      if(err) throw err;
  
      for (let i = 0; i < result1.length; i++) {
        result1[i].canReduce=[]
        for(let j = 0; j < result4.length; j++){
          if(result1[i].code == result4[j].code){
            result1[i].canReduce.push({service_id:`${result4[j].service_id}`})
          }
        }
      }
      resolve(result1)
    })
  })
}

const getAllPricePerTypeP = async(con, result1) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM price_per_type_p`, (err, result3) => {
      if(err) throw err;
  
      for (let i = 0; i < result1.length; i++) {
        result1[i].reducePrice=[]
        for(let j = 0; j < result3.length; j++){
          if(result1[i].code == result3[j].code){
            result1[i].reducePrice.push({"type_of_car": `${result3[j].type_of_car}`,"reduce_type": `${result3[j].reduce_type}`,"reduce": `${result3[j].reduce}`})
          }
        }
      }
      resolve(result1)
    })
  })
}

const getAllPromotionByDay = async(con, result1) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT pp.code, pp.day FROM promotion_by_day AS pp, promotion AS p WHERE p.code = pp.code`, (err, result2) => {
      if (err) throw err;
  
      for (let i = 0; i < result1.length; i++) {
        result1[i].days=[]
        for(let j = 0; j < result2.length; j++){
          if(result1[i].code == result2[j].code){
            result1[i].days.push({"day":`${result2[j].day}`})
          }
        }
      }
      resolve(result1)
      // console.log(result1);
    })
  })
}

const getOneCanReduce = async(con, result1, code) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM can_reduce WHERE code = "${code}"`, (err, result4) => {
      if(err) throw err;
  
      for (let i = 0; i < result1.length; i++) {
        result1[i].canReduce=[]
        for(let j = 0; j < result4.length; j++){
          if(result1[i].code == result4[j].code){
            result1[i].canReduce.push({service_id:`${result4[j].service_id}`})
          }
        }
      }
      resolve(result1)
    })
  })
}

const getOnePricePerTypeP = async(con, result1, code) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM price_per_type_p WHERE code = "${code}"`, (err, result3) => {
      if(err) throw err;
  
      for (let i = 0; i < result1.length; i++) {
        result1[i].reducePrice=[]
        for(let j = 0; j < result3.length; j++){
          if(result1[i].code == result3[j].code){
            result1[i].reducePrice.push({"type_of_car": `${result3[j].type_of_car}`,"reduce_type": `${result3[j].reduce_type}`,"reduce": `${result3[j].reduce}`})
          }
        }
      }
      resolve(result1)
    })
  })
}

const getOnePromotionByDay = async(con, result1, code) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT pp.code, pp.day FROM promotion_by_day AS pp, promotion AS p WHERE p.code = pp.code AND p.code = "${code}"`, (err, result2) => {
      if (err) throw err;
  
      for (let i = 0; i < result1.length; i++) {
        result1[i].days=[]
        for(let j = 0; j < result2.length; j++){
          if(result1[i].code == result2[j].code){
            result1[i].days.push({"day":`${result2[j].day}`})
          }
        }
      }
      resolve(result1)
      // console.log(result1);
    })
  })
}

function getPromotion(con, req, res) {
  var code = req.query?.code;

  const sql1 = `SELECT * FROM promotion WHERE code = "${code}"`;

  con.connect(async (err) => {
    if (err) throw err;
    console.log("\nConnected!");

    if (!code) {
      getAllPromotion(con, req, res);
      return 0;
    }

    con.query(sql1, async(err, result1) => {
      if (err) throw err;

      if (result1[0] == undefined) {
        res.status(200).send({ msg: "OK", isPromotion: false, data: result[0] });
        console.log("Account not exists");
      }else{
        await getOnePromotionByDay(con, result1, code)
        await getOnePricePerTypeP(con, result1, code)
        await getOneCanReduce(con, result1, code)

        res.status(200).send({ msg: "OK", isPromotion: true, data: result1 });
        console.log("get promotion success");
      }
    });
  });
}

function getAllPromotion(con, req, res) {
  const sql2 = `SELECT *
                FROM promotion AS p;`;

  con.connect(async (err) => {
    if (err) throw err;
    console.log("\nConnected!");

    con.query(sql2, async (err, result1) => {
      if (err) throw err;

      await getAllPromotionByDay(con, result1)
      await getAllPricePerTypeP(con, result1)
      await getAllCanReduce(con, result1)

      res.status(200).send({ msg: "OK", data: result1 });
      console.log("get all promotion success");
    });
  });
}

export { getPromotion };

// `SELECT * FROM promotion WHERE code = "${code}"`
// //TODO check have promotion_by_day
// `SELECT *
// FROM promotion AS p
// INNER JOIN promotion_by_day AS pd ON p.code = pd.code
// WHERE pd.code= "${code}";`
// //TODO get one
// `SELECT *
// FROM promotion AS p
// LEFT JOIN promotion_by_day AS pd ON p.code = pd.code;`
// //TODO get all
