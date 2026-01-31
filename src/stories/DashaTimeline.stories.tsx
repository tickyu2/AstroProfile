import type { Meta, StoryObj } from "@storybook/react";
import DashaTimeline from "../components/vedic/DashaTimeline";

const meta: Meta<typeof DashaTimeline> = {
  title: "Vedic/DashaTimeline",
  component: DashaTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Horizontal Vimshottari Mahadasha timeline with optional Antardasha expansion.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DashaTimeline>;

export const Basic: Story = {
  args: {
    dashas: [
      { planet: "Venus", start: "1990-05-15", end: "2010-05-15" },
      { planet: "Sun", start: "2010-05-15", end: "2016-05-15" },
      { planet: "Moon", start: "2016-05-15", end: "2026-05-15" },
      { planet: "Mars", start: "2026-05-15", end: "2033-05-15" },
      { planet: "Rahu", start: "2033-05-15", end: "2051-05-15" },
    ],
    currentDate: "2025-01-18",
  },
  parameters: {
    docs: {
      description: {
        story: "Basic Mahadasha timeline with current position highlighted.",
      },
    },
  },
};

export const FullCycle: Story = {
  args: {
    dashas: [
      { planet: "Ketu", start: "1980-01-01", end: "1987-01-01" },
      { planet: "Venus", start: "1987-01-01", end: "2007-01-01" },
      { planet: "Sun", start: "2007-01-01", end: "2013-01-01" },
      { planet: "Moon", start: "2013-01-01", end: "2023-01-01" },
      { planet: "Mars", start: "2023-01-01", end: "2030-01-01" },
      { planet: "Rahu", start: "2030-01-01", end: "2048-01-01" },
      { planet: "Jupiter", start: "2048-01-01", end: "2064-01-01" },
      { planet: "Saturn", start: "2064-01-01", end: "2083-01-01" },
      { planet: "Mercury", start: "2083-01-01", end: "2100-01-01" },
    ],
    currentDate: "2025-01-18",
  },
  parameters: {
    docs: {
      description: {
        story: "Complete 120-year Vimshottari cycle showing all 9 Mahadashas.",
      },
    },
  },
};

export const WithAntardashas: Story = {
  args: {
    dashas: [
      { planet: "Saturn", start: "2015-03-01", end: "2034-03-01" },
      { planet: "Mercury", start: "2034-03-01", end: "2051-03-01" },
    ],
    antardashas: [
      { planet: "Saturn", start: "2015-03-01", end: "2018-03-04" },
      { planet: "Mercury", start: "2018-03-04", end: "2020-11-13" },
      { planet: "Ketu", start: "2020-11-13", end: "2021-12-22" },
      { planet: "Venus", start: "2021-12-22", end: "2025-02-22" },
      { planet: "Sun", start: "2025-02-22", end: "2026-02-04" },
      { planet: "Moon", start: "2026-02-04", end: "2027-09-04" },
    ],
    currentDate: "2025-01-18",
    showAntardashas: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Saturn Mahadasha with Antardasha sub-periods expanded.",
      },
    },
  },
};

export const SaturnMahadasha: Story = {
  args: {
    dashas: [
      { planet: "Saturn", start: "2015-01-01", end: "2034-01-01" },
    ],
    currentDate: "2025-01-18",
    highlightCurrent: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Single Saturn Mahadasha (19 years) with current position.",
      },
    },
  },
};

export const CompactView: Story = {
  args: {
    dashas: [
      { planet: "Moon", start: "2016-05-15", end: "2026-05-15" },
      { planet: "Mars", start: "2026-05-15", end: "2033-05-15" },
      { planet: "Rahu", start: "2033-05-15", end: "2051-05-15" },
    ],
    currentDate: "2025-01-18",
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Compact timeline view for embedding in smaller spaces.",
      },
    },
  },
};
