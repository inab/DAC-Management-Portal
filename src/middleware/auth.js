import { verify } from "jsonwebtoken";

const authentication = fn => async (req, res) => {
    try {
      const { cookies } = req;
      verify(cookies.token, process.env.SECRET);
      return await fn(req, res)
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized!' })
    }
}

export { authentication } 