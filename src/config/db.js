import mysql from "mysql2/promise";
// ============================
//  Conexão com o MariaDB
// ============================
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dblivraria",
  port: 3306,
});

console.log("✅ Conectado ao banco de dados dblivraria!");

export default db