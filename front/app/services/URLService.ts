const isServer = typeof window === "undefined";

const IMG_URL = "http://localhost:3001";
// Server-side calls (NextAuth) must reach the API over the Docker network;
// browser calls keep the original localhost URL.
const API_URL =
  isServer && process.env.API_URL_INTERNAL
    ? process.env.API_URL_INTERNAL
    : "http://127.0.0.1:3001/api";
const Websocket_URL = "ws://localhost:3001";

export { IMG_URL };
export { API_URL };
export { Websocket_URL };


const URLService = {}
export default URLService;