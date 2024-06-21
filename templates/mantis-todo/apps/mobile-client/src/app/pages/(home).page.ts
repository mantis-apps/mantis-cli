import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import type {
  IonRefresherCustomEvent,
  RefresherEventDetail,
} from '@ionic/core/components';
import { Todo, TodosService } from '../../app/services/todos.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { TodoModalComponent } from '../components/todo-modal/todo-modal.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItemComponent } from '../components/todo-item/todo-item.component';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({ add });

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TodoItemComponent],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Todos </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="no-scrollbar">
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Todos</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list class="min-h-full">
        @for (todo of todos$ | async; track todo._id) {
          <app-todo-item
            [todo]="todo"
            (remove)="removeTodo($event)"
            (completed)="updateTodo($event)"
            (beginEdit)="openEditTodoModal($event)"
          />
        }
        <p class="flex flex-col pb-16 pt-3 text-center">
          @if ((todos$ | async)?.length) {
            <ion-note>Swipe an item for more options</ion-note>
          }
          <ion-note>Pull down to refresh</ion-note>
        </p>
      </ion-list>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button (click)="openAddTodoModal()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export default class HomePageComponent implements OnInit {
  todos$ = new BehaviorSubject<Todo[]>([]);

  constructor(
    private todosService: TodosService,
    private modalCtrl: ModalController,
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
