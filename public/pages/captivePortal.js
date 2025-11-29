import MainOnlyLayout from "../layouts/mainOnly";
import Main from "../components/captivePortal/main";
import Events from "../components/captivePortal/events";

// export default function CaptivePortal() {
//   const { main } = MainOnlyLayout(this.root);

//   Main(main);
//   Events();
// }

export default class CaptivePortal {
  constructor(root) {
    this.root = root;
  }
  
  render() {
    const { main } = MainOnlyLayout(this.root);

    Main(main);
    Events();
  }
}