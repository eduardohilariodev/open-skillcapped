import React, { ChangeEvent } from "react";
import { colors, typography } from "../../../styles";
import "./Searchbar.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export interface FilterBarProps {
  onValueUpdate: (newValue: string) => void;
  placeholder: string;
}

interface FilterBarState {
  value: string;
  isFocused: boolean;
}

export class Searchbar extends React.Component<FilterBarProps, FilterBarState> {
  constructor(props: FilterBarProps) {
    super(props);
    this.state = {
      value: "",
      isFocused: false,
    };
  }

  onUpdate(event: ChangeEvent<HTMLInputElement>): void {
    event.persist();
    this.setState((state) => {
      return {
        ...state,
        value: event.target.value || "",
      };
    });
    this.props.onValueUpdate(event.target.value);
  }

  onFocus = (): void => {
    this.setState({ isFocused: true });
  };

  onBlur = (): void => {
    this.setState({ isFocused: false });
  };

  render(): React.ReactNode {
    const { isFocused } = this.state;

    // Hextech styling
    const searchbarStyle: React.CSSProperties = {
      backgroundColor: colors.background.dark,
      borderBottom: `2px solid ${colors.gold.dark}`,
      padding: "1.5rem",
    };

    const inputContainerStyle: React.CSSProperties = {
      position: "relative",
      maxWidth: "800px",
      margin: "0 auto",
    };

    const inputStyle: React.CSSProperties = {
      backgroundColor: colors.background.medium,
      color: colors.white,
      borderRadius: "2px",
      border: `2px solid ${isFocused ? colors.blue.medium : colors.gold.dark}`,
      boxShadow: isFocused ? `0 0 10px rgba(12, 200, 185, 0.3)` : "none",
      padding: "1rem 1rem 1rem 3rem",
      fontSize: "1.2rem",
      fontFamily: typography.fontFamily.body,
      transition: "all 0.3s ease",
    };

    const iconStyle: React.CSSProperties = {
      color: isFocused ? colors.blue.medium : colors.gold.medium,
      transition: "color 0.3s ease",
    };

    return (
      <section className="hero searchbar hextech-searchbar is-small" style={searchbarStyle}>
        <div className="hero-body">
          <div className="field" style={inputContainerStyle}>
            <div className="control has-icons-left">
              <input
                className="input is-large hextech-search-input"
                type="text"
                value={this.state.value}
                placeholder={this.props.placeholder}
                onChange={this.onUpdate.bind(this)}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                style={inputStyle}
              />
              <span className="icon is-left">
                <FontAwesomeIcon icon={faSearch} style={iconStyle} />
              </span>
            </div>
          </div>
        </div>
        {/* Add subtle energy lines effect */}
        <div className="hextech-energy-lines" style={{ opacity: 0.1 }}></div>
      </section>
    );
  }
}
