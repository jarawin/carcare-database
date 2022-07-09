import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello Peem');
})

const port = process.env.PORT || 1234
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})