import { Component, inject } from '@angular/core';
import { IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { Todo, TodosService } from 'app/services/todos.service';
import { firstValueFrom } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { TodoModalComponent } from '../components/todo-modal/todo-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private todosService = inject(TodosService);
  private modalCtrl = inject(ModalController);
  readonly todos$ = this.todosService.todos$;

  removeTodo(todo: Todo): void {
    this.todosService.removeTodo(todo);
  }

  updateTodo(todo: Todo): void {
    this.todosService.updateTodo(todo);
  }

  addTodo(todo: Todo) {
    this.todosService.addTodo(todo);
  }

  async openAddTodoModal() {
    const modal = await this.modalCtrl.create({
      component: TodoModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.addTodo(data);
    }
  }

  async openEditTodoModal(todo: Todo) {
    const modal = await this.modalCtrl.create({
      component: TodoModalComponent,
      componentProps: {
        todo,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.updateTodo(data);
    }
  }

  private refreshing = false;

  async refresh(ev: IonRefresherCustomEvent<RefresherEventDetail>) {
    if (this.refreshing) return;
    this.refreshing = true;
    this.todosService.refreshTodos();

    await Promise.all([firstValueFrom(this.todos$), delay(200)]);

    ev.detail.complete();

    this.refreshing = false;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
