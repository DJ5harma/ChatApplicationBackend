import User from "../models/user.model.js";
import { genSaltSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret as JWT_SECRET } from "../index.js";

export default async function registerC(req, res) {
	let { username, password } = req.body;

	const salt = genSaltSync(10);
	const hashedPassword = hashSync(password, salt); //hashing password before storing it

	try {
		let info = await User.findOne({ username });
		if (info) throw new Error("User already exists");
		info = await User.create({
			username,
			password: hashedPassword,
		});
		jwt.sign({ _id: info._id, username }, JWT_SECRET, (err, token) => {
			if (err) throw err;
			res.json({
				_id: info._id,
				username,
				message: `Registered successfully as ${username}`,
				token,
			});
		});
	} catch (error) {
		res.json({
			error: error.message || `Internal server error`,
		});
	}
}
