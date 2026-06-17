import { cookies } from "next/headers";

export async function getAccessToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken");

    if(!token) return null;

    return token.value;
}
