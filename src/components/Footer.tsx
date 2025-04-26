import * as React from "react";
import { colors, typography } from "../styles";

export function Footer(): React.ReactElement {
  // Apply League of Legends styling with inline styles
  const footerStyle = {
    backgroundColor: colors.background.medium,
    padding: "2rem 1.5rem",
    borderTop: `1px solid ${colors.gold.dark}`,
  };

  const contentStyle = {
    fontFamily: typography.fontFamily.body,
    fontSize: "0.9rem",
    color: colors.lightGrey,
  };

  const linkStyle = {
    color: colors.blue.medium,
    textDecoration: "none",
    fontWeight: typography.fontWeight.medium,
  };

  return (
    <footer className="footer" style={footerStyle}>
      <div className="content has-text-centered" style={contentStyle}>
        <p>
          Better Skill Capped by{" "}
          <a href="https://shepherdjerred.com/" style={linkStyle}>
            Jerred Shepherd
          </a>
          .
          <br />
          Have a problem? Open an issue on{" "}
          <a href="https://github.com/shepherdjerred/better-skill-capped/issues/new" style={linkStyle}>
            GitHub
          </a>
          <br />
          All content is property of{" "}
          <a href="https://www.skill-capped.com/" style={linkStyle}>
            Skill Capped
          </a>
          .
          <br />
          This project is in no way endorsed or affiliated with Skill Capped.
          <br />
          Source available on{" "}
          <a href="https://github.com/shepherdjerred/better-skill-capped" style={linkStyle}>
            GitHub
          </a>
          . Licensed under the{" "}
          <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" style={linkStyle}>
            GNU GPLv3
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
