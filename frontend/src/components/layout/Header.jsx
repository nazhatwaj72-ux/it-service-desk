function Header({ onMenuToggle }) {
  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true">
            IT
          </span>
          <div>
            <h1 className="header__title">IT Service Desk</h1>
            <p className="header__subtitle">Support ticket management</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
