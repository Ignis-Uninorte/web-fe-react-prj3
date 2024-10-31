import React from 'react';
import Header from '../components/Header';


interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (

    <div className="layout-container">
      {/* Header Component */}
      <Header />
      <main className="content">
        {children}
      </main>

    </div>
  );
};

export default MainLayout;
