import { v4 as uuidv4 } from 'uuid';
import { createConnection } from 'mysql2';
import checkPhone from '../users/checkPhone.js';

const con = createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "carcare"
  });

// async function validateBeforeInsertQueue(u_id, type_of_car, nickname, phone){//! X
//     const typeCar =["sedan","suv"]
//     con.connect(function(error){
//         if (error) throw error;
//             con.query(`SELECT u_id FROM users WHERE u_id = "${u_id}"`, async function(err, result){
//                 if (error) throw err;
//                 if (result[0] == undefined){
//                     console.log("User id not found");
//                     return 0;
//                 }else{
//                     await checkPhone(phone).then(value => {
//                         if (value == false){
//                             console.log("phone error");
//                             return 0;
//                         }else{
//                             if (typeCar.includes(type_of_car)){
//                                 insertQueue(u_id, type_of_car, nickname, phone);
//                             }else{
//                                 console.log("type_of_car not match");
//                                 return 0;
//                             }
//                         }
//                     })
//                 }
//             });
//     });
// }

async function insertWalkInQueue(type_of_car, nickname, phone){
    const carType = ["mc", "sedan", "truck", "suv", "van"];
    await checkPhone(phone).then( value => {
        if (value){
            if (carType.includes(type_of_car)){
                con.connect(async function(error){
                    if (error) throw error;
                    const timestamp = Date.now();
                    const q_id = uuidv4();
                    let u_id;
                    con.query(`SELECT u_id FROM users WHERE phone = "${phone}"`, (err, result) => {
                        if (err) throw err;
                        if (result[0] == undefined){
                            u_id = "Not a registeted user";
                        }else{
                            u_id = result[0].u_id
                        }
                        con.query(`INSERT INTO queue(timestamp, q_id, u_id, type_of_car, nickname, phone) VALUES("${timestamp}", "${q_id}", "${u_id}", "${type_of_car}", "${nickname}", "${phone}")`,(err, result) => {
                            if (err) throw err;
                            console.log("Insert walk-in queue success");
                        });
                    })
                });
            }
        }else{
            console.log("phone error");
            return 0;
        }
    });
}

insertWalkInQueue("suv", "Pheem", "0864669514")