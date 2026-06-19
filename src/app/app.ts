import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/shared/navbar/navbar';
import { BackgroundStar } from './components/shared/background-star/background-star';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, BackgroundStar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected searchService = inject(SearchService);
}
