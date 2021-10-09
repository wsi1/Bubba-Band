import { createContext } from "react";
import { io } from "socket.io-client";

// open socket to listen
export const socket = io("http://localhost:5000");
export const SocketContext = createContext();
