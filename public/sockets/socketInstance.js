import SocketClient from "./socketClient.js";
import checkToken from "../utils/checkToken.js";

const token = localStorage.getItem('token');
const socketClient = new SocketClient();

if (checkToken(token)) {
    socketClient.connect();
}

export default socketClient;