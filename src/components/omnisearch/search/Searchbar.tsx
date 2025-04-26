import React, { ChangeEvent } from "react";
import "./Searchbar.sass";
import "../../../styles/input-states.css";
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
    const hasValue = this.state.value.length > 0;
    const inputClasses = `input is-large hextech-input hextech-search-input has-icon-left ${hasValue ? "is-filled" : ""}`;

    return (
      <section className="hero searchbar hextech-searchbar is-small">
        <div className="hero-body">
          <div className="hextech-search-container">
            <div className="hextech-input-container">
              <input
                className={inputClasses}
                type="text"
                value={this.state.value}
                placeholder={this.props.placeholder}
                onChange={this.onUpdate.bind(this)}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className={`hextech-input-icon is-left ${isFocused ? "is-focused" : ""}`}
              />
              <div className="hextech-energy-lines"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
