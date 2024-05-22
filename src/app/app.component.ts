import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScaleComponent } from './scale/scale.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScaleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weight-anomaly-detection';
}
