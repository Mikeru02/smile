import MainOnlyLayout from '../../layouts/mainOnly.js';
import Main from '../../components/user/timePortal/main.js';
import Events from '../../components/user/timePortal/event.js';
import ModalEvent from '../../components/user/timePortal/modalEvent.js';

export default class TimePortal {
    constructor(root) {
        this.root = root;
    }

    render() {
        const { main } = MainOnlyLayout(this.root);

        Main(main);
        Events();
        ModalEvent();
    }
}