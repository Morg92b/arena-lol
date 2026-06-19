import { Injectable, signal } from '@angular/core';

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
}
