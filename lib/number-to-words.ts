export type SupportedLanguage = "en" | "fr" | "ar";

export interface ConversionOptions {
  language?: SupportedLanguage;
}

export interface ConversionResult {
  words: string;
  language: SupportedLanguage;
  number: number;
}

class NumberToWords {
  private static readonly MAX_SAFE_NUMBER = 999999999999999;

  // English conversion
  private static readonly EN_ONES = [
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
  ];

  private static readonly EN_TEENS = [
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
  ];

  private static readonly EN_TENS = [
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
  ];

  private static readonly EN_SCALES = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
  ];

  // French conversion
  private static readonly FR_ONES = [
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
  ];

  private static readonly FR_TEENS = [
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
  ];

  private static readonly FR_TENS = [
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
  ];

  private static readonly FR_SCALES = [
    "",
    "mille",
    "million",
    "milliard",
    "billion",
  ];

  // Arabic conversion
  private static readonly AR_ONES = [
    "",
    "واحد",
    "اثنان",
    "ثلاثة",
    "أربعة",
    "خمسة",
    "ستة",
    "سبعة",
    "ثمانية",
    "تسعة",
  ];

  private static readonly AR_ONES_FEMININE = [
    "",
    "واحدة",
    "اثنتان",
    "ثلاث",
    "أربع",
    "خمس",
    "ست",
    "سبع",
    "ثمان",
    "تسع",
  ];

  private static readonly AR_TEENS = [
    "عشرة",
    "أحد عشر",
    "اثنا عشر",
    "ثلاثة عشر",
    "أربعة عشر",
    "خمسة عشر",
    "ستة عشر",
    "سبعة عشر",
    "ثمانية عشر",
    "تسعة عشر",
  ];

  private static readonly AR_TENS = [
    "",
    "عشرة",
    "عشرون",
    "ثلاثون",
    "أربعون",
    "خمسون",
    "ستون",
    "سبعون",
    "ثمانون",
    "تسعون",
  ];

  private static readonly AR_HUNDREDS = [
    "",
    "مائة",
    "مئتان",
    "ثلاثمائة",
    "أربعمائة",
    "خمسمائة",
    "ستمائة",
    "سبعمائة",
    "ثماني مائة",
    "تسعمائة",
  ];

  private static readonly AR_SCALES = ["", "ألف", "مليون", "مليار", "ترليون"];

  /**
   * Convert a number to words in the specified language
   */
  public static convert(
    num: number,
    options: ConversionOptions = { language: "en" }
  ): ConversionResult {
    const language = options.language || "en";

    if (!Number.isFinite(num)) {
      throw new Error("Input must be a finite number");
    }

    if (Math.abs(num) > this.MAX_SAFE_NUMBER) {
      throw new Error(
        `Number too large. Maximum supported: ${this.MAX_SAFE_NUMBER}`
      );
    }

    let words: string;

    switch (language) {
      case "en":
        words = this.convertEnglish(num);
        break;
      case "fr":
        words = this.convertFrench(num);
        break;
      case "ar":
        words = this.convertArabic(num);
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    return {
      words,
      language,
      number: num,
    };
  }

  /**
   * Convert number to English words
   */
  private static convertEnglish(num: number): string {
    if (num === 0) return "zero";

    if (num < 0) {
      return "negative " + this.convertEnglish(-num);
    }

    // Handle decimals
    if (num % 1 !== 0) {
      const [intPart, decPart] = num.toString().split(".");
      return (
        this.convertEnglish(parseInt(intPart)) +
        " point " +
        decPart
          .split("")
          .map((d) => this.EN_ONES[parseInt(d)] || "zero")
          .join(" ")
      );
    }

    return this.convertEnglishInteger(num);
  }

  private static convertEnglishInteger(num: number): string {
    if (num < 10) return this.EN_ONES[num];
    if (num < 20) return this.EN_TEENS[num - 10];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      return this.EN_TENS[tens] + (ones ? "-" + this.EN_ONES[ones] : "");
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      return (
        this.EN_ONES[hundreds] +
        " hundred" +
        (rest ? " " + this.convertEnglishInteger(rest) : "")
      );
    }

    // Handle larger numbers
    for (let i = this.EN_SCALES.length - 1; i > 0; i--) {
      const divisor = Math.pow(1000, i);
      if (num >= divisor) {
        const quotient = Math.floor(num / divisor);
        const remainder = num % divisor;
        return (
          this.convertEnglishInteger(quotient) +
          " " +
          this.EN_SCALES[i] +
          (remainder ? " " + this.convertEnglishInteger(remainder) : "")
        );
      }
    }

    return "";
  }

  /**
   * Convert number to French words
   */
  private static convertFrench(num: number): string {
    if (num === 0) return "zéro";

    if (num < 0) {
      return "moins " + this.convertFrench(-num);
    }

    // Handle decimals
    if (num % 1 !== 0) {
      const [intPart, decPart] = num.toString().split(".");
      return (
        this.convertFrench(parseInt(intPart)) +
        " virgule " +
        decPart
          .split("")
          .map((d) => this.FR_ONES[parseInt(d)] || "zéro")
          .join(" ")
      );
    }

    return this.convertFrenchInteger(num);
  }

  private static convertFrenchInteger(num: number): string {
    if (num === 1) return "un";
    if (num < 10) return this.FR_ONES[num];
    if (num < 20) return this.FR_TEENS[num - 10];
    if (num < 70) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      if (ones === 0) return this.FR_TENS[tens];
      if (ones === 1 && tens !== 1) return this.FR_TENS[tens] + " et un";
      return this.FR_TENS[tens] + "-" + this.FR_ONES[ones];
    }
    if (num < 80) {
      const ones = num - 60;
      if (ones < 10) return "soixante-" + this.FR_ONES[ones];
      return "soixante-" + this.FR_TEENS[ones - 10];
    }
    if (num < 100) {
      if (num === 80) return "quatre-vingts";
      const ones = num - 80;
      if (ones < 10) return "quatre-vingt-" + this.FR_ONES[ones];
      return "quatre-vingt-" + this.FR_TEENS[ones - 10];
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      let result = hundreds === 1 ? "cent" : this.FR_ONES[hundreds] + " cent";
      if (rest === 0 && hundreds > 1) result += "s";
      if (rest) result += " " + this.convertFrenchInteger(rest);
      return result;
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const rest = num % 1000;
      let result =
        thousands === 1
          ? "mille"
          : this.convertFrenchInteger(thousands) + " mille";
      if (rest) result += " " + this.convertFrenchInteger(rest);
      return result;
    }

    // Handle millions and beyond
    for (let i = this.FR_SCALES.length - 1; i >= 2; i--) {
      const divisor = Math.pow(1000, i);
      if (num >= divisor) {
        const quotient = Math.floor(num / divisor);
        const remainder = num % divisor;
        let result =
          this.convertFrenchInteger(quotient) + " " + this.FR_SCALES[i];
        if (quotient > 1) result += "s";
        if (remainder) result += " " + this.convertFrenchInteger(remainder);
        return result;
      }
    }

    return "";
  }

  /**
   * Convert number to Arabic words
   */
  private static convertArabic(num: number): string {
    if (num === 0) return "صفر";

    if (num < 0) {
      return "سالب " + this.convertArabic(-num);
    }

    // Handle decimals
    if (num % 1 !== 0) {
      const [intPart, decPart] = num.toString().split(".");
      return (
        this.convertArabic(parseInt(intPart)) +
        " فاصلة " +
        decPart
          .split("")
          .map((d) => this.AR_ONES[parseInt(d)] || "صفر")
          .join(" ")
      );
    }

    return this.convertArabicInteger(num);
  }

  private static convertArabicInteger(num: number): string {
    if (num < 10) return this.AR_ONES[num];
    if (num === 10) return "عشرة";
    if (num < 20) return this.AR_TEENS[num - 10];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      if (ones === 0) return this.AR_TENS[tens];
      return this.AR_ONES[ones] + " و" + this.AR_TENS[tens];
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      return (
        this.AR_HUNDREDS[hundreds] +
        (rest ? " و" + this.convertArabicInteger(rest) : "")
      );
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const rest = num % 1000;
      let result: string;
      if (thousands === 1) {
        result = "ألف";
      } else if (thousands === 2) {
        result = "ألفان";
      } else if (thousands <= 10) {
        result = this.AR_ONES_FEMININE[thousands] + " آلاف";
      } else {
        result = this.convertArabicInteger(thousands) + " ألف";
      }
      if (rest) result += " و" + this.convertArabicInteger(rest);
      return result;
    }

    // Handle millions
    if (num < 1000000000) {
      const millions = Math.floor(num / 1000000);
      const rest = num % 1000000;
      let result: string;
      if (millions === 1) {
        result = "مليون";
      } else if (millions === 2) {
        result = "مليونان";
      } else if (millions <= 10) {
        result = this.AR_ONES_FEMININE[millions] + " ملايين";
      } else {
        result = this.convertArabicInteger(millions) + " مليون";
      }
      if (rest) result += " و" + this.convertArabicInteger(rest);
      return result;
    }

    return this.convertArabicInteger(num);
  }
}

// Export default instance
export default NumberToWords;

// Export convenience functions
export const toWords = (
  num: number,
  language: SupportedLanguage = "en"
): string => {
  return NumberToWords.convert(num, { language }).words;
};

export const toEnglish = (num: number): string => toWords(num, "en");
export const toFrench = (num: number): string => toWords(num, "fr");
export const toArabic = (num: number): string => toWords(num, "ar");
