import MainOnlyLayout from "../../layouts/mainOnly";
import Main from "../../components/admin/login/main";
import Events from "../../components/admin/login/events";

export default function Admin() {
  const { main } = MainOnlyLayout(this.root);

  Main(main);

  Events();
}