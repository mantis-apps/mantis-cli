import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, retry } from 'rxjs';
import { ConfigService } from './config.service';

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export type CreateTodo = Omit<Todo, '_id'>;

@Injectable({ providedIn: 'root' })
export class TodosService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  getAllTodos(): Observable<Todo[]> {
    return this.http
      .get<Todo[]>(`${this.config.getBackendBaseUrl()}/todos`)
      .pipe(
        retry(3),
        catchError(() => of([])),
      );
  }

  addTodo(todo: CreateTodo): Observable<Todo> {
    return this.http.post<Todo>(
      `${this.config.getBackendBaseUrl()}/todos`,
      todo,
    );
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.patch<Todo>(
      `${this.config.getBackendBaseUrl()}/todos/${todo._id}`,
      todo,
    );
  }

  removeTodo(todo: Todo): Observable<void> {
    return this.http.delete<void>(
      `${this.config.getBackendBaseUrl()}/todos/${todo._id}`,
    );
  }
}
