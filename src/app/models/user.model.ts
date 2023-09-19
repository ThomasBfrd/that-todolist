import { TaskModel } from "./task.model"

export class User {
    id!: number;
    username!: string;
    email!: string;
    password!: string;
    token!: string;
    tasks!: TaskModel[];
}