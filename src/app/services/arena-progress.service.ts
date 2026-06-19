import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArenaProgressService {
  readonly updateTick = signal(0);

  getProgress(championId: string): number {
    return Number(localStorage.getItem(championId) ?? 0);
  }

  setProgress(championId: string, progress: number): void {
    localStorage.setItem(championId, progress.toString());
    this.updateTick.update((t) => t + 1);
  }
  segment3Count = computed(() => {
    this.updateTick(); // déclenche recalcul

    let count = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = Number(localStorage.getItem(key));
      if (value === 3) count++;
    }

    return count;
  });
}
