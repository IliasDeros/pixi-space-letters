export class InputKeyboard {
  globale: string;

  constructor(locale: string) {
    this.globale = locale;
  }

  getIci() {
    return this.globale + " je suis ici";
  }
}
