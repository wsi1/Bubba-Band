import { createContext } from "react";
import { io } from "socket.io-client";

// open socket to listen
export const socket = io("http://15c3-35-2-150-10.ngrok.io");
export const SocketContext = createContext();
