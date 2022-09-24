import express, { json } from 'express';
import cors from 'cors';
// import { createConnection } from 'mysql2';
// import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(json());

// const con = createConnection({
//     host: "localhost",
//     user: "root",
//     password: '123',
//     database: "carcare"
//   });
// con.connect();


app.get('/', (req, res) => {
    res.send('Hello Peem');
})



const port = process.env.PORT || 3307
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

//? `INSERT INTO users(userid, nickname, picture) VALUES("${uuid}","${nickname}", "${pic}")`
//? `SELECT * FROM users WHERE u_id = '${uuid}' `