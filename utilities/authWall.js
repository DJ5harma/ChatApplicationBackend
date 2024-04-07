import jwt from "jsonwebtoken";
import { jwtSecret as JWT_SECRET } from "../index.js";
import User from "../models/user.model.js";

export default async function wall(req, res, next) {
	const { token } = req.body;
	try {
		if (!token) throw new Error("Cookie not found");

		jwt.verify(token, JWT_SECRET, async (err, info) => {
			if (err) throw err;
			req.userId = info._id;
			if (req.body.autoLogin) {
				const user = await User.findById(info._id);

				return res.json({
					username: user.username,
					_id: user._id,
					message: `Logged in successfully as ${user.username}`,
				});
			} else {
				next();
			}
		});
	} catch (error) {
		res.json({
			error: error.message || `Internal server error`,
		});
	}
}
