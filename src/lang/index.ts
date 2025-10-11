import { LanguageModule } from "./types";
import { englishModule } from "./en";
import { frenchModule } from "./fr";
import { arabicModule } from "./ar";
import { spanishModule } from "./es";

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

class LanguageRegistry {
  private static readonly modules: Map<string, LanguageModule> = new Map([
    [ENUM_LANGUAGE.EN, englishModule],
    [ENUM_LANGUAGE.FR, frenchModule],
    [ENUM_LANGUAGE.AR, arabicModule],
    [ENUM_LANGUAGE.ES, spanishModule],
  ]);

  static getModule(language: ENUM_LANGUAGE): LanguageModule {
    const module = this.modules.get(language);
    if (!module) {
      throw new Error(`Unsupported language: ${language}`);
    }
    return module;
  }

  static getSupportedLanguages(): ENUM_LANGUAGE[] {
    return Array.from(this.modules.keys()) as ENUM_LANGUAGE[];
  }

  static registerModule(module: LanguageModule): void {
    this.modules.set(module.code, module);
  }
}

class NumberToWordsConverter {
  private static readonly MAX_SAFE_NUMBER = 999999999999999;

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
      const module = LanguageRegistry.getModule(language);
      return module.data.zero;
    }

    if (num < 0) {
      const module = LanguageRegistry.getModule(language);
      const negativeWord = module.data.negative;
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
    const module = LanguageRegistry.getModule(language);
    const pointWord = module.data.point;

    // Convert integer part - handle zero case properly
    let integerWords: string;
    const integerValue = parseInt(intPart);
    if (integerValue === 0) {
      integerWords = module.data.zero;
    } else {
      integerWords = this.convertInteger(integerValue, language);
    }

    // Add negative prefix if needed
    if (num < 0) {
      integerWords = `${module.data.negative} ${integerWords}`;
    }

    // Convert decimal part
    const decimalDigits = decPart
      .split("")
      .map((d) => {
        const digit = parseInt(d);
        if (digit === 0) {
          return module.data.zero;
        }
        return module.data.ones[digit];
      })
      .join(" ");

    return `${integerWords} ${pointWord} ${decimalDigits}`;
  }

  private static convertInteger(num: number, language: ENUM_LANGUAGE): string {
    const module = LanguageRegistry.getModule(language);
    return module.converter.convertInteger(num);
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

export { LanguageRegistry, NumberToWordsConverter };
export default NumberToWordsConverter;
