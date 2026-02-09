import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export default function proxy(req: NextRequest) {
	const uid = req.cookies.get("uid")?.value;
	const username = req.cookies.get("username")?.value;

	console.log("Middleware - UID:", uid, "Username:", username);

	// ignore favicon, manifest, static assets, next internals, and API routes
	if (
		req.nextUrl.pathname.startsWith("/api") ||
		req.nextUrl.pathname.startsWith("/_next/static") ||
		req.nextUrl.pathname.startsWith("/_next/image") ||
		req.nextUrl.pathname.startsWith("/assets") ||
		req.nextUrl.pathname === "/favicon.ico" ||
		req.nextUrl.pathname === "/manifest.json"
	) {
		return NextResponse.next();
	}

	if (req.nextUrl.pathname == "/") {
		return NextResponse.redirect(new URL("/games", req.url));
	}

	// Case 1: username missing → redirect
	if (!username && req.nextUrl.pathname !== "/set-username") {
		const url = req.nextUrl.clone();
		url.pathname = "/set-username";
		url.searchParams.set("redirect", req.nextUrl.pathname);

		const res = NextResponse.redirect(url);

		// 👇 IMPORTANT: set UID on the redirect response
		if (!uid) {
			res.cookies.set("uid", crypto.randomUUID(), {
				httpOnly: true,
				path: "/",
			});
		}

		return res;
	}

	// Case 2: normal request
	const res = NextResponse.next();

	if (!uid) {
		res.cookies.set("uid", crypto.randomUUID(), {
			httpOnly: true,
			path: "/",
		});
	}

	return res;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
