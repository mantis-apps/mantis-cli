import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './schemas/todo.schema';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return await this.todoModel.create(createTodoDto);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todoModel.findByIdAndUpdate({ _id: id }, updateTodoDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<string> {
    await this.todoModel.findByIdAndDelete({ _id: id }).exec();
    return id;
  }
}
