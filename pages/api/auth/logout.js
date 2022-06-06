import { serialize } from "cookie";

export default async function Logout(req, res) {
    const authCookie = serialize("token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: -1,
        path: "/",
    });

    res.setHeader("Set-Cookie", authCookie);

    res.status(200).json({ message: "Logged out" });
}