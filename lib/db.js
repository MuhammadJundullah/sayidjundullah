import { Pool } from "pg";

// local
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "porto",
  password: "",
  port: 5432,
});

// supabase
// const pool = new Pool({
//   user: "postgres.aaoeugvpknmcamicqgwu",
//   host: "aws-0-ap-southeast-1.pooler.supabase.com",
//   database: "postgres",
//   password: "NIOYcrDi5V5iofN4",
//   port: 5432,
// });

export default pool;
