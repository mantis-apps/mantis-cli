import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodosService, Todo, CreateTodo } from 'app/services/todos.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [TodoItemComponent, AddTodoComponent, CommonModule],
  templateUrl: './todo-list.component.html',
  styles: `
    :host {
      width: 100%;
    }
  `,
})
export class TodoListComponent implements OnInit {
  todos$ = new BehaviorSubject<Todo[]>([]);

  constructor(private todosService: TodosService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todosService
      .getAllTodos()
      .subscribe((todos) => this.todos$.next(todos));
  }

  removeTodo(todo: Todo): void {
    this.todosService.removeTodo(todo).subscribe(() => this.loadTodos());
  }

  updateTodo(todo: Todo): void {
    this.todosService.updateTodo(todo).subscribe(() => this.loadTodos());
  }

  addTodo(todo: CreateTodo): void {
    this.todosService.addTodo(todo).subscribe(() => this.loadTodos());
  }
}
