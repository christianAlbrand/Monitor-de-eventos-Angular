import { Component } from '@angular/core';
import { Monitor } from './monitor/monitor';

@Component({
  selector: 'app-root',
  imports: [Monitor],
  template: `<app-monitor />`,
})
export class App {}