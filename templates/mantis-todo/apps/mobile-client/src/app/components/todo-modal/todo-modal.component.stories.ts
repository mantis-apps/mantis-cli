import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TodoModalComponent } from './todo-modal.component';
import { action } from '@storybook/addon-actions';

const meta: Meta<TodoModalComponent> = {
  component: TodoModalComponent,
  title: 'TodoModalComponent',
  render: (args) => ({
    props: {
      ...args,
      modalCtrl: {
        dismiss: action('dismiss'),
      },
    },
    template: `<app-todo-modal class="ion-page" ${argsToTemplate(args)}></app-todo-modal>`,
  }),
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
