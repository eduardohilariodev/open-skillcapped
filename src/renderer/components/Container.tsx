import React from "react";
import classNames from "classnames";

interface ContainerProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Container({
  children,
  sidebar,
}: ContainerProps): React.ReactElement {
  const mainColumnClasses: string = classNames({
    column: true,
    "is-three-fifths": sidebar,
    "is-four-fifths": !sidebar,
    "is-offset-1": !sidebar,
  });
  return (
    <section className="section">
      <div className="columns">
        {sidebar && (
          <div className="column is-one-fifth is-offset-1">{sidebar}</div>
        )}
        <div className={mainColumnClasses}>{children}</div>
      </div>
    </section>
  );
}
