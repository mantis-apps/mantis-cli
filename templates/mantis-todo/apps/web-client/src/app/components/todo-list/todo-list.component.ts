import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TodosService, Todo, CreateTodo } from '../../services/todos.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
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

  constructor(
    private todosService: TodosService,
    private cdf: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todosService.getAllTodos().subscribe((todos) => {
      this.todos$.next(todos);
      this.cdf.detectChanges();
    });
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
