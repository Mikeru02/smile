import styles from "./component.module.css";

export default function MainCard(root, title) {
    const card = document.createElement("div");
    card.className = styles["main"];

    const header = document.createElement("h1");
    header.textContent = title;
    card.appendChild(header);

    const cardContent = document.createElement("div");
    cardContent.className = styles["card-content"];
    card.appendChild(cardContent);

    root.appendChild(card);

    return cardContent;

}