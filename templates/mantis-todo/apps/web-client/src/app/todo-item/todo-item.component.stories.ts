import type { Meta, StoryObj } from '@storybook/angular';
import { TodoItemComponent } from './todo-item.component';

const meta: Meta<TodoItemComponent> = {
  component: TodoItemComponent,
  title: 'TodoItemComponent',
  parameters: {
    layout: 'centered',
  },
  argTypes: { remove: { action: 'removed' }, update: { action: 'updated' } },
};
export default meta;
type Story = StoryObj<TodoItemComponent>;

export const Primary: Story = {
  args: {
    todo: {
      _id: '1',
      title: 'Tell everyone about Mantis',
      completed: false,
    },
  },
};
