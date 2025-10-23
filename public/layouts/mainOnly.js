export default function MainOnlyLayout(root){
    root.innerHTML = `
        <main id="main"></main>
    `;

    return {
        main: document.getElementById("main")
    }
}