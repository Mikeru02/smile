import Main from "../components/lost/main";
import Events from "../components/lost/event";
import MainOnlyLayout from "../layouts/mainOnly";

export default class Lost {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { main } = MainOnlyLayout(this.root);
        Main(main);
        Events();
    }
}