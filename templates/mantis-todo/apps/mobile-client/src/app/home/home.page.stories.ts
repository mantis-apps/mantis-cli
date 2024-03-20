import {
  moduleMetadata,
  type Meta,
  type StoryObj,
  argsToTemplate,
} from '@storybook/angular';
import { HomePage } from './home.page';
import { defaultTodoHandlers } from 'stories/todos.msw';
import { TodosService } from 'app/services/todos.service';
import { TodoItemComponent } from 'app/components/todo-item/todo-item.component';

const meta: Meta<HomePage> = {
  component: HomePage,
  title: 'HomePage',
  decorators: [
    moduleMetadata({
      imports: [TodoItemComponent],
      providers: [TodosService],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<app-home class="ion-page" ${argsToTemplate(args)}></app-home>`,
  }),
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
