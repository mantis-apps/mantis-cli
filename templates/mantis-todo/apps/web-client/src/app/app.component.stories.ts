import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AppComponent } from './app.component';
import { defaultTodoHandlers } from 'stories/todos.msw';
import { HttpClientModule } from '@angular/common/http';
import { TodosService } from './services/todos.service';

const meta: Meta<AppComponent> = {
  component: AppComponent,
  title: 'AppComponent',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [TodosService],
    }),
  ],
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Primary: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [...defaultTodoHandlers],
    },
  },
};
