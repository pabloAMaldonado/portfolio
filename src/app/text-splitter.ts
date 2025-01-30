
import { Inject, Injectable } from '@angular/core'
import SplitType from 'split-type'
import { DebounceService } from '../utils/debounce'

type SplitTypeList = ("lines" | "words" | "chars")[]

interface TextSplitterOptions {
  resizeCallback?: () => void; 
  splitTypeTypes?: SplitTypeList;
}

@Injectable({
    providedIn: 'root',
  })

  
export class TextSplitter {
    private textElement: HTMLElement
    private splitText: SplitType
    private onResize!: (() => void) | null
    private previousContainerWidth: number | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private splitOptions!: any;

    constructor(
      textElement: HTMLElement,
      @Inject('OptionsToken') private options: TextSplitterOptions = {},
    ) {
      this.textElement = textElement;

      if (!textElement || !(textElement instanceof HTMLElement)) {
        throw new Error('Invalid text element provided.');
      }
      const { resizeCallback = null, splitTypeTypes } = this.options

      this.onResize = resizeCallback

      const splitOptions = splitTypeTypes ? { types: splitTypeTypes } : {}
      this.splitText = new SplitType(this.textElement, splitOptions)

      this.initResizeObserver()
    }

  private initResizeObserver() {
    this.previousContainerWidth = null
    const debounceService = new DebounceService()
    this.resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) =>
        debounceService.debounce(() => this.handleResize(entries), 1000)
    )
    this.resizeObserver.observe(this.textElement)
  }

  private handleResize(entries: ResizeObserverEntry[]) {
    const [{ contentRect }] = entries;
    const width = Math.floor(contentRect.width);
    
    if ( this.previousContainerWidth && this.previousContainerWidth !== width ) {
      this.splitText.split(this.splitOptions); // Re-split text for new width.
      if (this.onResize) {
        this.onResize();
      }    }
    this.previousContainerWidth = width;
  }

  revert() {
    this.splitText.revert()
  }

  getLines() {
    return this.splitText.lines;
  }

  getWords() {
    return this.splitText.words;
  }

  getChars() {
    return this.splitText.chars;
  }
}
