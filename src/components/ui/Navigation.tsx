import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="hextech-navigation">
      <div className="hextech-navigation__container">
        <div className="hextech-navigation__logo">
          <Link to="/">Hextech UI</Link>
        </div>
        <ul className="hextech-navigation__links">
          <li className="hextech-navigation__link">
            <Link to="/">Home</Link>
          </li>
          <li className="hextech-navigation__link">
            <Link to="/ui-examples">UI Examples</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
