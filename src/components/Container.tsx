import classNames from "classnames";
import React from "react";
import { colors } from "../styles";
import { HextechDiamond, HextechSquare } from "../styles/components/hextech-shapes";

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

  // Apply League of Legends Hextech styling with inline styles
  const sectionStyle: React.CSSProperties = {
    backgroundColor: colors.background.dark,
    padding: "1.5rem",
    position: "relative",
    overflow: "hidden",
  };

  const columnsStyle: React.CSSProperties = {
    margin: 0,
    position: "relative" as React.CSSProperties["position"],
    zIndex: 2,
  };

  const sidebarStyle: React.CSSProperties = sidebar
    ? {
        borderRight: `1px solid ${colors.gold.dark}`,
        paddingRight: "1.5rem",
        position: "relative" as React.CSSProperties["position"],
      }
    : {};

  // Add Hextech decorative elements
  const hextechDecorations = (
    <>
      {/* Top-right diamond accent */}
      <div style={{ position: "absolute", top: "20px", right: "20px", opacity: 0.2, zIndex: 1 }}>
        <HextechDiamond size="100px" color={colors.blue.medium} borderColor={colors.blue.light} />
      </div>

      {/* Bottom-left square accent */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px", opacity: 0.2, zIndex: 1 }}>
        <HextechSquare size="80px" color={colors.gold.dark} borderColor={colors.gold.medium} />
      </div>
    </>
  );

  return (
    <section className="section hextech-container" style={sectionStyle}>
      {hextechDecorations}

      <div className="columns" style={columnsStyle}>
        {sidebar && (
          <div className="column is-one-fifth is-offset-1 hextech-sidebar" style={sidebarStyle}>
            {sidebar}
          </div>
        )}
        <div className={`${mainColumnClasses} hextech-main-content`}>{children}</div>
      </div>
    </section>
  );
}
