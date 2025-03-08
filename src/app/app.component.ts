import { Component } from '@angular/core';
import { SolarSystemComponent } from "./solar-system/solar-system.component";

@Component({
  selector: 'app-root',
  imports: [SolarSystemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularSolarSystem';
}
