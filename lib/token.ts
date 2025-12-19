import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || "super-secret-default-key-change-this-in-prod"
);

export async function signJWT(payload: { sub: string; role: string; mustChangePassword?: boolean }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h") // 1 day session
        .sign(SECRET_KEY);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}
