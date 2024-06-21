import {
  Preview,
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { ConfigService } from '../src/app/services/config.service';
import projectConfig from '../project.json';
import { Injectable, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

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
    applicationConfig({
      providers: [
        provideHttpClient(),
        importProvidersFrom(IonicModule.forRoot()),
      ],
    }),
    componentWrapperDecorator((story) => `<ion-app>${story}</ion-app>`),
  ],
};

export default preview;
