import { createContext } from "react";
import { io } from "socket.io-client";

// open socket to listen
export const socket = io("http://ec2-3-17-64-150.us-east-2.compute.amazonaws.com/");
export const SocketContext = createContext();
