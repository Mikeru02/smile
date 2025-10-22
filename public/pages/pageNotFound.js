import Layout from "../layouts/default";
import Header from "../components/pageNotFound/header";

export default function PageNotFound() {
  const { header, main, footer } = Layout(this.root);
  Header(header);
}