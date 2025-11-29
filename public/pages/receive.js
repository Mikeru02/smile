import MainOnlyLayout from "../layouts/mainOnly";
import Main from "../components/receive/main";

export default function Portal() {
  const { main } = MainOnlyLayout(this.root);
  Main(main);

}