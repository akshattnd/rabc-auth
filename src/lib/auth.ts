import { verifyAccessToken } from "@/lib/jwt";
import { HttpError } from "@/lib/http-error";
export function getAccessToken(request: Request) {
    const authorization = request.headers.get("authorization");

    if (!authorization) {
        throw new HttpError(401, "Authorization header is required");
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new HttpError(
            401,
            "Invalid authorization header",
        );
    }

    return token;
}
export function authenticate(request: Request) {
    const token = getAccessToken(request);

    try {
        const payload = verifyAccessToken(token);

        if ((payload as any).type !== "access") {
            throw new HttpError(401, "Invalid access token");
        }
        return payload;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }

        throw new HttpError(
            401,
            "Invalid or expired access token",
        );
    }
}