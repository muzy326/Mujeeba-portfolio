import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { SkillGroup } from './portfolio-data';

@Component({
  selector: 'app-skill-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="skill-group">
      <div class="skill-heading">
        <span class="skill-icon" aria-hidden="true">{{ group.mark }}</span>
        <h3>{{ group.title }}</h3>
      </div>
      <div class="skill-items">
        <span class="tag" *ngFor="let skill of group.skills">{{ skill }}</span>
      </div>
    </article>
  `,
})
export class SkillGroupComponent {
  @Input({ required: true }) group!: SkillGroup;
}
