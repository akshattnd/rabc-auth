import { RoleName } from "@/constants/roles";
import jwt from "jsonwebtoken";
import { projectHmrChunkNamesSubscribe } from "next/dist/build/swc/generated-native";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN;
if (!ACCESS_SECRET || !ACCESS_TOKEN_EXPIRY) {
    throw new Error("JWT_ACCESS_SECRET is not defined ");
}

if (!REFRESH_SECRET || !REFRESH_TOKEN_EXPIRY) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
}
export type AccessTokenPayload = {
    sub: string;
    role: string;
    type: "access";
};

export type RefreshTokenPayload = {
    sub: string;
    type: "refresh";
};
export async function generateTokens(payload: { id: string, role: RoleName }) {
    const accessToken =
        jwt.sign({ sub: payload.id, role: payload.role, type: 'access' }, ACCESS_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        })
    const refreshToken = jwt.sign({ sub: payload.id, type: 'refresh' }, REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    })

    return { accessToken, refreshToken }

}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET!)
}
export function verifyRefreshToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET!)
}