import MainOnlyLayout from "../../layouts/mainOnly";
import Main from "../../components/admin/login/main";
import Events from "../../components/admin/login/events";

// export default function AdminLogin() {
//   const { main } = MainOnlyLayout(this.root);

//   Main(main);

//   Events();
// }

export default class AdminLogin {
  constructor(root) {
    this.root = root;
  }

  render() {
    const { main } = MainOnlyLayout(this.root);

    Main(main);

    Events();
  }
}