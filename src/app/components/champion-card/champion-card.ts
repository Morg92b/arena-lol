import { Component, Input, inject, OnInit } from '@angular/core';
import { ArenaProgressService } from '../../services/arena-progress.service';
import { Champion } from '../../models/champion.model';
import { signal } from '@angular/core';

@Component({
  selector: 'app-champion-card',
  imports: [],
  templateUrl: './champion-card.html',
  styleUrl: './champion-card.scss',
})
export class ChampionCard implements OnInit {
  @Input({ required: true })
  champion!: Champion;

  private progressService = inject(ArenaProgressService);
  progress = signal(0);

  ngOnInit() {
    this.updateProgress();
  }

  private updateProgress() {
    this.progress.set(this.progressService.getProgress(this.champion.id));
  }

  setProgress(value: number) {
    this.progressService.setProgress(this.champion.id, value);
    this.updateProgress();
  }
}
