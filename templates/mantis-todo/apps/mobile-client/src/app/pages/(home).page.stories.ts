import {
  moduleMetadata,
  type Meta,
  type StoryObj,
  argsToTemplate,
} from '@storybook/angular';
import HomePageComponent from './(home).page';
import { defaultTodoHandlers } from '../stories/todos.msw';
import { HttpClientModule } from '@angular/common/http';
import { TodosService } from '../services/todos.service';

const meta: Meta<HomePageComponent> = {
  component: HomePageComponent,
  title: 'HomeComponent',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [TodosService],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<app-home-page class="ion-page" ${argsToTemplate(args)}></app-home-page>`,
  }),
};
export default meta;
type Story = StoryObj<HomePageComponent>;

export const Primary: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [...defaultTodoHandlers],
    },
  },
};
