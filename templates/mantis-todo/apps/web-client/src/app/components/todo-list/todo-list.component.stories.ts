import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TodoListComponent } from './todo-list.component';
import { TodosService } from '../../services/todos.service';
import { HttpClientModule } from '@angular/common/http';
import { defaultTodoHandlers } from '../../stories/todos.msw';

const meta: Meta<TodoListComponent> = {
  component: TodoListComponent,
  title: 'TodoListComponent',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [TodosService],
    }),
  ],
};
export default meta;
type Story = StoryObj<TodoListComponent>;

export const Primary: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [...defaultTodoHandlers],
    },
  },
};
