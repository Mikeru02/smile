import SocketClient from "./socketClient.js";

const token = localStorage.getItem("token");

const socketClient = new SocketClient();

export default socketClient;