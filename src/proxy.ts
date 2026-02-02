import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export default function proxy(req: NextRequest) {
	const uid = req.cookies.get("uid")?.value;
	const username = req.cookies.get("username")?.value;

	console.log("Middleware - UID:", uid, "Username:", username);

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
