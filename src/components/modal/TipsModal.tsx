import * as React from "react";
import { colors, typography } from "../../styles";
import { Modal } from "./Modal";

export interface TipsModalProps {
  onClose: () => void;
  isVisible: boolean;
}

export function TipsModal({ onClose, isVisible }: TipsModalProps): React.ReactElement {
  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: colors.background.light,
    color: colors.gold.light,
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
    fontSize: "0.9rem",
    border: "none",
    borderBottom: `1px solid ${colors.gold.dark}`,
  };

  const tableStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    color: colors.white,
    marginBottom: "1.5rem",
    width: "100%",
  };

  const tableCellStyle: React.CSSProperties = {
    borderColor: `rgba(120, 90, 40, 0.3)`,
    padding: "0.5rem",
  };

  const operatorCellStyle: React.CSSProperties = {
    ...tableCellStyle,
    color: colors.blue.light,
    fontWeight: typography.fontWeight.bold,
  };

  const paragraphStyle: React.CSSProperties = {
    marginBottom: "1rem",
    lineHeight: 1.6,
  };

  return (
    <Modal title="Search Tips" onClose={onClose} isVisible={isVisible} variant="blue">
      <div className="hextech-tips-content">
        <p style={paragraphStyle}>
          Better Skill Capped uses a technique called fuzzy searching to display search results. Fuzzy searching shows
          not only exact matches, but also results that are somewhat similar to your query. This lets you not worry
          about making typos when searching, or having to know the exact thing you&apos;re looking for.
        </p>

        <p style={paragraphStyle}>
          Below is a list of search operators that advanced users can employ to more powerfully search Skill
          Capped&apos;s videos.
        </p>

        <table className="table hextech-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Operator</th>
              <th style={tableHeaderStyle}>Example</th>
              <th style={tableHeaderStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableCellStyle}>No Operator</td>
              <td style={operatorCellStyle}>Tryndamere</td>
              <td style={tableCellStyle}>Results that fuzzy match &apos;Tryndamere&apos;</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>=</td>
              <td style={operatorCellStyle}>=Jax Tips</td>
              <td style={tableCellStyle}>Results that exactly match &apos;Jax Tips&apos;</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>&apos;</td>
              <td style={operatorCellStyle}>&apos;Jungle</td>
              <td style={tableCellStyle}>Results that include &apos;Jungle&apos;</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>!</td>
              <td style={operatorCellStyle}>!Evelyn</td>
              <td style={tableCellStyle}>Results that do not include &apos;Evelyn&apos;</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>^</td>
              <td style={operatorCellStyle}>&apos;How to</td>
              <td style={tableCellStyle}>Results that start with &apos;How to&apos;</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>!^</td>
              <td style={operatorCellStyle}>!^Season 10</td>
              <td style={tableCellStyle}>Results that do not start with &apos;Season 10&apos;</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>$</td>
              <td style={operatorCellStyle}>Item Guide$</td>
              <td style={tableCellStyle}>Results that end with &apos;Item Guide&apos;</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>!$</td>
              <td style={operatorCellStyle}>!Pro Strategy$</td>
              <td style={tableCellStyle}>Results that do not end with &apos;Pro Strategy&apos;</td>
            </tr>
          </tbody>
        </table>

        <p style={paragraphStyle}>
          White space acts as an <span className="hextech-text-glow">AND</span> operator, while a pipe character, i.e.
          |, acts as an <span className="hextech-text-glow">OR</span> operator.
        </p>

        <p style={paragraphStyle}>
          Example: <span style={{ color: colors.blue.light }}>&apos;Tryndamere Strategy&apos;</span> will search for
          results that contain both &apos;Tryndamere&apos; <span className="hextech-text-glow">AND</span>{" "}
          &apos;Strategy&apos;
        </p>

        <p style={paragraphStyle}>
          Example: <span style={{ color: colors.blue.light }}>&apos;Item|Guide&apos;</span> will search for results that
          contain either &apos;Item&apos; <span className="hextech-text-glow">OR</span> &apos;Guide&apos; or both words.
        </p>
      </div>
    </Modal>
  );
}
