import checkInUserList from './users/checkInList.js';
import { createConnection } from 'mysql2';

const con = createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "carcare"
  });
  let External = "USX008"
  let fromWhere = "Facebook"
  var x = "asd"
  
   await checkInUserList(External, fromWhere, con,(status)=> {
    console.log(x);
   });
//   let myPromise = new Promise(function(myResolve, myReject) {
//     let x = checkInUserList(External, fromWhere, con);
//     console.log(x);
//   // The producing code (this may take some time)
  
//     if (x == true) {
//       myResolve("OK");
//       console.log(x);
//     } else {
//       myReject("Error");
//       console.log(x);
//     }
//   });
  
//   myPromise.then(
//     function(value) {console.log(value);;},
//     function(error) {console.log(error);;}
//   );