// app/api/work-experiences/route.js
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT experiences.id AS experience_id, experiences.company_name, experiences.position, experiences.duration, experiences.type, experiences.created_at, experiences.updated_at,
       json_agg(json_build_object('description', jobdesks.description)) AS jobdesks
      FROM experiences
      LEFT JOIN jobdesks ON experiences.id = jobdesks.experiences_id
      GROUP BY experiences.id
      ORDER BY experiences.id ASC
    `);
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
