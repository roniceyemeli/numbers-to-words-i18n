import { LanguageData, LanguageConverter, LanguageModule } from "./types";

const data: LanguageData = {
  ones: [
    "",
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
  ],
  teens: [
    "dix",
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize",
    "dix-sept",
    "dix-huit",
    "dix-neuf",
  ],
  tens: [
    "",
    "dix",
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante-dix",
    "quatre-vingt",
    "quatre-vingt-dix",
  ],
  scales: ["", "mille", "million", "milliard", "billion"],
  hundred: "cent",
  zero: "zéro",
  negative: "moins",
  point: "virgule",
};

class FrenchConverter implements LanguageConverter {
  convertInteger(num: number): string {
    if (num === 1) return "un";
    if (num < 10) return data.ones[num];
    if (num < 20) return data.teens[num - 10];
    if (num < 60) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      if (ones === 0) return data.tens[tens];
      if (ones === 1 && tens !== 1) return data.tens[tens] + " et un";
      return data.tens[tens] + "-" + data.ones[ones];
    }
    if (num < 70) {
      const ones = num - 60;
      if (ones === 0) return "soixante";
      if (ones === 1) return "soixante et un";
      return "soixante-" + data.ones[ones];
    }
    if (num < 80) {
      const ones = num - 60;
      if (ones < 10) return "soixante-" + data.ones[ones];
      return "soixante-" + data.teens[ones - 10];
    }
    if (num < 100) {
      if (num === 80) return "quatre-vingts";
      const ones = num - 80;
      if (ones === 0) return "quatre-vingt";
      if (ones < 10) return "quatre-vingt-" + data.ones[ones];
      return "quatre-vingt-" + data.teens[ones - 10];
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      let result = hundreds === 1 ? "cent" : data.ones[hundreds] + " cent";
      if (rest === 0 && hundreds > 1) result += "s";
      if (rest) result += " " + this.convertInteger(rest);
      return result;
    }
    if (num < 2000) {
      const rest = num % 1000;
      if (rest === 0) return "mille";
      return "mille " + this.convertInteger(rest);
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const rest = num % 1000;
      let result = this.convertInteger(thousands) + " mille";
      if (rest) result += " " + this.convertInteger(rest);
      return result;
    }

    return this.convertWithScales(num);
  }

  convertWithScales(num: number): string {
    const scales = data.scales;

    for (let i = scales.length - 1; i > 0; i--) {
      const divisor = Math.pow(1000, i);
      if (num >= divisor) {
        const quotient = Math.floor(num / divisor);
        const remainder = num % divisor;

        const quotientWords = this.convertInteger(quotient);
        const scaleWord = this.getScaleWord(quotient, scales[i]);
        const remainderWords = remainder ? this.convertInteger(remainder) : "";

        // For French, handle "mille" specially (don't put "un" before it)
        if (i === 1 && quotient === 1) {
          return scaleWord + (remainderWords ? " " + remainderWords : "");
        }
        return (
          quotientWords +
          " " +
          scaleWord +
          (remainderWords ? " " + remainderWords : "")
        );
      }
    }

    return "";
  }

  getScaleWord(quotient: number, scale: string): string {
    if (quotient > 1 && scale !== "mille") {
      return scale + "s";
    }
    return scale;
  }
}

export const frenchModule: LanguageModule = {
  code: "fr",
  data,
  converter: new FrenchConverter(),
};
