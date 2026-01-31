import type { Meta, StoryObj } from "@storybook/react";
import NakshatraWheel from "../components/vedic/NakshatraWheel";

const meta: Meta<typeof NakshatraWheel> = {
  title: "Vedic/NakshatraWheel",
  component: NakshatraWheel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "SVG circular wheel displaying all 27 Nakshatras with Moon position highlighting.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    moonNakshatra: {
      control: "select",
      options: [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
        "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
        "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
        "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
        "Uttara Bhadrapada", "Revati"
      ],
      description: "The Moon's current Nakshatra position",
    },
    moonDegree: {
      control: { type: "range", min: 0, max: 360, step: 0.1 },
      description: "Moon's ecliptic degree for precise positioning",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NakshatraWheel>;

export const Default: Story = {
  args: {
    moonNakshatra: "Rohini",
  },
};

export const Ashwini: Story = {
  args: {
    moonNakshatra: "Ashwini",
    moonDegree: 5.5,
  },
  parameters: {
    docs: {
      description: {
        story: "Moon in Ashwini - the first Nakshatra, ruled by Ketu.",
      },
    },
  },
};

export const Magha: Story = {
  args: {
    moonNakshatra: "Magha",
    moonDegree: 125.8,
  },
  parameters: {
    docs: {
      description: {
        story: "Moon in Magha - the royal Nakshatra at the start of Leo.",
      },
    },
  },
};

export const Revati: Story = {
  args: {
    moonNakshatra: "Revati",
    moonDegree: 355.8,
  },
  parameters: {
    docs: {
      description: {
        story: "Moon in Revati - the final Nakshatra, completing the lunar cycle.",
      },
    },
  },
};

export const WithAllData: Story = {
  args: {
    moonNakshatra: "Pushya",
    moonDegree: 100.5,
    showPadas: true,
    showLords: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Full display with Padas and Nakshatra Lords visible.",
      },
    },
  },
};
