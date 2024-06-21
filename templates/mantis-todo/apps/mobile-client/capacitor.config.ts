import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.mantis.todo',
  appName: 'mobile-client',
  webDir: '../../dist/apps/mobile-client/analog/public',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
