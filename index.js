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


app.post('/register', async function (req, res, next) {//?nickname=&picture=&userIdExternal from facebook line google=&from?
    var External = req.body.userIdExternal;
    var fromWhere = req.body.from;

    let fromFacebook = null;
    let fromLine = null;
    let formGoogle = null;

    switch(fromWhere) {//!validation
        case "Facebook":
            fromFacebook = External;
            break;
        case "Line":
            fromLine = External;
            break;
        case "Google":
            formGoogle = External;
            break;
        default:
            res.status(404).send();
            console.log("form error");
            return 0;
    } 
    
    await checkInUserList(External, fromWhere, con, status => {
        if(status){
            res.status(404).send();
            console.log("Duplicate");
            return 0;
        }else{
            const uuid = uuidv4();
            const nickname = req.body.nickname;
            const pic = req.body.picture;
        ///////////////////////////////////////////////////////////////////
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");

                con.query(`INSERT INTO users(userid, nickname, picture) VALUES("${uuid}","${nickname}", "${pic}")`, function (err, result) {
                    if (err) throw err;
                    console.log("insert table users success");
                });

                con.query(`INSERT INTO linkuserid(userid, idFromF, idFromL, idFromG) VALUES("${uuid}", "${fromFacebook}", "${fromLine}", "${formGoogle}")`, function (err, result) {
                    if (err) throw err;
                    console.log("insert table linkuserid success");
                });
            });
        }
    })
})

const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})