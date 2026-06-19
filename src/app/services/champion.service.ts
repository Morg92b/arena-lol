import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, shareReplay } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChampionService {

  private http = inject(HttpClient);
  private championCache$ = this.getChampions().pipe(
    shareReplay(1),
    catchError((error) => {
      console.error('Error loading champions:', error);
      return of({ data: {} });
    })
  );

  getChampions() {
    return this.http.get<any>(
      'https://ddragon.leagueoflegends.com/cdn/15.12.1/data/fr_FR/champion.json'
    );
  }

  getCachedChampions() {
    return this.championCache$;
  }
}