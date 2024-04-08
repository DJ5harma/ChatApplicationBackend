import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export default async function getData(req, res) {
	const { userId } = req;

	try {
		const messages = await Message.find({
			$or: [{ senderId: userId }, { receiverId: userId }],
		});
		const users = (await User.find()).map(({ _id, username }) => ({
			_id,
			username,
		})); // Getting all the users from mongoDB

		return res.json({
			messages,
			users,
		});
	} catch (error) {
		res.json({
			error: error.message || `Internal server error`,
		});
	}
}
