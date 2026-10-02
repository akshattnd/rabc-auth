import { NextResponse } from "next/server";

type ApiResult<T = unknown> = {
    data?: T;
    message?: string;
    statusCode?: number;
};

type ApiHandler<TArgs extends unknown[] = [], TResult = unknown> = (
    ...args: TArgs
) => Promise<ApiResult<TResult>>;

export function apiHandler<TArgs extends unknown[], TResult>(
    handler: ApiHandler<TArgs, TResult>,
) {
    return async (...args: TArgs) => {
        try {
            const result = await handler(...args);
            const statusCode = result.statusCode || 200
            return NextResponse.json(
                {
                    message: result.message ?? "Success",
                    success: statusCode < 400,
                    data: result.data ?? null,
                    error: null,
                },
                {
                    status: statusCode,
                },
            );
        } catch (error) {
            console.error(error);

            return NextResponse.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Internal server error",
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