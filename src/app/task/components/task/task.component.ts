import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import {ThemePalette} from '@angular/material/core';
import { TaskService } from 'src/app/services/tasks.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { TaskRefreshService } from 'src/app/services/task-refresh.service';


export interface CheckBox {
  name: string;
  completed: boolean;
  color: ThemePalette;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {

  constructor(private taskService: TaskService,
              private route: Router,
              private refreshService: TaskRefreshService) {}

  @Input()
  task!: TaskModel;
  buttonDelete!: boolean;
  mobile!: boolean;

  checkbox: CheckBox = {
    name: 'checkboxTask',
    completed: false,
    color: 'primary',
  };

  ngOnInit(): void {

    this.checkbox.completed = this.task.isDone;
    this.checkbox.color = this.task.isDone? 'primary' : 'warn';
    this.buttonDelete = false;

    if (window.screen.width <= 768) {
      this.mobile = true;
    }
    
  }

  loadTasks(): void {
    this.taskService.getAllTasks();
  }

  @Output() taskIsDone = new EventEmitter<string>();

  onCheckboxChange(): void {
    this.task.isDone = this.checkbox.completed;
    
    this.taskService.checkedTask(this.task._id, this.task).subscribe(
      updatedTask => {
        console.log('Updated Task :', this.task);
        this.taskIsDone.emit(this.task._id);
      },
      error => {
        console.log(error);
      }
    )
  }

  
  @Output() taskDeleted = new EventEmitter<string>();
  
  onDeleteTask() {
    if (this.task.isDone) {
      this.buttonDelete = true;
      this.taskService.deleteTask(this.task._id).subscribe(
        () => {
          console.log('Task deleted successfully');
          this.taskDeleted.emit(this.task._id);
        },
        error => {
          this.buttonDelete = false;
          console.log('Error deleting task:', error);
        }
      );
    }
  }
    
    onSingleTask() {
      this.route.navigate(['/tasks', this.task._id]);
    }
    
  }
  