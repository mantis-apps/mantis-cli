import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from 'app/services/todos.service';
import { CommonModule } from '@angular/common';
import { IonicModule, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() remove = new EventEmitter<Todo>();
  @Output() completed = new EventEmitter<Todo>();
  @Output() beginEdit = new EventEmitter<Todo>();
  @ViewChild('slider') slider?: IonItemSliding;

  toggleTodo(): void {
    this.completed.emit({
      ...this.todo,
      completed: !this.todo.completed,
    });
  }

  removeTodo(): void {
    this.remove.emit(this.todo);
    this.slider?.close();
  }

  editTodo() {
    this.beginEdit.emit(this.todo);
    this.slider?.close();
  }
}
