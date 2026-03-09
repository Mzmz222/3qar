import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_VALUE = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE_NAME);
    return session?.value === SESSION_VALUE;
}

export async function setAuthCookie(response: Response): Promise<void> {
    // Handled by API route directly
}

export function createSessionCookieHeader(): string {
    const maxAge = 86400; // 24 hours
    return `${COOKIE_NAME}=${SESSION_VALUE}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function clearSessionCookieHeader(): string {
    return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
