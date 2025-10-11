import { LanguageData, LanguageConverter, LanguageModule } from "./types";

const data: LanguageData = {
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
  teens: [
    "عشرة",
    "أحد عشر",
    "اثنا عشر",
    "ثلاثة عشر",
    "أربعة عشر",
    "خمسة عشر",
    "ستة عشر",
    "سبعة عشر",
    "ثمانية عشر من",
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
};

class ArabicConverter implements LanguageConverter {
  convertInteger(num: number): string {
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
        data.hundreds![hundreds] +
        (rest ? " و" + this.convertInteger(rest) : "")
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

        const quotientWords = this.getScaleWords(quotient, i);
        const remainderWords = remainder ? this.convertInteger(remainder) : "";

        return quotientWords + (remainderWords ? " و" + remainderWords : "");
      }
    }

    return "";
  }

  getScaleWords(quotient: number, scaleIndex: number): string {
    if (scaleIndex === 1) {
      // Thousands
      if (quotient === 1) return "ألف";
      if (quotient === 2) return "ألفان";
      if (quotient <= 10) return data.ones[quotient] + " آلاف";
      return this.convertInteger(quotient) + " ألف";
    } else if (scaleIndex === 2) {
      // Millions
      if (quotient === 1) return "مليون";
      if (quotient === 2) return "مليونان";
      if (quotient <= 10) return data.ones[quotient] + " ملايين";
      return this.convertInteger(quotient) + " مليون";
    } else {
      return this.convertInteger(quotient) + " " + data.scales[scaleIndex];
    }
  }
}

export const arabicModule: LanguageModule = {
  code: "ar",
  data,
  converter: new ArabicConverter(),
};
