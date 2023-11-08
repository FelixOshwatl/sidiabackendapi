// const mysql = require('mysql');
// const pool = mysql.createConnection({
//   host: process.env.DB_HOST, 
//   user: process.env.DB_USER, 
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
//   connectionLimit: 10,
//   compress: true,
//   //timezone: 'Etc/GMT0',
//   insertIdAsNumber: true,
//   bigIntAsNumber: true, 
//   decimalAsNumber: true,
// });

// function simpleExecute(statement, binds) {
//   return new Promise(async (resolve, reject) => {
//     let conn;
//     try {
//       conn = await pool.getConnection();
//       const result = await conn.query(statement, binds);
//       resolve(result);
//     } catch (err) {
//       reject(err);
//     } finally {
//       if (conn) {
//         try {
//           await conn.end();
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     }
//   });
// }

// module.exports.simpleExecute = simpleExecute;
