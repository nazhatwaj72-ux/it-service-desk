import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header onMenuToggle={() => setSidebarOpen((open) => !open)} />
      <div className="app-shell__body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
