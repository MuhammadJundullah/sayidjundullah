import { Pool } from "pg";

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "porto",
  password: "",
  port: 5432,
});

export default pool;
