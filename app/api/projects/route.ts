import pool from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    let result;

    if (slug) {
      result = await pool.query("SELECT * FROM projects WHERE slug = $1", [
        slug,
      ]);

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ message: "Data not found" }), {
          status: 404,
        });
      }
    } else {
      result = await pool.query(
        "SELECT * FROM projects ORDER BY CASE category WHEN 'Web Development' THEN 1 WHEN 'Data Science' THEN 2 WHEN 'Data Analyst' THEN 3 ELSE 4 END"
      );

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ message: "No data available" }), {
          status: 404,
        });
      }
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
