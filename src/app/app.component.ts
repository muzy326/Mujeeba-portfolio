import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Studio3DComponent } from './studio-3d.component';
import {
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
} from './portfolio-data';
import { ProjectCardComponent } from './project-card.component';
import { RESUME_AVAILABLE } from './resume-status.generated';
import { SkillGroupComponent } from './skill-group.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectCardComponent,
    SkillGroupComponent,
    Studio3DComponent,
  ],
  template: `
    @if (showStudio) {
  <app-studio-3d (close)="closeStudio()" />
} @else {
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="page-shell header-inner">
        <a class="brand" href="#home" aria-label="Mohammed Mujeeba, home" (click)="closeMenu()">
          <span class="brand-mark" aria-hidden="true">MM</span>
          <span>
            <span class="brand-name">Mohammed Mujeeba</span>
            <span class="brand-role">FRONT-END DEVELOPER</span>
          </span>
        </a>

        <nav class="desktop-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>

        <div class="header-actions">
          <a
            *ngIf="resumeAvailable"
            class="button button-quiet header-resume"
            href="/resume.pdf"
            download="Mohammed-Mujeeba-Resume.pdf"
          >Download Resume</a>
          <button
            *ngIf="!resumeAvailable"
            class="button button-quiet header-resume"
            type="button"
            (click)="announceResumeMissing()"
            aria-label="Resume PDF is not available yet"
          >Download Resume</button>
          <button class="theme-toggle" type="button" (click)="toggleTheme()"
            [attr.aria-label]="isLightTheme ? 'Switch to dark theme' : 'Switch to light theme'"
            [attr.aria-pressed]="isLightTheme">
            <svg *ngIf="!isLightTheme" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>
            </svg>
            <svg *ngIf="isLightTheme" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.2 15.6A8.6 8.6 0 0 1 8.4 3.8 8.8 8.8 0 1 0 20.2 15.6Z"></path>
            </svg>
          </button>
          <button class="menu-toggle" type="button" (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen" aria-controls="mobile-navigation"
            [attr.aria-label]="menuOpen ? 'Close navigation menu' : 'Open navigation menu'">
            <svg *ngIf="!menuOpen" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>
            <svg *ngIf="menuOpen" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>
          </button>
        </div>
      </div>
      <nav *ngIf="menuOpen" class="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
        <a href="#home" (click)="closeMenu()">Home</a>
        <a href="#about" (click)="closeMenu()">About</a>
        <a href="#skills" (click)="closeMenu()">Skills</a>
        <a href="#projects" (click)="closeMenu()">Projects</a>
        <a href="#experience" (click)="closeMenu()">Experience</a>
        <a href="#contact" (click)="closeMenu()">Contact</a>
          <a
            *ngIf="resumeAvailable"
            class="button button-secondary mobile-resume"
            href="/resume.pdf"
            download="Mohammed-Mujeeba-Resume.pdf"
          >Download Resume</a>
          <button
            *ngIf="!resumeAvailable"
            class="button button-secondary mobile-resume"
            type="button"
            (click)="announceResumeMissing()"
          >Download Resume</button>
      </nav>
    </header>

    <main id="main-content">
      <section class="hero page-shell" id="home" aria-labelledby="hero-title">
        <div class="hero-grid">
          <div>
            <div class="availability">Open to front-end opportunities</div>
            <p class="eyebrow">Riyadh, Saudi Arabia · Remote</p>
            <h1 id="hero-title">Hi, I'm <span>Mohammed Mujeeba</span></h1>
            <p class="hero-lede">Front-End Developer building responsive, user-friendly web applications.</p>
            <p class="hero-copy">I build practical web applications using Angular, React, TypeScript, and modern full-stack technologies.</p>
            <div class="hero-actions">
              <a class="button button-primary" href="#projects">View My Projects <span aria-hidden="true">↗</span></a>
              <a
                *ngIf="resumeAvailable"
                class="button button-secondary"
                href="/resume.pdf"
                download="Mohammed-Mujeeba-Resume.pdf"
              >Download Resume</a>
              <button
                *ngIf="!resumeAvailable"
                class="button button-secondary"
                type="button"
                (click)="announceResumeMissing()"
              >Download Resume</button>
              <a class="button button-secondary" href="#contact">Contact Me</a>
              <button
  class="button button-secondary"
  type="button"
  (click)="openStudio()"
>
  Explore 3D Studio ↗
</button>
            </div>
            <p class="resume-inline" *ngIf="resumeNotice" id="resume-note" role="status">
              Resume PDF not added yet. Place your actual file at <code>public/resume.pdf</code> to enable download.
            </p>
            <div class="tech-line" aria-label="Selected technologies">
              <span class="tech-label">Working with</span>
              <span class="tech-chip">Angular</span>
              <span class="tech-chip">React</span>
              <span class="tech-chip">TypeScript</span>
              <span class="tech-chip">Node.js</span>
              <span class="tech-chip">PostgreSQL</span>
            </div>
          </div>

          <aside class="hero-aside" aria-label="Development focus">
            <div class="aside-top"><span>PROFILE / 01</span><span class="aside-index">MM—26</span></div>
            <div class="aside-feature">
              <h2>Interfaces with a clear purpose.</h2>
              <p>Responsive experiences, practical integrations, and maintainable application structure.</p>
            </div>
            <div class="aside-stack">
              <div class="stack-item"><span class="stack-symbol" aria-hidden="true">01</span><span><strong>Frontend</strong><span>Angular · React · TypeScript</span></span></div>
              <div class="stack-item"><span class="stack-symbol" aria-hidden="true">02</span><span><strong>Application data</strong><span>REST APIs · PostgreSQL · Firebase</span></span></div>
              <div class="stack-item"><span class="stack-symbol" aria-hidden="true">03</span><span><strong>Build & deploy</strong><span>Git · Docker · Vercel · AWS EC2</span></span></div>
            </div>
            <div class="aside-bottom"><span>FRONT-END / FULL-STACK PROJECTS</span><span>01—03</span></div>
          </aside>
        </div>
      </section>

      <section class="section" id="about" aria-labelledby="about-title">
        <div class="page-shell about-layout">
          <div class="about-label">
            <div class="section-heading">
              <p class="eyebrow">01 / About</p>
              <h2 id="about-title">Thoughtful work, from interface to integration.</h2>
            </div>
          </div>
          <div class="about-copy">
            <p>{{ profile.summary }}</p>
            <p>I focus on responsive UI development, reusable components, and API integration, with an interest in building maintainable applications. I also understand backend APIs, databases, deployment, and AI integration.</p>
            <p>I am interested in front-end and web application development opportunities in Riyadh and remote teams.</p>
            <div class="about-notes">
              <div class="note-card"><strong>Frontend first</strong><span>Responsive UI, reusable components, and practical interaction design.</span></div>
              <div class="note-card"><strong>Comfortable across the stack</strong><span>APIs, databases, deployment, and AI-assisted workflows.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="skills" aria-labelledby="skills-title">
        <div class="page-shell">
          <div class="section-heading">
            <p class="eyebrow">02 / Technical toolkit</p>
            <h2 id="skills-title">Skills I use to build and ship.</h2>
            <p>A practical mix of interface engineering, application data, deployment tools, and AI integration.</p>
          </div>
          <div class="skills-grid">
            <app-skill-group *ngFor="let group of skillGroups" [group]="group"></app-skill-group>
          </div>
        </div>
      </section>

      <section class="section" id="projects" aria-labelledby="projects-title">
        <div class="page-shell">
          <div class="section-heading">
            <p class="eyebrow">03 / Selected projects</p>
            <h2 id="projects-title">Applications built to be used.</h2>
            <p>Full-stack projects spanning responsive interfaces, API and data integration, authentication, and deployment.</p>
          </div>
          <div class="projects-grid">
            <app-project-card
              *ngFor="let project of projects; let index = index"
              [project]="project"
              [projectNumber]="index + 1"
            ></app-project-card>
          </div>
        </div>
      </section>

      <section class="section" id="experience" aria-labelledby="experience-title">
        <div class="page-shell">
          <div class="experience-layout">
            <div class="section-heading">
              <p class="eyebrow">04 / Experience</p>
              <h2 id="experience-title">Work and practice.</h2>
              <p>Professional experience and independent project work, presented without the noise.</p>
            </div>
            <div class="timeline">
              <article class="role" *ngFor="let entry of experience">
                <div class="role-meta"><h3>{{ entry.role }}</h3><span class="role-date">{{ entry.dates }}</span></div>
                <p class="role-company">{{ entry.company }}</p>
                <ul><li *ngFor="let item of entry.responsibilities">{{ item }}</li></ul>
              </article>
            </div>
          </div>
          <div class="education">
            <div class="section-heading">
              <p class="eyebrow">05 / Education</p>
              <h2>Academic foundation.</h2>
            </div>
            <article class="education-card">
              <h3>{{ education.qualification }}</h3>
              <p>{{ education.institution }}</p>
              <p class="education-meta">QUALIFICATION · POWER SYSTEM ANALYSIS</p>
            </article>
          </div>
        </div>
      </section>

      <section class="contact-section" id="contact" aria-labelledby="contact-title">
        <div class="page-shell contact-grid">
          <div class="contact-copy">
            <p class="eyebrow">06 / Contact</p>
            <h2 id="contact-title">Let's Build Something Useful</h2>
            <p>I'm open to opportunities in front-end development, Angular, React, and web application development.</p>
            <div class="contact-links">
              <a class="button button-primary" [href]="'mailto:' + profile.email">Email Mohammed</a>
              <a class="contact-link" [href]="profile.github" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3 0 6.2-1.5 6.2-6.7a5.2 5.2 0 0 0-1.4-3.6A4.8 4.8 0 0 0 18.8 2S17.6 1.6 15 3.4a13 13 0 0 0-7 0C5.4 1.6 4.2 2 4.2 2a4.8 4.8 0 0 0-.1 3.1 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.7 6.2 6.7A3.4 3.4 0 0 0 8 18.1V22"></path></svg>
                GitHub
              </a>
              <a class="contact-link" [href]="profile.linkedin" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v11M4 4v.01M9 20v-6.3c0-2.1 1.2-3.2 3-3.2s3 1.1 3 3.2V20m0-6.3c0-2.1 1.2-3.2 3-3.2s3 1.1 3 3.2V20"></path></svg>
                LinkedIn
              </a>
            </div>
          </div>
          <form class="contact-form" [formGroup]="contactForm" (ngSubmit)="submitContact()" novalidate>
            <h3>Write a message</h3>
            <p class="form-explainer">Your email app will open with a draft addressed to {{ profile.email }}. Nothing is sent from this site.</p>
            <div class="field">
              <label for="contact-name">Name</label>
              <input id="contact-name" type="text" formControlName="name" autocomplete="name" placeholder="Your name"
                [attr.aria-invalid]="hasError('name')">
              <span class="field-error" *ngIf="hasError('name')">Please enter your name.</span>
            </div>
            <div class="field">
              <label for="contact-email">Email</label>
              <input id="contact-email" type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"
                [attr.aria-invalid]="hasError('email')">
              <span class="field-error" *ngIf="hasError('email')">Enter a valid email address.</span>
            </div>
            <div class="field">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" formControlName="message" placeholder="What would you like to discuss?"
                [attr.aria-invalid]="hasError('message')"></textarea>
              <span class="field-error" *ngIf="hasError('message')">Please add a message (at least 10 characters).</span>
            </div>
            <button class="button button-primary" type="submit">Open email draft <span aria-hidden="true">↗</span></button>
            <p class="form-status" *ngIf="formStatus" role="status">{{ formStatus }}</p>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="page-shell footer-main">
        <div class="footer-title"><strong>{{ profile.name }}</strong>{{ profile.title }}</div>
        <nav class="footer-links" aria-label="Social links">
          <a [href]="profile.github" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a [href]="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a [href]="'mailto:' + profile.email">Email</a>
        </nav>
      </div>
      <div class="page-shell footer-copy">© {{ currentYear }} Mohammed Mujeeba. All rights reserved.</div>
    </footer>
    }
  `,
})
export class AppComponent implements OnInit {
  readonly profile = PROFILE;
  readonly skillGroups = SKILL_GROUPS;
  readonly projects = PROJECTS;
  readonly experience = EXPERIENCE;
  readonly education = EDUCATION;
  readonly currentYear = new Date().getFullYear();
  readonly resumeAvailable = RESUME_AVAILABLE;
  readonly contactForm;
  isLightTheme = false;
  menuOpen = false;
  showStudio = false;
  resumeNotice = false;
  formStatus = '';

  constructor(formBuilder: FormBuilder) {
    this.contactForm = formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    });
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('portfolio-theme');
    this.isLightTheme = savedTheme === 'light';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isLightTheme = !this.isLightTheme;
    localStorage.setItem('portfolio-theme', this.isLightTheme ? 'light' : 'dark');
    this.applyTheme();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
    openStudio(): void {
    this.showStudio = true;
    this.closeMenu();
    window.scrollTo(0, 0);
  }

  closeStudio(): void {
    this.showStudio = false;
    window.scrollTo(0, 0);
  }

  announceResumeMissing(): void {
    this.resumeNotice = true;
    this.closeMenu();
  }

  hasError(controlName: 'name' | 'email' | 'message'): boolean {
    const control = this.contactForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  submitContact(): void {
    this.formStatus = '';
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.formStatus = 'Please review the highlighted fields before continuing.';
      return;
    }

    const { name, email, message } = this.contactForm.getRawValue();
    const subject = `Portfolio enquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${this.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.formStatus = 'Your email application should open with a draft. This portfolio does not send messages directly.';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  private applyTheme(): void {
    document.documentElement.dataset['theme'] = this.isLightTheme ? 'light' : 'dark';
  }
}
