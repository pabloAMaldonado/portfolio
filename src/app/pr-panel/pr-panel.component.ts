/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslationService } from '../services/translation.service'
import { map, Observable } from 'rxjs'
import { CommonModule, NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-pr-panel',
  standalone: true,
  imports: [TranslateModule, CommonModule, NgOptimizedImage],
  templateUrl: './pr-panel.component.html',
  styleUrl: './pr-panel.component.css'
})

export class PrPanelComponent implements OnInit {
  lang = ''
  projects$!:Observable<any>

  constructor(private translationService: TranslationService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.lang = this.translationService.getCurrentLanguage()

    this.translate.onLangChange.subscribe(() => {
      this.loadTranslatedData()
    })
  }

  onChangeLang(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value
    this.translationService.changeLanguage(selectedLang)
    this.lang = selectedLang
  }

  loadTranslatedData() {
    this.projects$ = this.translationService.getTranslation('PROJECTS').pipe(
      map((project) => Object.values(project))
    )

  }
}

