const getO = async(con, res, order_id) => {
    return new Promise((resolve, reject) => {
      // console.log(order_id);
      var canReduce = 0;
      var totalCommission = 0;
      var reduceService = [];
      
      const sql1 = `SELECT o.order_id, o.type_car, o.color_car, o.license_car, o.nickname, o.order_status, o.tel, o.is_booking, o.booking_time, o.arrived_time, o.code, o.order_type, o.comment, SUM(ps.price) AS total_price
                    FROM orderlist AS o, included AS i, service AS s, price_per_type_s AS ps
                    WHERE o.order_id = i.order_id AND i.service_id = s.service_id AND s.service_id = ps.service_id AND ps.type_of_car = o.type_car AND o.order_id = "${order_id}"
                    GROUP BY o.order_id;`
      //TODO get order info
      const sql2 = `SELECT si.service_id, si.name, si.period_time, i.is_done
                    FROM orderlist AS o, included AS i, service AS s, service_items AS si
                    WHERE o.order_id = "${order_id}" AND o.order_id = i.order_id AND i.service_id = s.service_id AND s.service_id = si.service_id;`
      //TODO get all service of order 
      const sql3 = `SELECT service_id FROM included AS i WHERE i.order_id = "${order_id}"`
    
      const sql5 = `SELECT o.order_id, s.service_id, (SELECT ppts.price FROM price_per_type_s AS ppts WHERE o.type_car = ppts.type_of_car AND ppts.service_id = s.service_id) AS price, c.commission_id, c.amount_type, c.amount
                    FROM orderlist AS o, included AS i, service AS s, commission AS c
                    WHERE o.order_id = i.order_id AND i.service_id = s.service_id AND s.commission_id = c.commission_id AND o.order_id = "${order_id}"
                    GROUP BY s.service_id;`
      
                    con.query(sql1, (err, result1) => {
                      if (err) throw err;
                      // console.log(result1[0]);
                      const sql4 = `SELECT p.code, cr.service_id, (SELECT pp.reduce_type FROM price_per_type_p AS pp WHERE p.code = pp.code AND pp.type_of_car="${result1[0].type_car}") AS reduce_type,(SELECT pp.reduce FROM price_per_type_p AS pp WHERE p.code = pp.code AND pp.type_of_car="${result1[0].type_car}") AS reduce
                            FROM promotion AS p , can_reduce AS cr
                            WHERE p.code = "${result1[0].code}" AND p.code = cr.code;`
                      con.query(sql2, (err, result2) => {
                        if (err) throw err;
                        result1[0].services= result2
                        con.query(sql3, (err, result3) => {
                          if (err) throw err;
                          // console.log(result3);
                          con.query(sql4, (err, result4) => {
                            // console.log(result4);
                            if(err) throw err;
                            for (let i = 0; i < result3.length; i++){
                              for (let j = 0; j < result4.length; j++){
                                if (result4[j].service_id == result3[i].service_id){
                                  canReduce += result4[j].reduce;
                                  // console.log(`${result4[j].service_id}`);
                                  reduceService.push({service_id:`${result4[j].service_id}`,reduce:result4[j].reduce});
                                }
                              }
                            }
                            result1[0].promotionReduce = canReduce;
                            result1[0].reduceServices = reduceService;
                            con.query(sql5, (err, result5) => {
                              // console.log(result5);
                              if (err) throw err;
                              for (let i = 0; i < result5.length; i++){
                                if (result5[i].amount_type == "BATH"){
                                  totalCommission += result5[i].amount;
                                }else if (result5[i].amount_type == "PERCENT"){
                                  totalCommission += (result5[i].price*result5[i].amount/100)
                                }
                              }
                              result1[0].commission = totalCommission;
                              // console.log(result1[0]);
                              resolve(result1[0]);
                            })
                          })
                        })
                      })
                  })
    })
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
async function getOrderlist(con, req, res) {
    
    const order_id = req.query.order_id;
    
    if (!order_id){
      con.connect(async (err) => {
        if(err) throw err;
        console.log("\n Connected!");
        con.query("SELECT order_id FROM orderlist AS o WHERE ((o.arrived_time/1000) > (SELECT UNIX_TIMESTAMP(CURRENT_DATE))) OR ((o.booking_time/1000) > (SELECT UNIX_TIMESTAMP(CURRENT_DATE)))",async (err, result) => {
          // console.log(result);
          if (err) throw err;
          // var i = 0;
          var Allorder = [];
          for (let i = 0; i < result.length; i++) {
            Allorder[i] = await getO(con, res, result[i].order_id);
            
          }
          // console.log(Allorder[0]);
          res.status(200).send({msg:"OK",data:Allorder})
        })
        
      })
      return 0;
    }
    // Allorder[i] = await getO(con, res, result[i].order_id);
    res.status(200).send({msg:"OK",data:await getO(con, res, order_id)})
    
   
}

export { getOrderlist };
