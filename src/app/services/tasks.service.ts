import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { TaskModel } from '../models/task.model';
import { TaskRefreshService } from './task-refresh.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient,
              private refreshService: TaskRefreshService) {}

  getAllTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>('https://that-todolist-backend.vercel.app/tasks').pipe(
      catchError(error => {
        throw new Error(error.message);
      })
    );
  }

  getTaskById(taskId: string): Observable<TaskModel> {
    const url = `https://that-todolist-backend.vercel.app/tasks/${taskId}`;
    return this.http.get<TaskModel>(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  updateTask(taskId: string, formValue: { title: string, description: string, date: Date, url?: string }): Observable<TaskModel> {
    const url = `https://that-todolist-backend.vercel.app/tasks/${taskId}`;
    return this.http.put<TaskModel>(url, formValue).pipe(
      tap(() => {
        console.log('Tâche modifiée :', formValue);
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  checkedTask(taskId: string, task: TaskModel): Observable<TaskModel> {
    const url = `https://that-todolist-backend.vercel.app/tasks/${taskId}`;
        console.log('Requesting url: ', url);
        return this.http.put<TaskModel>(url, task);
  }

  addNewTask(formValue: { title: string, description: string, date: Date, url?: string }): Observable<TaskModel> {
    const task = {
      ...formValue,
      isDone: false
    };

    return this.http.post<TaskModel>('https://that-todolist-backend.vercel.app/tasks', task).pipe(
      tap(() => {
        console.log('Tâche envoyée', task);
      }),
      catchError(error => {
        console.log(error);
        throw new Error('Add task error', error);
      })
    );
  }

  deleteTask(taskId: string): Observable<TaskModel> {
    const url = `https://that-todolist-backend.vercel.app/tasks/${taskId}`;
    return this.http.delete<TaskModel>(url).pipe(
      tap(() => {
        console.log('Tâche supprimée', url);
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}