import Layout from "../layouts/default";
import Header from "../components/captivePortal/header";
import Main from "../components/captivePortal/main";
import Events from "../components/captivePortal/events";

export default function CaptivePortal() {
  const { header, main, footer } = Layout(this.root);
  Header(header);
  Main(main);
  Events();
}