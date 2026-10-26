import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { PortfolioProject } from './portfolio-data';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="project-card">
      <div class="project-image-wrap">
        <img
          class="project-image"
          [src]="project.image"
          [alt]="project.imageAlt"
          loading="lazy"
          decoding="async"
        >
        <span class="image-caption">{{ project.imageCaption }}</span>
      </div>
      <div class="project-body">
        <div class="project-kicker">
          <span>{{ project.category }}</span>
          <span>PROJECT / {{ projectNumber.toString().padStart(2, '0') }}</span>
        </div>
        <h3>{{ project.name }}</h3>
        <p class="project-description">{{ project.description }}</p>
        <div class="project-focus" *ngIf="project.focus">
          <strong>Scope:</strong> {{ project.focus }}
          The public demo may take time to start after inactivity.
        </div>
        <div class="project-tags" aria-label="Technologies">
          <span class="tag" *ngFor="let technology of project.technologies">
            {{ technology }}
          </span>
        </div>
        <div class="project-links">
          <a
            class="text-link"
            [href]="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Demo
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 4h6v6m0-6-9 9"></path>
              <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"></path>
            </svg>
          </a>
          <a
            class="text-link"
            [href]="project.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3 0 6.2-1.5 6.2-6.7a5.2 5.2 0 0 0-1.4-3.6A4.8 4.8 0 0 0 18.8 2S17.6 1.6 15 3.4a13 13 0 0 0-7 0C5.4 1.6 4.2 2 4.2 2a4.8 4.8 0 0 0-.1 3.1 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.7 6.2 6.7A3.4 3.4 0 0 0 8 18.1V22"></path>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: PortfolioProject;
  @Input({ required: true }) projectNumber!: number;
}
