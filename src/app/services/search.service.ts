import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchQuery = signal('');

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  getSearchQuery() {
    return this.searchQuery;
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
