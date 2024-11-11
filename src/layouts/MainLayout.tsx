import React from 'react';
import Header from './Header';
import '../styles/Content.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (

    <div className="layout-container">
      {/* Header Component */}
      <Header />
      {/* Main Content */}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;