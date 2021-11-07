import { createContext } from "react";
import { io } from "socket.io-client";

// open socket to listen
export const socket = io("http://73f0-35-2-21-78.ngrok.io");
export const SocketContext = createContext();
