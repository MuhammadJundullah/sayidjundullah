import pool from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    let result;

    if (slug) {
      result = await pool.query("SELECT * FROM projects WHERE slug = $1", [
        slug,
      ]);

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ message: "Data not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else if (category) {
      result = await pool.query(
        "SELECT * FROM projects WHERE categoryslug = $1",
        [category]
      );

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ message: "No data available" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      result = await pool.query(
        `SELECT * FROM projects 
         ORDER BY CASE 
           WHEN category = 'Web Development' THEN 1 
           WHEN category = 'Data Science' THEN 2 
           WHEN category = 'Data Analyst' THEN 3 
           ELSE 4 
         END`
      );

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ message: "No data available" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
