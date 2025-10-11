# Number to Words Converter

A TypeScript library to convert numbers to words in multiple languages.

## Installation

```bash
npm install number-to-words-i18n
```

or

```bash
yarn add number-to-words-i18n
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
