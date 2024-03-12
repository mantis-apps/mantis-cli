import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import HomeComponent from './(home).page';
import { defaultTodoHandlers } from '../stories/todos.msw';
import { HttpClientModule } from '@angular/common/http';
import { TodosService } from '../services/todos.service';

const meta: Meta<HomeComponent> = {
  component: HomeComponent,
  title: 'HomeComponent',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [TodosService],
    }),
  ],
};
export default meta;
type Story = StoryObj<HomeComponent>;

export const Primary: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [...defaultTodoHandlers],
    },
  },
};
