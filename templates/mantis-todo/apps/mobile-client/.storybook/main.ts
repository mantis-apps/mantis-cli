import type { StorybookConfig } from '@storybook/angular';
import CopyPlugin from 'copy-webpack-plugin';

const config: StorybookConfig = {
  stories: ['../src/app/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  staticDirs: ['../src/public'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: (config) => {
    config.plugins?.push(
      new CopyPlugin({
        patterns: [
          { from: './node_modules/ionicons/dist/ionicons/svg', to: './svg/' },
        ],
      }),
    );
    return config;
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
