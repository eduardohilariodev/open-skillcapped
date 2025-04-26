import React from "react";
import { colors, typography, spacing, components, toneAndVoice } from "../styles";

const StyleGuideDemo: React.FC = () => {
  return (
    <div style={{ padding: spacing[8], maxWidth: "800px", margin: "0 auto" }}>
      <h1>League of Legends Style Guide</h1>

      <section style={{ marginBottom: spacing[8] }}>
        <h2>Color Palette</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacing[4] }}>
          {/* Gold colors */}
          <div>
            <h3>Gold</h3>
            <div
              style={{
                backgroundColor: colors.gold.light,
                padding: spacing[4],
                marginBottom: spacing[2],
                color: colors.black,
                width: "150px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Light Gold
            </div>
            <div
              style={{
                backgroundColor: colors.gold.medium,
                padding: spacing[4],
                marginBottom: spacing[2],
                color: colors.black,
                width: "150px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Medium Gold
            </div>
            <div
              style={{
                backgroundColor: colors.gold.dark,
                padding: spacing[4],
                color: colors.white,
                width: "150px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Dark Gold
            </div>
          </div>

          {/* Blue colors */}
          <div>
            <h3>Blue</h3>
            <div
              style={{
                backgroundColor: colors.blue.light,
                padding: spacing[4],
                marginBottom: spacing[2],
                color: colors.black,
                width: "150px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Light Blue
            </div>
            <div
              style={{
                backgroundColor: colors.blue.medium,
                padding: spacing[4],
                marginBottom: spacing[2],
                color: colors.white,
                width: "150px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Medium Blue
            </div>
            <div
              style={{
                backgroundColor: colors.blue.dark,
                padding: spacing[4],
                color: colors.white,
                width: "150px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Dark Blue
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: spacing[8] }}>
        <h2>Typography</h2>
        <div>
          <h3>Font Families</h3>
          <div
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize["2xl"],
              marginBottom: spacing[2],
            }}
          >
            Beaufort for LOL (Display)
          </div>
          <div
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.lg,
            }}
          >
            Spiegel (Body)
          </div>
        </div>

        <div style={{ marginTop: spacing[6] }}>
          <h3>Font Sizes</h3>
          <div
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize["6xl"],
              marginBottom: spacing[2],
            }}
          >
            6XL - 3.75rem
          </div>
          <div
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize["4xl"],
              marginBottom: spacing[2],
            }}
          >
            4XL - 2.25rem
          </div>
          <div
            style={{
              fontFamily: typography.fontFamily.display,
              fontSize: typography.fontSize["2xl"],
              marginBottom: spacing[2],
            }}
          >
            2XL - 1.5rem
          </div>
          <div
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.lg,
              marginBottom: spacing[2],
            }}
          >
            Large - 1.125rem
          </div>
          <div
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.base,
              marginBottom: spacing[2],
            }}
          >
            Base - 1rem
          </div>
          <div
            style={{
              fontFamily: typography.fontFamily.body,
              fontSize: typography.fontSize.sm,
            }}
          >
            Small - 0.875rem
          </div>
        </div>
      </section>

      <section style={{ marginBottom: spacing[8] }}>
        <h2>Components</h2>

        <div style={{ marginBottom: spacing[4] }}>
          <h3>Buttons</h3>
          <div style={{ display: "flex", gap: spacing[4], marginBottom: spacing[4] }}>
            <button
              style={{
                backgroundColor: components.button.primary.backgroundColor,
                color: components.button.primary.color,
                borderColor: components.button.primary.borderColor,
                fontFamily: components.button.primary.fontFamily,
                fontWeight: components.button.primary.fontWeight,
                textTransform: components.button.primary.textTransform as any,
                padding: `${spacing[2]} ${spacing[4]}`,
                border: `1px solid ${components.button.primary.borderColor}`,
              }}
            >
              Primary Button
            </button>

            <button
              style={{
                backgroundColor: components.button.secondary.backgroundColor,
                color: components.button.secondary.color,
                borderColor: components.button.secondary.borderColor,
                fontFamily: components.button.secondary.fontFamily,
                fontWeight: components.button.secondary.fontWeight,
                textTransform: components.button.secondary.textTransform as any,
                padding: `${spacing[2]} ${spacing[4]}`,
                border: `1px solid ${components.button.secondary.borderColor}`,
              }}
            >
              Secondary Button
            </button>

            <button
              style={{
                backgroundColor: components.button.disabled.backgroundColor,
                color: components.button.disabled.color,
                borderColor: components.button.disabled.borderColor,
                cursor: components.button.disabled.cursor as any,
                fontFamily: typography.fontFamily.display,
                fontWeight: typography.fontWeight.bold,
                textTransform: "uppercase",
                padding: `${spacing[2]} ${spacing[4]}`,
                border: `1px solid ${components.button.disabled.borderColor}`,
              }}
              disabled
            >
              Disabled Button
            </button>
          </div>
        </div>

        <div>
          <h3>Card</h3>
          <div
            style={{
              backgroundColor: components.card.backgroundColor,
              borderColor: components.card.borderColor,
              color: components.card.color,
              border: `1px solid ${components.card.borderColor}`,
              padding: spacing[4],
              maxWidth: "400px",
            }}
          >
            <h4
              style={{
                fontFamily: components.card.headerFont,
                color: colors.gold.medium,
                marginBottom: spacing[2],
              }}
            >
              Card Title
            </h4>
            <p style={{ fontFamily: components.card.bodyFont }}>
              This is a card component styled according to the League of Legends design system. The content uses the
              body font while the heading uses the display font.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Tone & Voice</h2>
        <h3>Core Principles</h3>
        <ul>
          {Object.entries(toneAndVoice.principles).map(([key, value]) => (
            <li key={key} style={{ marginBottom: spacing[2] }}>
              <strong style={{ color: colors.gold.medium }}>{key.replace("_", " ")}</strong>: {value}
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: spacing[4] }}>Example Phrases</h3>
        <div style={{ display: "flex", gap: spacing[6] }}>
          <div>
            <h4 style={{ color: colors.status.error }}>Avoid</h4>
            <ul>
              {toneAndVoice.examples.avoid.map((phrase, index) => (
                <li key={index} style={{ marginBottom: spacing[2], color: colors.status.error }}>
                  {phrase}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: colors.status.success }}>Prefer</h4>
            <ul>
              {toneAndVoice.examples.prefer.map((phrase, index) => (
                <li key={index} style={{ marginBottom: spacing[2], color: colors.status.success }}>
                  {phrase}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuideDemo;
