/**
 * Test file for Number to Words Library
 * This demonstrates how to test the library functionality
 */

import NumberToWords, {
  toWords,
  toEnglish,
  toFrench,
  toArabic,
} from "./number-to-words";

// Note: These are example tests. To run them, you would need Jest configured.
// Uncomment the describe/test blocks when Jest is set up.

/*
describe('NumberToWords - English', () => {
  test('converts zero', () => {
    expect(toEnglish(0)).toBe('zero');
  });

  test('converts single digits', () => {
    expect(toEnglish(1)).toBe('one');
    expect(toEnglish(5)).toBe('five');
    expect(toEnglish(9)).toBe('nine');
  });

  test('converts teens', () => {
    expect(toEnglish(10)).toBe('ten');
    expect(toEnglish(13)).toBe('thirteen');
    expect(toEnglish(19)).toBe('nineteen');
  });

  test('converts tens', () => {
    expect(toEnglish(20)).toBe('twenty');
    expect(toEnglish(42)).toBe('forty-two');
    expect(toEnglish(99)).toBe('ninety-nine');
  });

  test('converts hundreds', () => {
    expect(toEnglish(100)).toBe('one hundred');
    expect(toEnglish(123)).toBe('one hundred twenty-three');
    expect(toEnglish(999)).toBe('nine hundred ninety-nine');
  });

  test('converts thousands', () => {
    expect(toEnglish(1000)).toBe('one thousand');
    expect(toEnglish(1234)).toBe('one thousand two hundred thirty-four');
  });

  test('converts millions', () => {
    expect(toEnglish(1000000)).toBe('one million');
    expect(toEnglish(1234567)).toBe('one million two hundred thirty-four thousand five hundred sixty-seven');
  });

  test('converts negative numbers', () => {
    expect(toEnglish(-42)).toBe('negative forty-two');
    expect(toEnglish(-1234)).toBe('negative one thousand two hundred thirty-four');
  });

  test('converts decimal numbers', () => {
    expect(toEnglish(3.14)).toBe('three point one four');
    expect(toEnglish(0.5)).toBe('zero point five');
  });
});

describe('NumberToWords - French', () => {
  test('converts zero', () => {
    expect(toFrench(0)).toBe('zéro');
  });

  test('converts single digits', () => {
    expect(toFrench(1)).toBe('un');
    expect(toFrench(5)).toBe('cinq');
    expect(toFrench(9)).toBe('neuf');
  });

  test('converts special French numbers', () => {
    expect(toFrench(70)).toBe('soixante-dix');
    expect(toFrench(80)).toBe('quatre-vingts');
    expect(toFrench(90)).toBe('quatre-vingt-dix');
  });

  test('converts hundreds', () => {
    expect(toFrench(100)).toBe('cent');
    expect(toFrench(200)).toBe('deux cents');
    expect(toFrench(201)).toBe('deux cent un');
  });

  test('converts thousands', () => {
    expect(toFrench(1000)).toBe('mille');
    expect(toFrench(2000)).toBe('deux mille');
  });

  test('converts millions', () => {
    expect(toFrench(1000000)).toBe('un million');
    expect(toFrench(2000000)).toBe('deux millions');
  });

  test('converts negative numbers', () => {
    expect(toFrench(-42)).toBe('moins quarante-deux');
  });
});

describe('NumberToWords - Arabic', () => {
  test('converts zero', () => {
    expect(toArabic(0)).toBe('صفر');
  });

  test('converts single digits', () => {
    expect(toArabic(1)).toBe('واحد');
    expect(toArabic(5)).toBe('خمسة');
    expect(toArabic(9)).toBe('تسعة');
  });

  test('converts tens', () => {
    expect(toArabic(10)).toBe('عشرة');
    expect(toArabic(20)).toBe('عشرون');
  });

  test('converts hundreds', () => {
    expect(toArabic(100)).toBe('مائة');
    expect(toArabic(200)).toBe('مئتان');
  });

  test('converts thousands', () => {
    expect(toArabic(1000)).toBe('ألف');
    expect(toArabic(2000)).toBe('ألفان');
  });

  test('converts millions', () => {
    expect(toArabic(1000000)).toBe('مليون');
    expect(toArabic(2000000)).toBe('مليونان');
  });

  test('converts negative numbers', () => {
    expect(toArabic(-42)).toContain('سالب');
  });
});

describe('NumberToWords.convert', () => {
  test('returns ConversionResult object', () => {
    const result = NumberToWords.convert(42, { language: 'en' });
    expect(result).toHaveProperty('words');
    expect(result).toHaveProperty('language');
    expect(result).toHaveProperty('number');
    expect(result.language).toBe('en');
    expect(result.number).toBe(42);
  });

  test('throws error for invalid input', () => {
    expect(() => NumberToWords.convert(Infinity)).toThrow('Input must be a finite number');
    expect(() => NumberToWords.convert(NaN)).toThrow('Input must be a finite number');
  });

  test('throws error for numbers that are too large', () => {
    expect(() => NumberToWords.convert(10e15)).toThrow('Number too large');
  });
});

describe('toWords convenience function', () => {
  test('works with all languages', () => {
    expect(toWords(42, 'en')).toBe(toEnglish(42));
    expect(toWords(42, 'fr')).toBe(toFrench(42));
    expect(toWords(42, 'ar')).toBe(toArabic(42));
  });

  test('defaults to English', () => {
    expect(toWords(42)).toBe(toEnglish(42));
  });
});
*/

// Example manual tests that can be run without Jest
console.log("=== Number to Words Library - Manual Tests ===\n");

console.log("English Tests:");
console.log("0 =>", toEnglish(0));
console.log("42 =>", toEnglish(42));
console.log("123 =>", toEnglish(123));
console.log("1234 =>", toEnglish(1234));
console.log("1000000 =>", toEnglish(1000000));
console.log("-567 =>", toEnglish(-567));
console.log("3.14 =>", toEnglish(3.14));

console.log("\nFrench Tests:");
console.log("0 =>", toFrench(0));
console.log("42 =>", toFrench(42));
console.log("70 =>", toFrench(70));
console.log("80 =>", toFrench(80));
console.log("1000 =>", toFrench(1000));
console.log("1000000 =>", toFrench(1000000));

console.log("\nArabic Tests:");
console.log("0 =>", toArabic(0));
console.log("42 =>", toArabic(42));
console.log("100 =>", toArabic(100));
console.log("1000 =>", toArabic(1000));
console.log("1000000 =>", toArabic(1000000));

console.log("\n=== All manual tests completed ===");
