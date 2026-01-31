import type { Meta, StoryObj } from "@storybook/react";
import GrahaDignityGrid from "../components/vedic/GrahaDignityGrid";

const meta: Meta<typeof GrahaDignityGrid> = {
  title: "Vedic/GrahaDignityGrid",
  component: GrahaDignityGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Expandable grid displaying all 9 Grahas with their sign placements and dignity states.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GrahaDignityGrid>;

export const Sample: Story = {
  args: {
    grahas: [
      { name: "Sun", sign: "Aries", degree: 10.5, dignity: "exalted", nakshatra: "Ashwini" },
      { name: "Moon", sign: "Taurus", degree: 3.2, dignity: "exalted", nakshatra: "Rohini" },
      { name: "Mars", sign: "Capricorn", degree: 28.0, dignity: "exalted", nakshatra: "Dhanishta" },
      { name: "Mercury", sign: "Virgo", degree: 15.0, dignity: "exalted", nakshatra: "Hasta" },
      { name: "Jupiter", sign: "Cancer", degree: 5.0, dignity: "exalted", nakshatra: "Pushya" },
      { name: "Venus", sign: "Pisces", degree: 27.0, dignity: "exalted", nakshatra: "Revati" },
      { name: "Saturn", sign: "Libra", degree: 20.0, dignity: "exalted", nakshatra: "Swati" },
      { name: "Rahu", sign: "Gemini", degree: 15.0, dignity: "neutral", nakshatra: "Ardra" },
      { name: "Ketu", sign: "Sagittarius", degree: 15.0, dignity: "neutral", nakshatra: "Mula" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Example chart with all planets in exaltation (rare idealized case).",
      },
    },
  },
};

export const MixedDignities: Story = {
  args: {
    grahas: [
      { name: "Sun", sign: "Leo", degree: 15.0, dignity: "own", nakshatra: "Purva Phalguni" },
      { name: "Moon", sign: "Scorpio", degree: 3.0, dignity: "debilitated", nakshatra: "Vishakha" },
      { name: "Mars", sign: "Aries", degree: 22.0, dignity: "own", nakshatra: "Bharani" },
      { name: "Mercury", sign: "Pisces", degree: 15.0, dignity: "debilitated", nakshatra: "Uttara Bhadrapada" },
      { name: "Jupiter", sign: "Sagittarius", degree: 10.0, dignity: "own", nakshatra: "Mula" },
      { name: "Venus", sign: "Virgo", degree: 27.0, dignity: "debilitated", nakshatra: "Chitra" },
      { name: "Saturn", sign: "Aquarius", degree: 5.0, dignity: "own", nakshatra: "Dhanishta" },
      { name: "Rahu", sign: "Taurus", degree: 20.0, dignity: "neutral", nakshatra: "Rohini" },
      { name: "Ketu", sign: "Scorpio", degree: 20.0, dignity: "neutral", nakshatra: "Jyeshtha" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Realistic chart with mixed dignities - own signs, debilitations, and neutral placements.",
      },
    },
  },
};

export const WithRetrogrades: Story = {
  args: {
    grahas: [
      { name: "Sun", sign: "Capricorn", degree: 5.0, dignity: "neutral", nakshatra: "Uttara Ashadha" },
      { name: "Moon", sign: "Cancer", degree: 15.0, dignity: "own", nakshatra: "Pushya" },
      { name: "Mars", sign: "Gemini", degree: 10.0, dignity: "neutral", nakshatra: "Ardra", retrograde: true },
      { name: "Mercury", sign: "Sagittarius", degree: 25.0, dignity: "neutral", nakshatra: "Purva Ashadha", retrograde: true },
      { name: "Jupiter", sign: "Aries", degree: 8.0, dignity: "neutral", nakshatra: "Ashwini", retrograde: true },
      { name: "Venus", sign: "Aquarius", degree: 12.0, dignity: "neutral", nakshatra: "Shatabhisha" },
      { name: "Saturn", sign: "Pisces", degree: 18.0, dignity: "neutral", nakshatra: "Uttara Bhadrapada", retrograde: true },
      { name: "Rahu", sign: "Pisces", degree: 5.0, dignity: "neutral", nakshatra: "Uttara Bhadrapada", retrograde: true },
      { name: "Ketu", sign: "Virgo", degree: 5.0, dignity: "neutral", nakshatra: "Uttara Phalguni", retrograde: true },
    ],
    showRetrograde: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Chart with multiple retrograde planets indicated.",
      },
    },
  },
};

export const Compact: Story = {
  args: {
    grahas: [
      { name: "Sun", sign: "Leo", degree: 15.0, dignity: "own" },
      { name: "Moon", sign: "Taurus", degree: 18.0, dignity: "exalted" },
      { name: "Mars", sign: "Cancer", degree: 28.0, dignity: "debilitated" },
    ],
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Compact view showing only essential information.",
      },
    },
  },
};

export const ExpandedWithDetails: Story = {
  args: {
    grahas: [
      { name: "Sun", sign: "Aries", degree: 10.0, dignity: "exalted", nakshatra: "Ashwini", pada: 3, house: 1 },
      { name: "Moon", sign: "Taurus", degree: 18.5, dignity: "exalted", nakshatra: "Rohini", pada: 3, house: 2 },
      { name: "Mars", sign: "Scorpio", degree: 5.0, dignity: "own", nakshatra: "Anuradha", pada: 1, house: 8 },
      { name: "Mercury", sign: "Gemini", degree: 22.0, dignity: "own", nakshatra: "Punarvasu", pada: 2, house: 3 },
      { name: "Jupiter", sign: "Cancer", degree: 5.0, dignity: "exalted", nakshatra: "Pushya", pada: 2, house: 4 },
      { name: "Venus", sign: "Taurus", degree: 28.0, dignity: "own", nakshatra: "Mrigashira", pada: 1, house: 2 },
      { name: "Saturn", sign: "Libra", degree: 20.0, dignity: "exalted", nakshatra: "Swati", pada: 3, house: 7 },
      { name: "Rahu", sign: "Virgo", degree: 15.0, dignity: "neutral", nakshatra: "Hasta", pada: 2, house: 6 },
      { name: "Ketu", sign: "Pisces", degree: 15.0, dignity: "neutral", nakshatra: "Uttara Bhadrapada", pada: 4, house: 12 },
    ],
    showNakshatra: true,
    showPada: true,
    showHouse: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Fully expanded view with Nakshatra, Pada, and House information.",
      },
    },
  },
};
