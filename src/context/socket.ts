import React from 'react';
import socketio, { Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from '../types/socketTypes';

const SOCKET_URL = "http://localhost:5000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = socketio(SOCKET_URL);
export const SocketContext = React.createContext(socket);

export const SocketIDContext = React.createContext<string | null>(null);