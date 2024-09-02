import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = '3813ICT-Assessment';

  ngOnInit(): void {
    this.clearLocalStorage();
  }

  private clearLocalStorage(): void {
    localStorage.clear(); // Clear all items in local storage
  }
}
