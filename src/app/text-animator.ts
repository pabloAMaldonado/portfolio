
import { Injectable } from '@angular/core'
import { gsap } from 'gsap'
import { TextSplitter } from './text-splitter'
import { DebounceService } from '../utils/debounce'

const lettersAndSymbols = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 
    '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','
  ];
  
  const randomColors = ['#22a3a9', '#4ca922', '#a99222', '#1d2619']

@Injectable({
    providedIn: 'root',
  })

export class TextAnimatorService {
    private textElement: HTMLElement;
    private splitter!: TextSplitter;
    private originalChars: string[] = [];
    private originalColors: string[] = [];

    constructor(textElement: HTMLElement) {
        this.textElement = textElement;

        if (!textElement || !(textElement instanceof HTMLElement)) {
            throw new Error('Invalid text element provided.');
          }

      this.textElement =  textElement
      this.splitText()
    }

    private splitText(): void {
        this.splitter = new TextSplitter(this.textElement,
            { splitTypeTypes: ['words', 'chars'] });
        
        const chars = this.splitter.getChars();
      
        if (chars) {
            this.originalChars = chars.map((char: HTMLElement) => char.innerHTML);
            this.originalColors = chars.map((char: HTMLElement) => getComputedStyle(char).color);
        } else {
            this.originalChars = [];
            this.originalColors = [];
        }
    }

    animate(): void {
        this.reset();

        const chars = this.splitter.getChars();
        if (chars) {
            chars.forEach((char, position) => {
            const initialHTML = char.innerHTML;
            const initialColor = getComputedStyle(char).color;
        
            gsap.timeline()
                .fromTo(char, 
                {
                    opacity: 0,
                    transformOrigin: '50% 0%',
                },
                {
                    duration: 0.03,
                    ease: 'none',
                    onComplete: () => {
                    gsap.set(char, { innerHTML: initialHTML, color: initialColor, delay: 0.03 });
                    },
                    repeat: 3,
                    repeatRefresh: true,
                    repeatDelay: 0.1, // delay between repeats
                    delay: (position + 1) * 0.08, // delay between chars
                    innerHTML: () => {
                    const randomChar = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
                    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
                    gsap.set(char, { color: randomColor });
                    return randomChar;
                    },
                    opacity: 1,
                });
        });
        } 
      }

    reset(): void {
        const chars = this.splitter.getChars();
        if (chars) {
            chars.forEach((char, index) => {
                gsap.killTweensOf(char); // Ensure no ongoing animations
                char.innerHTML = this.originalChars[index];
                char.style.color = this.originalColors[index]; // Reset the color
            }) 
        }
    }
}
