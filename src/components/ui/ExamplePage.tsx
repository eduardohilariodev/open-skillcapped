import React, { useState } from "react";
import { Button, Card, Checkbox, Grid, HextechFrame, Input, Modal, SearchResult, SelectInput, Tag } from "./index";

const ExamplePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("");

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <div className="hextech-example-page">
      <h1 className="hextech-example-page__title">Hextech UI Components</h1>

      <section className="hextech-example-page__section">
        <h2>Button Component</h2>
        <Grid gap="md">
          <Grid.Item md={4}>
            <Button variant="primary">Primary Button</Button>
          </Grid.Item>
          <Grid.Item md={4}>
            <Button variant="secondary">Secondary Button</Button>
          </Grid.Item>
          <Grid.Item md={4}>
            <Button variant="utility">Utility Button</Button>
          </Grid.Item>
        </Grid>
      </section>

      <section className="hextech-example-page__section">
        <h2>Input Components</h2>
        <Grid gap="md">
          <Grid.Item md={6}>
            <Input
              label="Text Input"
              placeholder="Enter your text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Grid.Item>
          <Grid.Item md={6}>
            <SelectInput
              label="Select Input"
              options={selectOptions}
              placeholder="Select an option"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            />
          </Grid.Item>
          <Grid.Item md={6}>
            <Checkbox
              label="Checkbox Example"
              checked={checkboxValue}
              onChange={() => setCheckboxValue(!checkboxValue)}
            />
          </Grid.Item>
        </Grid>
      </section>

      <section className="hextech-example-page__section">
        <h2>Frame and Card Components</h2>
        <Grid gap="md">
          <Grid.Item md={6}>
            <HextechFrame title="Hextech Frame" variant="gold" interactive>
              <p>This is content inside a Hextech frame component.</p>
            </HextechFrame>
          </Grid.Item>
          <Grid.Item md={6}>
            <Card
              title="Card Example"
              variant="blue"
              interactive
              meta={[{ icon: "💎", text: "Card Meta Item" }]}
              footer={
                <Button size="sm" variant="primary">
                  Card Action
                </Button>
              }
            >
              <p>This is content inside a card component.</p>
            </Card>
          </Grid.Item>
        </Grid>
      </section>

      <section className="hextech-example-page__section">
        <h2>Tag Components</h2>
        <div className="hextech-tag-group">
          <Tag label="Gold Tag" variant="gold" />
          <Tag label="Blue Tag" variant="blue" />
          <Tag label="Dark Tag" variant="dark" />
          <Tag label="Removable Tag" variant="gold" removable onRemove={() => alert("Tag removed")} />
          <Tag label="Clickable Tag" variant="blue" onClick={() => alert("Tag clicked")} />
        </div>
      </section>

      <section className="hextech-example-page__section">
        <h2>Search Result Component</h2>
        <SearchResult
          title="Example Search Result"
          description="This is an example of a search result component with primary and secondary actions."
          variant="gold"
          meta={[
            { label: "Type", value: "Example" },
            { label: "Date", value: "Today" },
          ]}
          primaryAction="View Details"
          onPrimaryAction={() => alert("Primary action clicked")}
          secondaryAction="Share"
          onSecondaryAction={() => alert("Secondary action clicked")}
        />
      </section>

      <section className="hextech-example-page__section">
        <h2>Modal Component</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

        <Modal
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          variant="gold"
          footer={
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Button variant="utility" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  alert("Confirmed!");
                  setIsModalOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          }
        >
          <p>This is an example modal with custom footer buttons.</p>
        </Modal>
      </section>

      <section className="hextech-example-page__section">
        <h2>Grid Layout</h2>
        <Grid layout="3-cols" gap="lg">
          <Grid.Item>
            <div className="grid-example-item">Column 1</div>
          </Grid.Item>
          <Grid.Item>
            <div className="grid-example-item">Column 2</div>
          </Grid.Item>
          <Grid.Item>
            <div className="grid-example-item">Column 3</div>
          </Grid.Item>
        </Grid>
      </section>
    </div>
  );
};

export default ExamplePage;
