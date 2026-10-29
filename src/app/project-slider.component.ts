import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import type { PortfolioProject } from './portfolio-data';
import { ProjectCardComponent } from './project-card.component';

@Component({
  selector: 'app-project-slider',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  template: `
    <div
      class="slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      (mouseenter)="paused = true"
      (mouseleave)="paused = false"
      (focusin)="paused = true"
      (focusout)="paused = false"
    >
      <div class="track" #track (scroll)="onScroll()">
        <app-project-card
          *ngFor="let project of projects; let i = index"
          class="slide"
          role="group"
          aria-roledescription="slide"
          [attr.aria-label]="i + 1 + ' of ' + projects.length"
          [project]="project"
          [projectNumber]="i + 1"
        ></app-project-card>
      </div>

      <div class="controls">
        <button type="button" class="nav" (click)="go(index - 1)" aria-label="Previous project">←</button>
        <div class="dots">
          <button
            *ngFor="let project of projects; let i = index"
            type="button"
            class="dot"
            [class.active]="i === index"
            [attr.aria-label]="'Show ' + project.name"
            [attr.aria-current]="i === index ? 'true' : null"
            (click)="go(i)"
          ></button>
        </div>
        <span class="count">
          {{ (index + 1).toString().padStart(2, '0') }} / {{ projects.length.toString().padStart(2, '0') }}
        </span>
        <button type="button" class="nav" (click)="go(index + 1)" aria-label="Next project">→</button>
      </div>
    </div>
  `,
  styles: [`
    .track {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      padding-block: 8px;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .track::-webkit-scrollbar { display: none; }
    .slide { display: block; flex: 0 0 100%; min-width: 0; scroll-snap-align: start; }
    .controls { display: flex; align-items: center; justify-content: center; gap: 18px; margin-top: 18px; }
    .nav {
      width: 42px; height: 42px; border: 1px solid var(--line); border-radius: 50%;
      color: var(--text); background: var(--bg-raised); font-size: 1.1rem; cursor: pointer;
      transition: border-color .2s ease, background .2s ease;
    }
    .nav:hover { border-color: var(--accent); background: var(--accent-wash); }
    .dots { display: flex; gap: 8px; }
    .dot {
      width: 9px; height: 9px; padding: 0; border: 0; border-radius: 99px;
      background: var(--line); cursor: pointer; transition: width .25s ease, background .25s ease;
    }
    .dot.active { width: 26px; background: var(--accent); }
    .count { min-width: 56px; color: var(--muted); font: 12px var(--font-mono); text-align: center; }
  `],
})
export class ProjectSliderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) projects: readonly PortfolioProject[] = [];
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

  index = 0;
  paused = false;
  private timer?: number;

  ngOnInit(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      this.timer = window.setInterval(() => {
        if (!this.paused) this.go(this.index + 1);
      }, 7000);
    }
  }

  go(target: number): void {
    const count = this.projects.length;
    if (!count) return;
    const next = (target + count) % count;
    const element = this.track.nativeElement;
    this.index = next;
    element.scrollTo({ left: next * element.clientWidth, behavior: 'smooth' });
  }

  onScroll(): void {
    const element = this.track.nativeElement;
    if (element.clientWidth) {
      this.index = Math.round(element.scrollLeft / element.clientWidth);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) window.clearInterval(this.timer);
  }
}