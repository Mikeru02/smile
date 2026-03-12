import MainOnlyLayout from "../../layouts/mainOnly";
import Main from "../../components/user/signUp/main";
import Events from "../../components/user/signUp/events";

// export default function CaptivePortal() {
//   const { main } = MainOnlyLayout(this.root);

//   Main(main);
//   Events();
// }

export default class SignUp {
  constructor(root) {
    this.root = root;
  }
  
  render() {
    const { main } = MainOnlyLayout(this.root);

    Main(main);
    Events();
  }
}