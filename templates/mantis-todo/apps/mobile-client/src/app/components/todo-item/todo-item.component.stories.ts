import type { Meta, StoryObj } from '@storybook/angular';
import { TodoItemComponent } from './todo-item.component';

const meta: Meta<TodoItemComponent> = {
  component: TodoItemComponent,
  title: 'TodoItemComponent',
  argTypes: {
    remove: { action: 'removed' },
    completed: { action: 'completed' },
    beginEdit: { action: 'editing begun' },
  },
};
export default meta;
type Story = StoryObj<TodoItemComponent>;

export const Uncompleted: Story = {
  args: {
    todo: {
      _id: '1',
      title: 'Learn Mantis',
      completed: false,
    },
  },
};

export const Completed: Story = {
  args: {
    todo: {
      _id: '1',
      title: 'Learn Mantis',
      completed: true,
    },
  },
};
