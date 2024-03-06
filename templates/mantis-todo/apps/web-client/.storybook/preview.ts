import { Preview, moduleMetadata } from '@storybook/angular';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { ConfigService } from '../src/app/services/config.service';
import projectConfig from '../project.json';
import { Injectable } from '@angular/core';

initialize();

@Injectable()
class StorybookConfigService extends ConfigService {
  override getBackendBaseUrl() {
    const port = Number(projectConfig?.targets?.storybook?.options?.port);
    if (typeof port === 'number' && !isNaN(port)) {
      return `http://localhost:${port}`;
    } else {
      throw new Error(
        'The storybook target in project.json must have a valid port number.',
      );
    }
  }
}

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: ConfigService,
          useClass: StorybookConfigService,
        },
      ],
    }),
  ],
};

export default preview;
