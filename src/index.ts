export enum ENUM_LANGUAGE {
  FR = "fr",
  AR = "ar",
  EN = "en",
  ES = "es",
}

export interface ConversionOptions {
  language?: ENUM_LANGUAGE;
}

export interface ConversionResult {
  words: string;
  language: ENUM_LANGUAGE;
  number: number;
}

class NumberToWordsConverter {
  private static readonly MAX_SAFE_NUMBER = 999999999999999;

  private static readonly WORD_DATA = {
    [ENUM_LANGUAGE.EN]: {
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
    },
    [ENUM_LANGUAGE.FR]: {
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
    },
    [ENUM_LANGUAGE.AR]: {
      ones: [
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
      ],
      onesFeminine: [
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
      ],
      teens: [
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
      ],
      tens: [
        "",
        "",
        "عشرون",
        "ثلاثون",
        "أربعون",
        "خمسون",
        "ستون",
        "سبعون",
        "ثمانون",
        "تسعون",
      ],
      hundreds: [
        "",
        "مائة",
        "مئتان",
        "ثلاثمائة",
        "أربعمائة",
        "خمسمائة",
        "ستمائة",
        "سبعمائة",
        "ثمانمائة",
        "تسعمائة",
      ],
      scales: ["", "ألف", "مليون", "مليار", "ترليون"],
      zero: "صفر",
      negative: "سالب",
      point: "فاصلة",
    },
    [ENUM_LANGUAGE.ES]: {
      ones: [
        "",
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
      ],
      teens: [
        "diez",
        "once",
        "doce",
        "trece",
        "catorce",
        "quince",
        "dieciséis",
        "diecisiete",
        "dieciocho",
        "diecinueve",
      ],
      tens: [
        "",
        "",
        "veinte",
        "treinta",
        "cuarenta",
        "cincuenta",
        "sesenta",
        "setenta",
        "ochenta",
        "noventa",
      ],
      hundreds: [
        "",
        "ciento",
        "doscientos",
        "trescientos",
        "cuatrocientos",
        "quinientos",
        "seiscientos",
        "setecientos",
        "ochocientos",
        "novecientos",
      ],
      scales: ["", "mil", "millón", "mil millones", "billón"],
      hundred: "cien",
      zero: "cero",
      negative: "menos",
      point: "coma",
    },
  };

  /**
   * Convert a number to words in the specified language
   */
  public static convert(
    num: number,
    options: ConversionOptions = { language: ENUM_LANGUAGE.EN }
  ): ConversionResult {
    const language = options.language || ENUM_LANGUAGE.EN;

    this.validateNumber(num);

    const words = this.convertNumber(num, language);

    return {
      words,
      language,
      number: num,
    };
  }

  private static validateNumber(num: number): void {
    if (!Number.isFinite(num)) {
      throw new Error("Input must be a finite number");
    }

    if (Math.abs(num) > this.MAX_SAFE_NUMBER) {
      throw new Error(
        `Number too large. Maximum supported: ${this.MAX_SAFE_NUMBER}`
      );
    }
  }

  private static convertNumber(num: number, language: ENUM_LANGUAGE): string {
    if (num === 0) {
      return this.WORD_DATA[language].zero;
    }

    if (num < 0) {
      const negativeWord = this.WORD_DATA[language].negative;
      return `${negativeWord} ${this.convertNumber(-num, language)}`;
    }

    // Handle decimals
    if (num % 1 !== 0) {
      return this.handleDecimal(num, language);
    }

    return this.convertInteger(num, language);
  }

  private static handleDecimal(num: number, language: ENUM_LANGUAGE): string {
    // Handle the absolute value to avoid negative zero issues
    const absNum = Math.abs(num);
    const [intPart, decPart] = absNum.toString().split(".");
    const pointWord = this.WORD_DATA[language].point;
    const data = this.WORD_DATA[language];

    // Convert integer part - handle zero case properly
    let integerWords: string;
    const integerValue = parseInt(intPart);
    if (integerValue === 0) {
      integerWords = this.WORD_DATA[language].zero;
    } else {
      integerWords = this.convertInteger(integerValue, language);
    }

    // Add negative prefix if needed
    if (num < 0) {
      integerWords = `${this.WORD_DATA[language].negative} ${integerWords}`;
    }

    // Convert decimal part
    const decimalDigits = decPart
      .split("")
      .map((d) => {
        const digit = parseInt(d);
        if (digit === 0) {
          return language === ENUM_LANGUAGE.AR
            ? "صفر"
            : language === ENUM_LANGUAGE.FR
            ? "zéro"
            : "zero";
        }
        return language === ENUM_LANGUAGE.AR
          ? data.ones[digit]
          : data.ones[digit];
      })
      .join(" ");

    return `${integerWords} ${pointWord} ${decimalDigits}`;
  }

  private static convertInteger(num: number, language: ENUM_LANGUAGE): string {
    switch (language) {
      case ENUM_LANGUAGE.EN:
        return this.convertEnglishInteger(num);
      case ENUM_LANGUAGE.FR:
        return this.convertFrenchInteger(num);
      case ENUM_LANGUAGE.AR:
        return this.convertArabicInteger(num);
      case ENUM_LANGUAGE.ES:
        return this.convertSpanishInteger(num);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private static convertEnglishInteger(num: number): string {
    const data = this.WORD_DATA[ENUM_LANGUAGE.EN];

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
        (rest ? " " + this.convertEnglishInteger(rest) : "")
      );
    }

    return this.convertWithScales(num, ENUM_LANGUAGE.EN);
  }

  private static convertFrenchInteger(num: number): string {
    const data = this.WORD_DATA[ENUM_LANGUAGE.FR];

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
      if (rest) result += " " + this.convertFrenchInteger(rest);
      return result;
    }
    if (num < 2000) {
      const rest = num % 1000;
      if (rest === 0) return "mille";
      return "mille " + this.convertFrenchInteger(rest);
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const rest = num % 1000;
      let result = this.convertFrenchInteger(thousands) + " mille";
      if (rest) result += " " + this.convertFrenchInteger(rest);
      return result;
    }

    return this.convertWithScales(num, ENUM_LANGUAGE.FR);
  }

  private static convertArabicInteger(num: number): string {
    const data = this.WORD_DATA[ENUM_LANGUAGE.AR];

    if (num < 10) return data.ones[num];
    if (num === 10) return "عشرة";
    if (num < 20) return data.teens[num - 10];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      if (ones === 0) return data.tens[tens];
      return data.ones[ones] + " و" + data.tens[tens];
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      return (
        data.hundreds[hundreds] +
        (rest ? " و" + this.convertArabicInteger(rest) : "")
      );
    }

    return this.convertWithScales(num, ENUM_LANGUAGE.AR);
  }

  private static convertSpanishInteger(num: number): string {
    const data = this.WORD_DATA[ENUM_LANGUAGE.ES];

    if (num === 0) return data.zero;
    if (num < 10) return data.ones[num];
    if (num < 20) return data.teens[num - 10];
    if (num < 30) {
      if (num === 20) return data.tens[2];
      const ones = num % 10;
      const base = "veinti";
      // Handle accentuated forms
      const special: Record<number, string> = {
        1: "uno",
        2: "dós",
        3: "trés",
        4: "cuatro",
        5: "cinco",
        6: "séis",
        7: "siete",
        8: "ocho",
        9: "nueve",
      };
      // Standard orthography: veintiuno, veintidós, veintitrés, veintiséis
      const veintiMap: Record<number, string> = {
        1: "veintiuno",
        2: "veintidós",
        3: "veintitrés",
        4: "veinticuatro",
        5: "veinticinco",
        6: "veintiséis",
        7: "veintisiete",
        8: "veintiocho",
        9: "veintinueve",
      };
      return veintiMap[ones] || base + special[ones];
    }
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      return data.tens[tens] + (ones ? " y " + data.ones[ones] : "");
    }
    if (num === 100) return "cien";
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      return (
        data.hundreds[hundreds] +
        (rest ? " " + this.convertSpanishInteger(rest) : "")
      );
    }

    return this.convertSpanishWithScales(num);
  }

  private static convertSpanishWithScales(num: number): string {
    const scales = this.WORD_DATA[ENUM_LANGUAGE.ES].scales;

    for (let i = scales.length - 1; i > 0; i--) {
      const divisor = Math.pow(1000, i);
      if (num >= divisor) {
        const quotient = Math.floor(num / divisor);
        const remainder = num % divisor;

        let head = "";
        if (i === 1) {
          // mil
          head =
            quotient === 1
              ? "mil"
              : this.convertSpanishInteger(quotient) + " mil";
        } else if (i === 2) {
          // millón/millones
          if (quotient === 1) {
            head = "un millón";
          } else {
            head = this.convertSpanishInteger(quotient) + " millones";
          }
        } else if (i === 4) {
          // billón/billones
          if (quotient === 1) {
            head = "un billón";
          } else {
            head = this.convertSpanishInteger(quotient) + " billones";
          }
        } else {
          // i === 3 -> mil millones, others fallback
          head =
            quotient === 1
              ? "mil millones"
              : this.convertSpanishInteger(quotient) + " mil millones";
        }

        const tail = remainder
          ? " " + this.convertSpanishInteger(remainder)
          : "";
        return head + tail;
      }
    }

    return "";
  }

  private static convertWithScales(
    num: number,
    language: ENUM_LANGUAGE
  ): string {
    const data = this.WORD_DATA[language];
    const scales = data.scales;

    for (let i = scales.length - 1; i > 0; i--) {
      const divisor = Math.pow(1000, i);
      if (num >= divisor) {
        const quotient = Math.floor(num / divisor);
        const remainder = num % divisor;

        let quotientWords: string;
        if (language === ENUM_LANGUAGE.AR) {
          quotientWords = this.getArabicScaleWords(quotient, i);
        } else {
          quotientWords = this.convertInteger(quotient, language);
        }

        const scaleWord = this.getScaleWord(quotient, scales[i], language);
        const remainderWords = remainder
          ? this.convertInteger(remainder, language)
          : "";

        if (language === ENUM_LANGUAGE.AR) {
          return quotientWords + (remainderWords ? " و" + remainderWords : "");
        } else {
          // For French, handle "mille" specially (don't put "un" before it)
          if (language === ENUM_LANGUAGE.FR && i === 1 && quotient === 1) {
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
    }

    return "";
  }

  private static getArabicScaleWords(
    quotient: number,
    scaleIndex: number
  ): string {
    const data = this.WORD_DATA[ENUM_LANGUAGE.AR];

    if (scaleIndex === 1) {
      // Thousands
      if (quotient === 1) return "ألف";
      if (quotient === 2) return "ألفان";
      if (quotient <= 10) return data.onesFeminine[quotient] + " آلاف";
      return this.convertArabicInteger(quotient) + " ألف";
    } else if (scaleIndex === 2) {
      // Millions
      if (quotient === 1) return "مليون";
      if (quotient === 2) return "مليونان";
      if (quotient <= 10) return data.onesFeminine[quotient] + " ملايين";
      return this.convertArabicInteger(quotient) + " مليون";
    } else {
      return (
        this.convertArabicInteger(quotient) + " " + data.scales[scaleIndex]
      );
    }
  }

  private static getScaleWord(
    quotient: number,
    scale: string,
    language: ENUM_LANGUAGE
  ): string {
    if (language === ENUM_LANGUAGE.FR && quotient > 1 && scale !== "mille") {
      return scale + "s";
    }
    return scale;
  }
}

// Export convenience functions
export const toWords = (
  num: number,
  language: ENUM_LANGUAGE = ENUM_LANGUAGE.EN
): string => {
  return NumberToWordsConverter.convert(num, { language }).words;
};

export const toEnglish = (num: number): string =>
  toWords(num, ENUM_LANGUAGE.EN);
export const toFrench = (num: number): string => toWords(num, ENUM_LANGUAGE.FR);
export const toArabic = (num: number): string => toWords(num, ENUM_LANGUAGE.AR);
export const toSpanish = (num: number): string =>
  toWords(num, ENUM_LANGUAGE.ES);

export default NumberToWordsConverter;
