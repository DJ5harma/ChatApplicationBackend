import { compareSync } from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { jwtSecret as JWT_SECRET } from "../index.js";

export default async function loginC(req, res) {
	let { username, password } = req.body;
	try {
		const info = await User.findOne({ username });
		if (!info) throw new Error("User doesn't exist");

		const correctPassword = compareSync(password, info.password);
		if (!correctPassword) throw new Error("Incorrect password");

		jwt.sign({ _id: info._id, username }, JWT_SECRET, (err, token) => {
			if (err) throw err;
			res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 }) //24hrs
				.json({
					_id: info._id,
					username,
					message: `Logged in successfully as ${username}`,
				});
		});
	} catch (error) {
		res.json({
			error: error.message || `Internal server error`,
		});
	}
}
