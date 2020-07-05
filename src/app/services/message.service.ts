import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class MessageService {

    private login = new Subject<any>();

    sendLoginMessage(message: any) {
        this.login.next(message);
    }

    getLoginMessage(): Observable<any> {
        return this.login.asObservable();
    }
}
