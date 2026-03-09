import SocketClient from "./socketClient.js";
import checkToken from "../utils/checkToken.js";

const token = localStorage.getItem('token');
let socketClient;

if (checkToken(token)) {
    socketClient = new SocketClient();
    socketClient.connect();
}

export default socketClient;