import type { Meta, StoryObj } from '@storybook/angular';
import { AddTodoComponent } from './add-todo.component';

const meta: Meta<AddTodoComponent> = {
  component: AddTodoComponent,
  title: 'AddTodoComponent',
  parameters: {
    layout: 'centered',
  },
  argTypes: { add: { action: 'added' } },
};
export default meta;
type Story = StoryObj<AddTodoComponent>;

export const Primary: Story = {
  args: {},
};
