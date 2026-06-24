import { cookies } from "next/headers";
import { refreshTokensAction } from "@/src/architecture/actions/auth/refresh-tokens.action";
import { Logger, setLogContext } from "@/src/architecture/infrastructure/logger/logger";

export async function getAccessToken() {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("accessToken");
    const refreshTokenCookie = cookieStore.get("refreshToken");
    const hadAccessToken = Boolean(accessTokenCookie?.value);
    const hadRefreshToken = Boolean(refreshTokenCookie?.value);

    if (accessTokenCookie?.value) return accessTokenCookie.value;

    if (!refreshTokenCookie?.value) {
        Logger.warn("[TOKEN] No tokens available in cookies", {
            hadAccessToken,
            hadRefreshToken,
        });
        return null;
    }

    setLogContext({ hadAccessToken, hadRefreshToken, attemptedRefresh: true });

    const result = await refreshTokensAction();

    if (result.status === "success") {
        return result.accessToken;
    }

    if (result.status === "inactive") {
        Logger.warn("[TOKEN] Refresh failed — account inactive", {
            hadAccessToken,
            hadRefreshToken,
        });
    } else {
        Logger.warn("[TOKEN] Refresh failed — no access token available", {
            hadAccessToken,
            hadRefreshToken,
        });
    }

    return null;
}
