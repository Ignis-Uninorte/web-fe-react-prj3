

const Header = () => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <div className="header-logo">
          <h1>Logo</h1>
        </div>
        <nav className="header-nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;