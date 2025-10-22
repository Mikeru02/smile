import Layout from "../layouts/default";
import Header from "../components/admin/header";

export default function Admin() {
  const { header, main, footer } = Layout(this.root);
  Header(header);
}