export default function Main(root){
    root.innerHTML = `
        <h1> Welcome to S.M.I.L.E. Wifi!<h1>
        <button id="start-drop">🚮 Press Me to Start Drop</button>
        <p id="earned">🕒 Waiting...</p>
        <form action="/v1/splash/authenticate" method="post">
            <button id="authBtn" type="submit" disabled>Click to Get Internet</button>
        </form>
    `;
}