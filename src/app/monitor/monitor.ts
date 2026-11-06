import { Component, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Subscription, interval } from 'rxjs';

export interface MonitorEvent {
  id: number;
  value: number;
  time: string;
}

@Component({
  selector: 'app-monitor',
  imports: [AsyncPipe],
  templateUrl: './monitor.html',
  styleUrl: './monitor.css',
})
export class Monitor implements OnDestroy {
  private counterSubject = new BehaviorSubject<number>(0);
  private runningSubject = new BehaviorSubject<boolean>(false);
  private eventsSubject = new BehaviorSubject<MonitorEvent[]>([]);

  counter$ = this.counterSubject.asObservable();
  isRunning$ = this.runningSubject.asObservable();
  events$ = this.eventsSubject.asObservable();

  private subscription: Subscription | null = null;
  private eventId = 0;
  private readonly MAX_EVENTS = 10;

  start(): void {
    if (this.subscription) return;

    this.runningSubject.next(true);

    this.subscription = interval(1000).subscribe(() => {
      const newValue = this.counterSubject.value + 1;
      this.counterSubject.next(newValue);

      const event: MonitorEvent = {
        id: ++this.eventId,
        value: newValue,
        time: new Date().toLocaleTimeString(),
      };

      const updated = [event, ...this.eventsSubject.value].slice(0, this.MAX_EVENTS);
      this.eventsSubject.next(updated);
    });
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.runningSubject.next(false);
  }

  reset(): void {
    this.stop();
    this.counterSubject.next(0);
    this.eventsSubject.next([]);
    this.eventId = 0;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}