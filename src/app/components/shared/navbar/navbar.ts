import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../services/search.service';
import { ArenaProgressService } from '../../../services/arena-progress.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private searchService = inject(SearchService);
  private progressService = inject(ArenaProgressService);

  searchQuery = this.searchService.searchQuery;

  segment3Count = this.progressService.segment3Count;

  onSearch() {
    this.searchService.setSearchQuery(this.searchQuery());
  }

  onClearSearch() {
    this.searchService.clearSearch();
  }
}
