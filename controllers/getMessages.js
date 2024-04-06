import Message from "../models/message.model.js";

export default async function getMessages(req, res) {
	const { userId } = req;

	try {
		const messages = await Message.find({
			$or: [{ senderId: userId }, { receiverId: userId }],
		});

		return res.json({
			messages,
		});
	} catch (error) {
		res.json({
			error: error.message || `Internal server error`,
		});
	}
}
