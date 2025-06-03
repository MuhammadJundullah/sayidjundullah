import { Pool } from "pg";

// local
// const pool = new Pool({
//   user: "admin",
//   host: "localhost",
//   database: "porto",
//   password: "",
//   port: 5432,
// });

// supabasej

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export default pool;
