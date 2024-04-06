import jwt from "jsonwebtoken";
import { jwtSecret as JWT_SECRET } from "../index.js";

export default async function wall(req, res, next) {
	const { token } = req.cookies;
	try {
		if (!token) throw new Error("Cookie not found");

		jwt.verify(token, JWT_SECRET, (err, info) => {
			if (err) throw err;
			req.userId = info._id;
			if (req.body.autoLogin) {
				return res.json(info);
			}
		});

		next();
	} catch (error) {
		res.json({
			error: error.message || `Internal server error`,
		});
	}
}
