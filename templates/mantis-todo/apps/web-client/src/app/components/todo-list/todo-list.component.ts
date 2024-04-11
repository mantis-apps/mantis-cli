import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { TodosService, Todo, CreateTodo } from '../../services/todos.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoItemComponent, AddTodoComponent, CommonModule],
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  @HostBinding('class') class = 'w-full';
  private todosService = inject(TodosService);
  readonly todos$ = this.todosService.todos$;

  removeTodo(todo: Todo) {
    this.todosService.removeTodo(todo);
  }

  updateTodo(todo: Todo) {
    this.todosService.updateTodo(todo);
  }

  addTodo(todo: CreateTodo) {
    this.todosService.addTodo(todo);
  }
}
