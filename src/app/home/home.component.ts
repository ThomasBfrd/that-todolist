import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../services/tasks.service';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  tasks$!: Observable<TaskModel[]>
  completedTasks!: number;
  currentUser!: User | null;
  currentUsername: string | null = null;

  constructor(private router: Router,
              private taskServices: TaskService,
              private authService: AuthService) {}

ngOnInit(): void {
  this.tasks$ = this.taskServices.getAllTasks();
  
  this.authService.currentUser$.subscribe(user => {
    this.currentUser = user;
  })
  this.tasks$.subscribe(tasks => {
    this.completedTasks = tasks.filter(task => task.isDone).length;
    this.completedTasks !== null ? this.completedTasks : 0
  })

  this.currentUsername = localStorage.getItem('username')
}

onListTasks() {
  this.router.navigateByUrl('tasks')
}


}