import { NextResponse } from "next/server";
import { HttpError } from "./http-error";

type ApiResult<T = unknown> = {
  data?: T;
  message?: string;
  statusCode?: number;
};

type ApiHandler<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<ApiResult<TResult>>;

export function apiHandler<TArgs extends unknown[], TResult>(
  handler: ApiHandler<TArgs, TResult>,
) {
  return async (...args: TArgs) => {
    try {
      const result = await handler(...args);

      const statusCode = result.statusCode ?? 200;

      return NextResponse.json(
        {
          success: statusCode < 400,
          message: result.message ?? "Success",
          data: result.data ?? null,
          error: null,
        },
        {
          status: statusCode,
        },
      );
    } catch (error) {
      console.error(error);

      if (error instanceof HttpError) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
            data: null,
            error: null,
          },
          {
            status: error.statusCode,
          },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          data: null,
          error: null,
        },
        {
          status: 500,
        },
      );
    }
  };
}