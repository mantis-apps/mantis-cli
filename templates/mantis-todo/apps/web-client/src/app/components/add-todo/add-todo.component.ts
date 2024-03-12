import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateTodo } from '../../services/todos.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-todo.component.html',
})
export class AddTodoComponent {
  @Output() add = new EventEmitter<CreateTodo>();

  title = '';

  addTodo() {
    if (this.title) {
      this.add.emit({
        title: this.title,
        completed: false,
      });

      // Reset title to clear input field.
      this.title = '';
    }
  }
}
