import express, { json } from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import checkInUserList from './users/checkInList.js';

const con = createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "carcare"
  });

const app = express();
app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('Hello Peem');
})

app.post('/register', async function (req, res, next) {//TODO register
    let External = req.body.userIdExternal;
    let fromWhere = req.body.from;

    let fromForSql;

    switch(fromWhere) {//! validate from where
        case "Facebook":
            fromForSql = "idFromF";
            break;
        case "Line":
            fromForSql = "idFromL";
            break;
        case "Google":
            fromForSql = "idFromG";
            break;
        default:    //! fromwhere write incorrectly
            res.status(404).send();
            console.log("form error");
            return 0;
    } 
    await checkInUserList(External, con, fromForSql, status => {
        if(status){ //! register error is duplicate
            res.status(404).send();
            console.log("Duplicate");
            return 0;
        }else{      //! register 
                    //? if uuidFromExternal dupicate but live in another collum, it allow 
            const uuid = uuidv4(); //! not check duplicate because it guarantee unique
            const nickname = req.body.nickname;
            const pic = req.body.picture;
        ///////////////////////////////////////////////////////////////////
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");

                con.query(`INSERT INTO users(userid, nickname, picture) VALUES("${uuid}","${nickname}", "${pic}")`, function (err, result) {
                    if (err) throw err;
                    console.log("insert table users success");

                    con.query(`INSERT INTO linkuserid(userid, ${fromForSql}) VALUES("${uuid}", "${External}")`, function (err, result) {
                        if (err) throw err;
                        console.log("insert table linkuserid success");
                    });
                });
            });
        }
    })
})

const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})