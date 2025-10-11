import { LanguageData, LanguageConverter, LanguageModule } from "./types";

const data: LanguageData = {
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
  scales: ["", "mil", "millón", "mil millones", "billón"],
  hundred: "cien",
  zero: "cero",
  negative: "menos",
  point: "coma",
};

class SpanishConverter implements LanguageConverter {
  convertInteger(num: number): string {
    if (num === 0) return data.zero;
    if (num < 10) return data.ones[num];
    if (num < 20) return data.teens[num - 10];
    if (num < 30) {
      if (num === 20) return data.tens[2];
      const ones = num % 10;
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
      return veintiMap[ones] || "veinti" + data.ones[ones];
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
      const hundredWord =
        hundreds === 1
          ? "ciento"
          : hundreds === 5
          ? "quinientos"
          : hundreds === 7
          ? "setecientos"
          : hundreds === 9
          ? "novecientos"
          : data.ones[hundreds] + "cientos";
      return hundredWord + (rest ? " " + this.convertInteger(rest) : "");
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

        let head = "";
        if (i === 1) {
          // mil
          head =
            quotient === 1 ? "mil" : this.convertInteger(quotient) + " mil";
        } else if (i === 2) {
          // millón/millones
          if (quotient === 1) {
            head = "un millón";
          } else {
            head = this.convertInteger(quotient) + " millones";
          }
        } else if (i === 4) {
          // billón/billones
          if (quotient === 1) {
            head = "un billón";
          } else {
            head = this.convertInteger(quotient) + " billones";
          }
        } else {
          // i === 3 -> mil millones, others fallback
          head =
            quotient === 1
              ? "mil millones"
              : this.convertInteger(quotient) + " mil millones";
        }

        const tail = remainder ? " " + this.convertInteger(remainder) : "";
        return head + tail;
      }
    }

    return "";
  }
}

export const spanishModule: LanguageModule = {
  code: "es",
  data,
  converter: new SpanishConverter(),
};
