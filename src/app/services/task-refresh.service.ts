import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn : 'root',
})

export class TaskRefreshService {

    refreshSubject = new Subject<void>();
    refreshSignal = new BehaviorSubject<boolean>(false);

    refresh() {
        console.log('Refresh method called');
        this.refreshSubject.next();
      }

    getRefreshSignal(): Observable<boolean> {
        return this.refreshSignal.asObservable();
    }
}