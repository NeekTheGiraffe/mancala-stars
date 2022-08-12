# Mancala Stars

This is the frontend code for my [multiplayer Mancala web app](https://neekthegiraffe.github.io/mancala-stars/), where you can play Mancala against an "AI" or against other people.

This code contains all the client-side logic for joining games and rendering the board.

## Try the app online

1. Visit the [webpage](https://neekthegiraffe.github.io/mancala-stars/)!
2. Click "Play vs. AI" to play a game against the AI.
3. If you have someone to play with, try creating a lobby and sending them the join code. Then start a game and play!

## Running the app locally

1. To run this project, you need [Git](https://git-scm.com/downloads) and [Node/npm](https://nodejs.org/en/download/) installed.
2. Open a terminal and clone the [backend repository](https://github.com/NeekTheGiraffe/mancala-stars-backend):
```
git clone https://github.com/NeekTheGiraffe/mancala-stars-backend.git
```
3. Install the Node dependencies:
```
cd mancala-stars-backend
npm install
```
4. Run the backend server:
```
npm run dev
```
5. Open another terminal and clone the frontend repository:
```
git clone https://github.com/NeekTheGiraffe/mancala-stars.git
```
6. Inside this repository, open `src/context/socket.ts` and uncomment/comment the following lines so they look like this:
```
const SOCKET_URL = "http://localhost:5000";
//const SOCKET_URL = "https://mancala-stars.herokuapp.com";
```
This will point the frontend app to your locally-running server.
7. Run the frontend app:
```
npm start
```
8. Navigate to [http://localhost:3000](http://localhost:3000) and the app should be running!

## App features

* Play Mancala against an AI or with friends by entering unique lobby codes
* Multiplayer lobby system
* Secure, authoritative server to prevent cheating/attacks

## Future directions

* Improve the "AI" (currently just randomly chooses a move)
* Flesh out the lobby system and create public lobbies
* Embed the AI in the frontend code to play against them without Internet
* Include lobby codes as links themselves, allowing users to just follow links instead of manually copying and pasting codes
* Include more social features such as a live chat