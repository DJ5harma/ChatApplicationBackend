Apparently, my free backend server's free credits have been exhausted 😅.
You can run this locally:

Clone these 2 repos:

Backend GitHub repo: https://github.com/DJ5harma/ChatApplicationBackend

Frontend GitHub repo: https://github.com/DJ5harma/ChatApplicationFrontend

Make sure you have Node.js and MongoDB set up.
Firstly, run "npm i" in both the clones..
change the name of "sample.env" file in backend to ".env" 
(you can also change .env's contents if you wish, like using a MongoAtlas URI, or a custom JWT_SECRET)..
then run "npm run dev" in the backend, 
and then again "npm run dev in the frontend"

visit the URL Vite gives you on your browser and it shall work.
