"use server";
import { cookies } from "next/headers";

export async function setUsernameAction(username: string) {
	const cookieStore = await cookies();
	cookieStore.set("username", username, { path: "/" });
}
