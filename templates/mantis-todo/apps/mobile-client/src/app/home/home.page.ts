import { Component, OnInit } from '@angular/core';
import { IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { Todo, TodosService } from 'app/services/todos.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { TodoModalComponent } from '../components/todo-modal/todo-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  todos$ = new BehaviorSubject<Todo[]>([]);

  constructor(
    private todosService: TodosService,
    private modalCtrl: ModalController,
  ) {}

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

  addTodo(todo: Todo): void {
    this.todosService.addTodo(todo).subscribe(() => this.loadTodos());
  }

  private refreshing = false;

  async refresh(ev: IonRefresherCustomEvent<RefresherEventDetail>) {
    if (this.refreshing) return;
    this.refreshing = true;

    const todosPromise = firstValueFrom(this.todosService.getAllTodos());

    const [todos] = await Promise.all([todosPromise, delay(200)]);
    ev.detail.complete();

    this.todos$.next(todos);
    this.refreshing = false;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
