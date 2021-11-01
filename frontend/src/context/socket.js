import { createContext } from "react";
import { io } from "socket.io-client";

// open socket to listen
export const socket = io("http://a5a5-35-3-37-142.ngrok.io");
export const SocketContext = createContext();
