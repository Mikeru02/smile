import SocketClient from "./socketClient.js";

const token = localStorage.getItem("token");

const socketClient = new SocketClient();
socketClient.connect()

export default socketClient;