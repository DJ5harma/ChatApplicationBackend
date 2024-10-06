Apparently, I'm running out of free credits on my backend server provider 😅 so the app may fail to work beyond the Login form when you see this, so run locally :

# To run this locally:

Clone these 2 repos:

Backend GitHub repo: https://github.com/DJ5harma/ChatApplicationBackend

Frontend GitHub repo: https://github.com/DJ5harma/ChatApplicationFrontend

- Make sure you have Node.js and MongoDB set up.
- Firstly, run "npm i" in both the clones..
- Change the name of "sample.env" files in backend and frontend directories to ".env", 
- (you can also change .env's contents if you wish, like using a MongoAtlas URI, or a custom JWT_SECRET, 
    or change PORTs if your system is already using them, etc.)..
- Then run "npm run dev" in the backend directory's root, 
- Then run "npm run dev" in the frontend directory's root

visit the URL Vite gives you (something similar to localhost:5173) on your browser and it shall work.
-make sure the URLs in .env match the one Vite uses.
