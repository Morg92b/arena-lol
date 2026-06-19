import { Component, inject, computed } from '@angular/core';
import { ChampionService } from '../../services/champion.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChampionCard } from '../champion-card/champion-card';
import { CommonModule } from '@angular/common';
import { Champion } from '../../models/champion.model';
import { SearchService } from '../../services/search.service';
import { ArenaProgressService } from '../../services/arena-progress.service';

@Component({
  selector: 'app-champion-list',
  imports: [ChampionCard, CommonModule],
  templateUrl: './champion-list.html',
  styleUrl: './champion-list.scss',
})
export class ChampionList {
  private championService = inject(ChampionService);
  private searchService = inject(SearchService);
  private progressService = inject(ArenaProgressService);

  championsResponse = toSignal(this.championService.getCachedChampions());

  allChampions = computed((): Champion[] => {
    const data = this.championsResponse()?.data;
    if (!data) return [];
    return Object.values(data).sort((a: any, b: any) => a.name.localeCompare(b.name)) as Champion[];
  });

  champions = computed((): Champion[] => {
    this.progressService.updateTick();

    const query = this.searchService.searchQuery().toLowerCase();
    let list = this.allChampions();

    if (query) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query),
      );
    }

    return [...list].sort((a, b) => {
      const pa = this.progressService.getProgress(a.id);
      const pb = this.progressService.getProgress(b.id);
      return pb - pa;
    });
  });

  isLoading = () => !this.championsResponse();
}
