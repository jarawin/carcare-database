import { v4 as uuidv4 } from 'uuid';
import { createConnection } from 'mysql2';

const con = createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "carcare"
  });

  async function insertSI(detail, sub_detail, price, picture_url){

  }

  async function deleteSI(s_id){

  }