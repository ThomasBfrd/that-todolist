import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/task.model';
import { TaskService } from '../services/tasks.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
  ) { }

  tasks$!: Observable<TaskModel[]>;
  buttonAddTask: boolean = false;
  taskForm!: FormGroup;
  regexField!: RegExp;

  ngOnInit(): void {

    this.regexField = /^http.*:\/\/.*\..*$/is;

    this.taskForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      date: [null, [Validators.required]],
      url: [null, [Validators.pattern(this.regexField)]],
    },
    {
      updateOn: 'blur'
    });

    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks$ = this.taskService.getAllTasks();
  }

  onNewTask(): void {
    this.buttonAddTask = true;
  }

  closeNewTask(): void {
    this.buttonAddTask = false;
  }

  onSubmit(): void {
    const newTask = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      url: this.taskForm.value.url,
      date: new Date(this.taskForm.value.date),
      isDone: false
    };

    this.taskService.addNewTask(newTask).subscribe(() => {
      this.buttonAddTask = false;
      this.loadTasks();
      this.taskForm.reset()
    });
  }

  onTaskDeleted(taskId: string) {
    console.log('Task deleted event received', taskId);
    this.loadTasks();
  }

}