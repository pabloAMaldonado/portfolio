
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class DebounceService {
  private timer?: ReturnType<typeof setTimeout>;

  debounce(func: (...args: ResizeObserverEntry[]) => void, delay: number) {
    if (this.timer) {
      clearTimeout(this.timer); // Clears the existing timer if it exists
    }

    this.timer = setTimeout(() => {
      func();
    }, delay);
  }
}
