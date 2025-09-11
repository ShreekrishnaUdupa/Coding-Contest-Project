import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool ( {connectionString: process.env.LOCAL_DATABASE_URL} );

export default pool;
