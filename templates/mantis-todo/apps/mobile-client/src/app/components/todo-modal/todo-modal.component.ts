import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CreateTodo, Todo } from '../../services/todos.service';

@Component({
  selector: 'app-todo-modal',
  standalone: true,
  imports: [IonicModule, FormsModule],
  templateUrl: './todo-modal.component.html',
})
export class TodoModalComponent implements OnInit {
  @Input() todo?: Todo;
  title = '';

  get isEditing(): boolean {
    return !!this.todo;
  }

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.title = this.todo?.title ?? '';
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(
      {
        ...this.todo,
        title: this.title,
        completed: this.todo?.completed ?? false,
      } satisfies CreateTodo,
      'confirm',
    );
  }
}
