import User from "../models/user.model.js";

export default async function getUsers(req, res) {
	try {
		const users = (await User.find()).map(({ _id, username }) => ({
			_id,
			username,
		})); // Getting all the users from mongoDB

		return res.json({
			users,
		});
	} catch (error) {
		res.json({
			error: error.message || `Internal server error`,
		});
	}
}
