
import { Component, OnInit } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { NavBarComponent } from './nav-bar/nav-bar.component'
import { TranslationService } from './services/translation.service'
import { MePanelComponent } from './me-panel/me-panel.component'
import { PrPanelComponent } from './pr-panel/pr-panel.component'
import { SkillPanelComponent } from './skill-panel/skill-panel.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent, TranslateModule, MePanelComponent, PrPanelComponent, SkillPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  constructor(private translationService: TranslationService) {}
  lang = ''

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
}