import { io } from "socket.io-client";

const url = import.meta.env.VITE_SOCKETIO_URL ?? "http://localhost:4000";

export const socket = io(url);
