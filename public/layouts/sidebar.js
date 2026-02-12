export default function SidebarLayout(root) {
  root.innerHTML = `
    <aside id="sidebar"></aside>
    <main id="main"></main>
  `

  return {
    sidebar: document.getElementById('sidebar'),
    main: document.getElementById('main')
  }
}
