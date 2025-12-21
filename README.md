# AtyleSync-AI

Monorepo with `client` (Vite + React) and `server` (Express).

Quick start

- Client:
  - `cd client`
  - `npm install`
  - `npm run dev`
- Server:
  - `cd server`
  - `npm install`
  - Add any required environment variables to the root `.env` or `server/.env`.
  - Start your server (add a start script if needed). Example: `node index.js` or `npx nodemon index.js`.

Notes

- This repo uses Vite for the frontend (`npm run dev` in `client`).
- `dotenv` is listed in the server dependencies — provide environment variables via `.env`.

If you want, I can add a `start` script to the server `package.json` and adjust these instructions.
