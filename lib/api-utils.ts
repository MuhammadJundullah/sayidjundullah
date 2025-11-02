import { NextResponse } from "next/server";

export function apiResponse(
  success: boolean,
  data: any,
  message: string,
  status: number
) {
  return NextResponse.json({ success, data, message }, { status });
}

export function handleError(
  error: unknown,
  message: string = "An error occurred",
  status: number = 500
) {
  console.error(message, error);
  return NextResponse.json(
    { success: false, data: null, message },
    { status }
  );
}
