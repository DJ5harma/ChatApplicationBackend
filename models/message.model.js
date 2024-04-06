import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

const Message = mongoose.model(`Message`, messageSchema);
export default Message;
