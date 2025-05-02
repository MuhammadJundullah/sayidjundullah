// app/api/work-experiences/route.js
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM certificates"); 
    return new Response(JSON.stringify(result.rows), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
