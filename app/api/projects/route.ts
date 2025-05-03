import pool from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req?: NextRequest) {
  try {
    let result;

    if (req) {
      const { searchParams } = new URL(req.url);
      const slug = searchParams.get("slug");

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
        // Jika slug tidak ada, ambil semua data dari tabel projects
        result = await pool.query("SELECT * FROM projects");

        if (result.rows.length === 0) {
          return new Response(
            JSON.stringify({ message: "No data available" }),
            {
              status: 404,
            }
          );
        }
      }
    } else {
      result = await pool.query("SELECT * FROM projects");

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
