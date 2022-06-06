import { NextResponse } from "next/server";
import * as jose from 'jose';

export default async function middleware(req) {
    const { cookies } = req;

    const path = req.nextUrl.pathname;

    if(path === "/") {
        if(cookies.token) {
            try {
                await jose.jwtVerify(cookies.token, new TextEncoder().encode(process.env.SECRET))
                return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL + "/panel");
            } catch(e) {
                return NextResponse.next();
            }
        }
    }
    
    if(path.includes("/panel")) {
        if(cookies.token === undefined) {
            return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL);
        }
        try {
            await jose.jwtVerify(cookies.token, new TextEncoder().encode(process.env.SECRET))
            return NextResponse.next();
        } catch(e) {
            return NextResponse.rewrite(process.env.NEXT_PUBLIC_FRONTEND_URL);
        }
    }

    if(path.includes("/auth/logout")) {
        if(cookies.token === undefined) {
            return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL);
        }
        return NextResponse.next()
    }

}