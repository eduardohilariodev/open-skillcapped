import * as React from "react";
import "../styles/components/_footer.css";

export function Footer(): React.ReactElement {
  return (
    <footer className="hextech-footer">
      <div className="hextech-footer-content">
        <p>
          Better Skill Capped by{" "}
          <a href="https://shepherdjerred.com/" className="hextech-footer-link">
            Jerred Shepherd
          </a>
          .
          <br />
          Have a problem? Open an issue on{" "}
          <a href="https://github.com/shepherdjerred/better-skill-capped/issues/new" className="hextech-footer-link">
            GitHub
          </a>
          <br />
          All content is property of{" "}
          <a href="https://www.skill-capped.com/" className="hextech-footer-link">
            Skill Capped
          </a>
          .
          <br />
          This project is in no way endorsed or affiliated with Skill Capped.
          <br />
          Source available on{" "}
          <a href="https://github.com/shepherdjerred/better-skill-capped" className="hextech-footer-link">
            GitHub
          </a>
          . Licensed under the{" "}
          <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" className="hextech-footer-link">
            GNU GPLv3
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
