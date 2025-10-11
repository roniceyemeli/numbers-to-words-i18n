# Number to Words Converter

A TypeScript library to convert numbers to words in multiple languages with a modular, extensible architecture.

## Installation

```bash
npm install numbers-to-words-i18n
```

or

```bash
yarn add numbers-to-words-i18n
```

## Usage

```ts
import {
  toEnglish,
  toFrench,
  toArabic,
  toSpanish,
  ENUM_LANGUAGE,
  toWords,
} from "numbers-to-words-i18n";

console.log(toEnglish(123)); // "one hundred twenty-three"
console.log(toFrench(71)); // "soixante et onze"
console.log(toArabic(25)); // "خمسة وعشرون"
console.log(toSpanish(2024)); // "dos mil veinticuatro"

// Generic API
console.log(toWords(42, ENUM_LANGUAGE.EN)); // "forty-two"
console.log(toWords(42, ENUM_LANGUAGE.FR)); // "quarante-deux"
console.log(toWords(42, ENUM_LANGUAGE.AR)); // "اثنان وأربعون"
console.log(toWords(42, ENUM_LANGUAGE.ES)); // "cuarenta y dos"
```

## Supported Languages

- **English (en)**: Complete number conversion with proper grammar
- **French (fr)**: Includes special cases like "soixante-dix", "quatre-vingts"
- **Arabic (ar)**: Handles masculine/feminine forms and Arabic numerals
- **Spanish (es)**: Supports "veinti" forms and proper Spanish grammar

## Architecture

The library uses a modular architecture where each language is implemented as a separate module:

```
src/
├── lang/
│   ├── types.ts      # Common interfaces
│   ├── en.ts         # English implementation
│   ├── fr.ts         # French implementation
│   ├── ar.ts         # Arabic implementation
│   ├── es.ts         # Spanish implementation
│   └── index.ts      # Registry and main converter
└── index.ts          # Public API exports
```

## Adding New Languages

To add a new language, create a new module following the pattern:

```ts
// src/lang/your-lang.ts
import { LanguageData, LanguageConverter, LanguageModule } from './types';

const data: LanguageData = {
    ones: ['', 'one', 'two', ...],
    teens: ['ten', 'eleven', ...],
    tens: ['', '', 'twenty', ...],
    scales: ['', 'thousand', 'million', ...],
    zero: 'zero',
    negative: 'negative',
    point: 'point'
};

class YourLanguageConverter implements LanguageConverter {
    convertInteger(num: number): string {
        // Implementation
    }

    convertWithScales(num: number): string {
        // Implementation
    }
}

export const yourLanguageModule: LanguageModule = {
    code: 'your-lang',
    data,
    converter: new YourLanguageConverter()
};
```

Then register it in `src/lang/index.ts`:

```ts
import { yourLanguageModule } from './your-lang';

// Add to ENUM_LANGUAGE
export enum ENUM_LANGUAGE {
    // ... existing languages
    YOUR_LANG = 'your-lang',
}

// Add to registry
private static readonly modules: Map<string, LanguageModule> = new Map([
    // ... existing modules
    [ENUM_LANGUAGE.YOUR_LANG, yourLanguageModule],
]);

// Add convenience function
export const toYourLanguage = (num: number): string => toWords(num, ENUM_LANGUAGE.YOUR_LANG);
```
