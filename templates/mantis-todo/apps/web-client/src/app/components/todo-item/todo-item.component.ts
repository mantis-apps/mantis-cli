import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../services/todos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements AfterViewChecked {
  @Input({ required: true }) todo!: Todo;
  @Output() remove = new EventEmitter<Todo>();
  @Output() update = new EventEmitter<Todo>();
  @ViewChild('todoInputRef') inputRef?: ElementRef;

  title = '';
  isEditing = false;

  toggleTodo(): void {
    this.update.emit({
      ...this.todo,
      completed: !this.todo.completed,
    });
  }

  removeTodo(): void {
    this.remove.emit(this.todo);
  }

  startEdit() {
    this.isEditing = true;
  }

  handleBlur() {
    this.isEditing = false;
    this.updateTodo();
  }

  handleFocus() {
    setTimeout(() => (this.title = this.todo.title));
  }

  updateTodo() {
    if (!this.title) {
      this.remove.emit(this.todo);
    } else {
      this.update.emit({
        ...this.todo,
        title: this.title,
      });
    }

    this.isEditing = false;
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      this.inputRef?.nativeElement.focus();
    }
  }
}
