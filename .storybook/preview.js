import '../src/index.css'; // loads Tailwind

/** @type { import('@storybook/react').Preview } */
export default {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'slate', value: '#1e293b' },
        { name: 'light', value: '#f8fafc' },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};
