import { Component } from '@angular/core';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  standalone: true,
  imports: [TodoListComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {}
