import { v4 as uuidv4 } from 'uuid';
import { createConnection } from 'mysql2';
import checkPhone from '../users/checkPhone.js';

const con = createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "carcare"
  });

async function insertService(p_id, ArraySid){//
    con.connect( err => {
        if (err) throw err;
        const timestamp = Date.now();
        for (let i of ArraySid){
            con.query(`INSERT INTO service VALUES("${timestamp}","${p_id}","${i}")`, (err, result) => {
                if (err) throw err;
            });
        }
        console.log("Insert service success");
    })
}

// insertService("12345", ["S001","S002","S003"])

function deleteByQid(q_id){
    con.connect(err => {
        if (err) throw err;
        con.query(`DELETE FROM service WHERE q_id = "${q_id}"`,(err, result) => {
            if (err) throw err;
            console.log(`Delete ${q_id} from service table success`);
        });
    });
}

function deleteServicefromQid(q_id, s_id){
    con.connect(err => {
        if (err) throw err;
        con.query(`DELETE FROM service WHERE q_id = "${q_id}" AND s_id = "${s_id}"`,(err, result) => {
            if (err) throw err;
            console.log(`Delete ${s_id} of ${q_id} from service table success`);
        });
    });
}

// deleteByQid("1234")
// deleteServicefromQid("123", "S003")