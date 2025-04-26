import classNames from "classnames";
import React from "react";
import { colors } from "../styles";

export interface ContainerProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function Container({ children, sidebar }: ContainerProps): React.ReactElement {
  const mainColumnClasses: string = classNames({
    column: true,
    "is-three-fifths": sidebar,
    "is-four-fifths": !sidebar,
    "is-offset-1": !sidebar,
  });

  // Apply League of Legends styling with inline styles
  const sectionStyle = {
    backgroundColor: colors.background.dark,
    padding: "1.5rem",
  };

  const columnsStyle = {
    margin: 0,
  };

  const sidebarStyle = sidebar
    ? {
        borderRight: `1px solid ${colors.gold.dark}`,
        paddingRight: "1.5rem",
      }
    : {};

  return (
    <section className="section" style={sectionStyle}>
      <div className="columns" style={columnsStyle}>
        {sidebar && (
          <div className="column is-one-fifth is-offset-1" style={sidebarStyle}>
            {sidebar}
          </div>
        )}
        <div className={mainColumnClasses}>{children}</div>
      </div>
    </section>
  );
}
