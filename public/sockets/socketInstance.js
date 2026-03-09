import SocketClient from "./socketClient.js";

const socketClient = new SocketClient();
socketClient.connect();

export default socketClient;