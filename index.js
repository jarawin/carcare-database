import express, { json } from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2';

const connection = createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "companyelmasri"
  });

const app = express();
app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('Hello Peem');
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

app.post('/department', function (req, res, next) {
    connection.query("SELECT dname, dnumber FROM department", function (err, result) {
        if (err) throw err;
        res.json(result);
        result.forEach(element => {// display each obj in terminal
          console.log(element);
        }); 
        console.log("\n")
      });
})