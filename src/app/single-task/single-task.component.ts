import { Component, Input, OnInit } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';
import {ThemePalette} from '@angular/material/core';
import { TaskService } from 'src/app/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface CheckBox {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: CheckBox[];
}

@Component({
  selector: 'app-single-task',
  templateUrl: './single-task.component.html',
  styleUrls: ['./single-task.component.scss']
})

export class SingleTaskComponent implements OnInit {

  checkbox: CheckBox = {
    name: 'checkboxTask',
    completed: false,
    color: 'primary',
  };

  constructor(
    private taskService: TaskService,
    private router: ActivatedRoute,
    private route: Router,
    private formBuilder: FormBuilder,
  ) {}

  task!: TaskModel;
  buttonText!: string;
  buttonEditTask! : boolean;
  buttonDelete!: boolean;
  taskForm!: FormGroup;
  regexField!: RegExp;
  taskId!: string;
  refresh$!: Observable<boolean>;

  ngOnInit(): void {

    this.buttonEditTask = false;

    this.taskId = this.router.snapshot.params['id'];
    
    this.regexField = /^http.*:\/\/.*\..*$/is;

    this.buttonDelete = this.checkbox.completed ? true : false;
    
    this.taskForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      date: [null, [Validators.required]],
      url: [null, [Validators.pattern(this.regexField)]],
    },
    {
      updateOn: 'blur'
    })
    
    this.buttonText = "Non complété";
    
    this.loadTasks()
    
}



loadTasks(): void {
  this.taskService.getTaskById(this.taskId).subscribe(
    task => {
      if (task) {
        this.task = task;
        this.checkbox.completed = this.task.isDone
        console.log('Fetched Task:', task); // Vérification de la tâche sélectionnée
      
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          date: task.date,
          url: task.url,
          isDone: task.isDone,
        });
      } else {
        console.log('Oups, il y a un soucis avec la tâche sélectionnée');
      }
    },
    error => {
      console.error(error);
    }
    );
}

  onCheckboxChange(): void {
    this.task.isDone = this.checkbox.completed;
    this.buttonText = this.task.isDone ? "Terminé" : "Non complété";

    this.taskService.checkedTask(this.task._id, this.task).subscribe(
      updatedTask => {
        console.log(updatedTask);
        if (!this.buttonDelete) {
          this.buttonDelete = true; 
        } else {
          this.buttonDelete = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onTasksList() {
    this.route.navigateByUrl('/tasks');
  }

  openEditTask(): void {
    this.buttonEditTask = true;
  }
  
  closeEditTask(): void { 
    this.buttonEditTask = false;
  }

  onEditTask(): void {
    const editedTask = {
      _id: this.task._id,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      url: this.taskForm.value.url,
      date: new Date(this.taskForm.value.date),
      isDone: false
    };
  
    this.taskService.updateTask(this.taskId, editedTask).subscribe(() => {
      this.buttonEditTask = false;
      this.loadTasks()
    });
  }

  onDeleteTask(): void {
    this.taskService.deleteTask(this.taskId).subscribe(
      task => {
        console.log('Tâche supprimée ! ', task);
        this.route.navigateByUrl('/tasks')
      },
      error => {
        throw new Error(`Oups, la tâche ne s'est pas supprimée correctement :` , error)
      }
    )
  }
}
