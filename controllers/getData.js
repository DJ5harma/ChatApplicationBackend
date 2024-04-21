import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export default async function getData(req, res) {
	const { userId } = req;

	try {
		const messages = await Message.find({
			$or: [{ senderId: userId }, { receiverId: userId }],
		});
		const users = await User.find().select(["-password", "-updatedAt"]); // Getting all the users from mongoDB

		console.log(users);

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
