/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit, Renderer2 } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslationService } from '../services/translation.service'
import { map, BehaviorSubject } from 'rxjs'
import { CommonModule } from '@angular/common'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

interface Tech {
  name: string;
  logo: SafeHtml
  onLogo: SafeHtml
  desc: string
  isHover?: boolean;
}

@Component({
  selector: 'app-skill-panel',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './skill-panel.component.html',
  styleUrl: './skill-panel.component.css'
})
export class SkillPanelComponent implements OnInit{
  lang = ''
  mainTxt$ = new BehaviorSubject<string>('')
  techs$: BehaviorSubject<Tech[]> = new BehaviorSubject<Tech[]>([])
  isHover = false
  private clickInProgress = false

  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.lang = this.translationService.getCurrentLanguage()

    this.translationService.getTranslation('TECH_TXT').subscribe((text) => {
      this.mainTxt$.next(text)
    })

    this.translate.onLangChange.subscribe(() => {
      this.loadTranslatedData()
    })

    this.renderer.listen('document', 'contextmenu', (event) => {
      event.preventDefault()

    })
  }

  onChangeLang(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value
    this.translationService.changeLanguage(selectedLang)
    this.lang = selectedLang
  }

  loadTranslatedData() {
    this.translationService.getTranslation('TECH').pipe(
      map((tech: any) =>
        Object.values(tech).map((techItem: any) => ({
          name: techItem.name,
          onLogo: this.sanitizeSvg(techItem.onLogo),
          logo: this.sanitizeSvg(techItem.logo),
          desc: techItem.desc,
          isHover: false
        }))
      )
    ).subscribe((techArray) => this.techs$.next(techArray))
    
    this.translationService.getTranslation('TECH_TXT').subscribe((text) => {
      this.mainTxt$.next(text)
    })
  }

  sanitizeSvg(logo: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(logo)
  }

  toggleHover(tech: Tech) {
    if (this.clickInProgress) return
    
    const techArray = this.techs$.getValue()

    techArray.forEach((item) => (item.isHover = false))
    tech.isHover = true
    this.mainTxt$.next(tech.desc)
    
    this.techs$.next(techArray)
  }

  toogleHoverOff(tech: Tech) {
    tech.isHover = false;
    this.loadTranslatedData()
  }

  clickTech(tech: Tech) {
    this.clickInProgress = true
    const techArray = this.techs$.getValue();

    tech.isHover = !tech.isHover;

    techArray.forEach((item) => {
      if (item !== tech) {
        item.isHover = false;
      }
    })
    
    if (tech.isHover) {
      this.mainTxt$.next(tech.desc)
    } else {
      this.loadTranslatedData()
    }

    this.techs$.next([...techArray])
    this.clickInProgress = false
  }
}
