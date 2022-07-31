import {v4 as uuidv4 }from 'uuid';
import {createConnection} from 'mysql2'
import checkPhone from '../users/checkPhone.js';

const con = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "carcare"
});

async function insertBookingQueue(u_id, type_of_car, nickname, phone, bookingTime){
    const carType = ["mc", "sedan", "truck", "suv", "van"];
    await checkPhone(phone).then(value => {
        if (value){
            if (typeCar.includes(type_of_car)){
                con.connect(err => {
                    if (err) throw err;
                    con.query(`SELECT u_id FROM users WHERE u_id = "${u_id}"`, (err, result) => {
                        if (err) throw err;
                        if (result[0] == undefined){
                            console.log("User id not found");
                            return 0;
                        }else{
                            const q_id = uuidv4();
                            const timestamp = Date.now();
                            con.query(`INSERT INTO booking VALUES("${timestamp}", "${q_id}", "${u_id}", "${bookingTime}")`,(err, result) => {
                                if (err) throw err;
                                console.log("Insert booking success");
                                con.query(`INSERT INTO queue VALUE("${timestamp}","${q_id}","${u_id}","${type_of_car}","${nickname}","${phone}","${"Booking"}")`,(err, result) => {
                                     if (err) throw err;
                                     console.log("Insert queue success");
                                });
                            });
                        }
                    })
                })
            }
        }else{
            console.log("Phone error");
            return 0;
        }
    });
}

async function deleteFromBookingAndQueue(q_id){
    con.connect( err => {
        if (err) throw err;
        con.query(`DELETE FROM booking WHERE q_id = "${q_id}"`,(err, result) => {
            if (err) throw err;
            console.log("Delete booking success");
            con.query(`DELETE FROM queue WHERE q_id = "${q_id}"`,(err, result) => {
                if (err) throw err;
                console.log("Delete queue success");
            })
        })
    })
}

async function updateDateBooking(q_id){

}

insertBookingQueue("5d22f203-a93e-4795-a0c1-e666e03e7978", "suv", "peem", "0864664514", "1659000000000")