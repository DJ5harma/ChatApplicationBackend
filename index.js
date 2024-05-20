import dotenv from "dotenv";
import cors from "cors";

import mongoose from "mongoose";
import express from "express";
import { WebSocketServer } from "ws";

import loginC from "./controllers/login.js";
import registerC from "./controllers/register.js";
import wall from "./utilities/authWall.js";

import jwt from "jsonwebtoken";
import Message from "./models/message.model.js";
import getData from "./controllers/getData.js";

dotenv.config();

const { PORT, MONGO_URI, CLIENT_URL, JWT_SECRET } = process.env;

export const jwtSecret = JWT_SECRET;

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: CLIENT_URL,
		optionssuccessstatus: 200,
		credentials: true,
	})
);

app.post("/test", (req, res)={
res.send("Works");});
app.post("/api/auth/Login", loginC);
app.post("/api/auth/Register", registerC);
app.post("/api/auth/Wall", wall);
app.post("/api/data", wall, getData);

mongoose.connect(MONGO_URI).then(() => {
	console.log("MongoDB connected");
});

const server = app.listen(PORT, console.log(`Running on ${PORT}`));

const wss = new WebSocketServer({ server });

const onlineUsers = new Set();

wss.on("connection", (connection, req) => {
	connection.addEventListener("message", async ({ data }) => {
		const { token } = JSON.parse(data);
		if (!token) return;

		jwt.verify(token, JWT_SECRET, async (err, info) => {
			// Verifying if the token is correct acc. to our secret

			const { username, _id } = info; // Getting the username out of the verified token

			connection._id = _id; // storing the userId in connection object itself for future use

			onlineUsers.add(username); // Marking this user online

			wss.clients.forEach((client) => {
				client.send(
					JSON.stringify({
						type: "userOnline",
						username,
					})
				);
			}); // Telling every client about this new online user

			connection.send(
				JSON.stringify({
					type: "allOnlineUsers",
					onlineUsers: [...onlineUsers],
				})
			); // Sending the newly connected user the data about all the online users

			connection.addEventListener("message", async ({ data }) => {
				const { type, content, receiverId, offlineUserUsername } =
					JSON.parse(data);

				const senderId = connection._id;

				switch (type) {
					case "sendMessage":
						const message = new Message({
							senderId,
							receiverId,
							content,
						});

						wss.clients.forEach((connection) => {
							if (
								connection._id === senderId ||
								connection._id === receiverId
							) {
								connection.send(
									JSON.stringify({
										type: "sendMessage",
										message,
									})
								);
							}
						});
						await message.save();

						break;

					case "userOffline":
						onlineUsers.delete(username); // Marking this user offline
						wss.clients.forEach((client) => {
							client.send(
								JSON.stringify({
									type: "userOffline",
									username: offlineUserUsername,
								})
							);
						});

					// case "newUser":
					// 	wss.clients.forEach(async (connection) => {
					// 		const newUser = await User.findById(senderId);
					// 		connection.send(
					// 			JSON.stringify({
					// 				type: "newUser",
					// 				newUser,
					// 			})
					// 		);
					// 	});
					// 	break;
					default:
						break;
				}
			});

			connection.onclose = () => {
				onlineUsers.delete(username); // Marking this user offline
				wss.clients.forEach((client) => {
					client.send(
						JSON.stringify({
							type: "userOffline",
							username,
						})
					);
				});
			}; // Telling every client about the user if it closes the connection
		});
	});
});
