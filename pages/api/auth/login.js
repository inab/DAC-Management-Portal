/* eslint-disable import/no-anonymous-default-export */
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import * as bcrypt from "bcrypt";
import clientPromise from "../../../src/utils/db";

export default async function (req, res) {
  const { username, password } = req.body;

  const client = await clientPromise;

  const db = await client.db("dac-management");

  const user = await db.collection('users').find({ 'username': username })
                                           .toArray();

  if (user.length > 0) {

    const match = await bcrypt.compare(password, user[0].password);

    if (match) {
      const token = sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          username: username,
        },
        process.env.SECRET
      );

      const authCookie = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      });

      res.setHeader("Set-Cookie", authCookie);

      res.status(200).json({ message: "Authenticated" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
