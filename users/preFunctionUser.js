import { v4 as uuidv4 } from 'uuid';
import { createConnection } from 'mysql2';
import checkPhone from '../users/checkPhone.js';

const con = createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "carcare"
  });


////////////////////////////////////////////////////////////////////////////////////////////
//TODO login

async function connectFromSocial(nickname, phone, picture_url, social_id, social_from){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        con.query(`SELECT * FROM users WHERE social_id = "${social_id}" AND social_from = "${social_from}"`, 
            function (err, result) {
                if (err) throw err;
                console.log("get users success");
                if (result[0] == undefined){
                    console.log("there aren't user in table");
                    insertUser(nickname, phone, picture_url, social_id, social_from);
                }else{
                    // res.send(result);//ต้องคุยว่าจะส่งอะไรกลับไปบ้าง
                    console.log("login");
                }
        });
    });
}

async function getUser(){
    
}

async function insertUser(nickname, phone, picture_url, social_id, social_from){
    await checkPhone(phone).then(value => {
        if (value == false){
            // res.status(404).send();
            console.log("phone error");
            return 0;
        }else{
            const uuid = uuidv4();
            const unix = Date.now();
            con.query(`INSERT INTO users(timestamp, u_id, nickname, phone, picture_url, social_id, social_from) 
                    VALUES("${unix}", "${uuid}", "${nickname}", "${phone}", "${picture_url}", "${social_id}", "${social_from}")`, 
                function (err, result) {
                    if (err) throw err;
                    console.log("insert table users success");

                    con.query(`SELECT * FROM users WHERE social_id = "${social_id}" AND social_from = "${social_from}"`, 
                        function (err, result) {
                            if (err) throw err;
                            // res.send(result) //ต้องคุยว่าจะส่งอะไรกลับไปบ้าง
                            console.log("login");
                    });

                }
            );
        }
    });
}


/*
connectFromSocial("Pheem","0864664514","eiei.url","eiei.social","Facebook")
connectFromSocial("Pheem","086466414","eiei.url","eiei.social","Facebook")
connectFromSocial("Pheem","986466414","eiei.url","eiei.social","Facebook")
connectFromSocial("Pheem","086460414","eiei.url","eiei.social","Facebook")
! login allow because social_id and social_from in table
! even recieve name, phone and picture_url not the same 
*/
connectFromSocial("Pheem","0864664514","eiei.urlerjkgf ioarqweg","cialklhgiyeu","Facebook")

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TODO update for table users
//?         user      access update nickname, phone, picture_url
//? manager and owner access update nickname, phone, picture_url and rank, member, permission,

async function update(needUpdate, permission){
    if (permission != "manager" || permission != "owner"){
        console.log("users");
        return 0;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TODO delete for table users
//? manager and owner can delete user out of table

async function deleteUser(permission, uIdArray){// uIdArray input array including deleteUser("manager", ["08e564a3-c8bf-418c-94bd-525e01976ac5"]) // Don't forget //! "[...]"
    if (permission == "manager" || permission == "owner"){
        con.connect(function(err) {
            if (err) throw err;
            for (let uId of uIdArray){
                console.log(uId);
                con.query(`DELETE FROM users WHERE u_id = "${uId}"`, function(err, result){
                    if (err) throw err;
                    console.log("delete success");
                })
            }
        });
    }
}
// deleteUser("manager", ["08e564a3-c8bf-418c-94bd-525e01976ac5"])
////////////////////////////////////////////////////////////////////////////////////////////////////////////