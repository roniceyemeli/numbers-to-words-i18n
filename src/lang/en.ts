import { LanguageData, LanguageConverter, LanguageModule } from "./types";

const data: LanguageData = {
  ones: [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ],
  teens: [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ],
  tens: [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ],
  scales: ["", "thousand", "million", "billion", "trillion"],
  hundred: "hundred",
  zero: "zero",
  negative: "negative",
  point: "point",
};

class EnglishConverter implements LanguageConverter {
  convertInteger(num: number): string {
    if (num < 10) return data.ones[num];
    if (num < 20) return data.teens[num - 10];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      return data.tens[tens] + (ones ? "-" + data.ones[ones] : "");
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      return (
        data.ones[hundreds] +
        " " +
        data.hundred +
        (rest ? " " + this.convertInteger(rest) : "")
      );
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
        const scaleWord = scales[i];
        const remainderWords = remainder ? this.convertInteger(remainder) : "";

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
}

export const englishModule: LanguageModule = {
  code: "en",
  data,
  converter: new EnglishConverter(),
};
