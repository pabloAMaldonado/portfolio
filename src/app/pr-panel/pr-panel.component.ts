/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslationService } from '../services/translation.service'
import { map, Observable, take } from 'rxjs'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { trigger, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-pr-panel',
  standalone: true,
  imports: [TranslateModule, CommonModule, NgOptimizedImage],
  templateUrl: './pr-panel.component.html',
  styleUrl: './pr-panel.component.css',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})

export class PrPanelComponent implements OnInit {
  lang = ''
  projects$!: Observable<any>
  currentPr!: any
  prLength!: number
  currentIndex = 0

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
      map((project) => {
        return Object.values(project)
      })
    )
    this.projects$.subscribe((projects) => {
      if (projects.length > 0) {
        this.setPr(this.currentIndex)
        this.prLength = projects.length
      }
    });
  }

  setPr(index: number) {
    this.projects$.pipe(
      map(projects=> projects[index])
      ,take(1)
    ).subscribe(project => {
      this.currentPr = null
      setTimeout(() => {
        this.currentPr = project
      }, 450)
    })
  }

  changeIndex(index: number, op: string) {
    if (op === 'up' && this.currentIndex < this.prLength - 1) {
      this.setPr(index + 1)
      return this.currentIndex = index + 1
    } else if (op === 'down' && this.currentIndex > 0) {
      this.setPr(index - 1)
      return this.currentIndex = index - 1
    }
    return null
  }
}

