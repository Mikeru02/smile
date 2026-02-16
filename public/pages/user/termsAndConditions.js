import MainOnlyLayout from "../../layouts/mainOnly";
import Main from "../../components/user/termsAndConditions/main";
import Events from "../../components/user/termsAndConditions/events";

export default class TermsAndConditions {
  constructor(root) {
    this.root = root;
  }
  
  render() {
    const { main } = MainOnlyLayout(this.root);

    Main(main);
    Events();
  }
}
