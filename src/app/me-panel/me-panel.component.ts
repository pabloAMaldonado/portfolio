
import { Component, OnInit } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslationService } from '../services/translation.service'
import { map, Observable } from 'rxjs'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-me-panel',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './me-panel.component.html',
  styleUrls: ['./me-panel.component.css']
})

export class MePanelComponent implements OnInit {
  lang = ''
  translatedText$!: Observable<string>

  constructor(private translationService: TranslationService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.lang = this.translationService.getCurrentLanguage()
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslatedText()
    })
  }

  onChangeLang(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value
    this.translationService.changeLanguage(selectedLang)
    this.lang = selectedLang
  }

  loadTranslatedText() {
    this.translatedText$ = this.translationService.getTranslation('PANELME').pipe(
      map((text: string) => text.replace(/\n/g, '<br>'))
    );
  }
}