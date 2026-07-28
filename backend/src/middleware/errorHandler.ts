import { NextFunction, Request, Response } from "express";
import { ApiError } from "../schemas/taskSchemas";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json(err.body);
  }

  if (
    err &&
    typeof err === "object" &&
    "status" in err &&
    "body" in err &&
    typeof (err as { status?: unknown }).status === "number"
  ) {
    return res
      .status((err as { status: number }).status)
      .json((err as { body: unknown }).body);
  }

  return res.status(500).json({ detail: "Internal Server Error" });
}