import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/Login", req.url));
    }

    try {
        const decodedToken = jwt.decode(token);
        const role = decodedToken?.role;
        console.log(decodedToken)
        if (role === "Hospital") {
            if (!req.url.includes("/hospitalDashboard")) {
                return NextResponse.redirect(new URL("/hospitalDashboard", req.url));
            }
        } else if (req.url.includes("/hospitalDashboard")) {
            return NextResponse.redirect(new URL("/Login", req.url));
        }
    } catch (error) {
        console.error("Error decoding token:", error);
        return NextResponse.redirect(new URL("/Login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/hospitalDashboard"],
};