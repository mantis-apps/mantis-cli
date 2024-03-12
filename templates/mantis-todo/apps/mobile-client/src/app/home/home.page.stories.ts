import {
  moduleMetadata,
  type Meta,
  type StoryObj,
  applicationConfig,
  componentWrapperDecorator,
} from '@storybook/angular';
import { HomePage } from './home.page';
import { defaultTodoHandlers } from 'stories/todos.msw';
import { IonicModule } from '@ionic/angular';
import { TodosService } from 'app/services/todos.service';
import { provideHttpClient } from '@angular/common/http';
import { TodoItemComponent } from 'app/components/todo-item/todo-item.component';
import { importProvidersFrom } from '@angular/core';

const meta: Meta<HomePage> = {
  component: HomePage,
  title: 'HomePage',
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        importProvidersFrom(IonicModule.forRoot()),
      ],
    }),
    moduleMetadata({
      imports: [TodoItemComponent],
      providers: [TodosService],
    }),
    componentWrapperDecorator((story) => `<ion-app>${story}</ion-app>`),
  ],
  parameters: {},
};
export default meta;
type Story = StoryObj<HomePage>;

export const Primary: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [...defaultTodoHandlers],
    },
  },
};
