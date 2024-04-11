import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, retry } from 'rxjs';
import { ConfigService } from './config.service';

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export type CreateTodo = Omit<Todo, '_id'>;

@Injectable({ providedIn: 'root' })
export class TodosService {
  private _todos = signal<Todo[]>([]);
  readonly todos$ = toObservable(this._todos.asReadonly());

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {
    this.getAllTodos();
  }

  addTodo(todo: CreateTodo) {
    this.http
      .post<Todo>(`${this.config.getBackendBaseUrl()}/todos`, todo)
      .subscribe(() => this.getAllTodos());
  }

  updateTodo(todo: Todo) {
    this.http
      .patch<Todo>(`${this.config.getBackendBaseUrl()}/todos/${todo._id}`, todo)
      .subscribe(() => this.getAllTodos());
  }

  removeTodo(todo: Todo) {
    this.http
      .delete<void>(`${this.config.getBackendBaseUrl()}/todos/${todo._id}`)
      .subscribe(() => this.getAllTodos());
  }

  private getAllTodos() {
    this.http
      .get<Todo[]>(`${this.config.getBackendBaseUrl()}/todos`)
      .pipe(
        retry(3),
        catchError(() => of([])),
      )
      .subscribe((todos) => this._todos.set(todos));
  }
}
