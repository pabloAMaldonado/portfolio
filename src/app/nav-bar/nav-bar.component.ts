
import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { TranslationService } from '../services/translation.service'

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})

export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private translationService: TranslationService, private renderer: Renderer2) {}
  activeSection = ''
  lang = ''


  private observer: IntersectionObserver | null = null

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section')

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id
          }
      })
      }, { root: null, threshold: 0.6 }
    )

    sections.forEach((section) => {
      if (this.observer) {
        this.observer.observe(section)
      }
    })
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  ngOnInit(): void {
    this.lang = this.translationService.getCurrentLanguage()
  }

  onChangeLang(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value;
    this.translationService.changeLanguage(selectedLang)
    this.lang = selectedLang
  }

  changeLanguage(lang: string) {
    this.translationService.changeLanguage(lang);
  }

  scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  onKeyPress(event: KeyboardEvent, sectionId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.scrollToSection(sectionId);
    }
  }
}
