import type { Meta, StoryObj } from '@storybook/angular';
import { TodoModalComponent } from './todo-modal.component';

const meta: Meta<TodoModalComponent> = {
  component: TodoModalComponent,
  title: 'TodoModalComponent',
};
export default meta;
type Story = StoryObj<TodoModalComponent>;

export const Add: Story = {
  args: {},
};

export const Edit: Story = {
  args: {
    todo: {
      _id: '1',
      title: 'Learn Mantis',
      completed: false,
    },
  },
};
