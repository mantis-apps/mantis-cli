import { Component } from '@angular/core';
import { TodoListComponent } from '../components/todo-list/todo-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [TodoListComponent],
  template: `
    <main class="flex min-h-screen bg-gray-100 p-5 text-gray-600">
      <app-todo-list />
    </main>
  `,
})
export default class HomeComponent {}
