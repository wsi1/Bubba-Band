import { createContext } from "react";
import { io } from "socket.io-client";

// open socket to listen
export const socket = io("https://bubbaband.naitian.org");
export const SocketContext = createContext();
