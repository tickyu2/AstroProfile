// ============================================
// ACCURATE CHINESE ZODIAC CALCULATOR
// Includes: Yin/Yang polarity, Elements, Animals, Chinese New Year precision
// ============================================

const chineseZodiacCalculator = {
  
  // Chinese New Year dates (1900-2030) - [month, day]
  chineseNewYear: {
    1900: [1, 31], 1901: [2, 19], 1902: [2, 8], 1903: [1, 29], 1904: [2, 16],
    1905: [2, 4], 1906: [1, 25], 1907: [2, 13], 1908: [2, 2], 1909: [1, 22],
    1910: [2, 10], 1911: [1, 30], 1912: [2, 18], 1913: [2, 6], 1914: [1, 26],
    1915: [2, 14], 1916: [2, 3], 1917: [1, 23], 1918: [2, 11], 1919: [2, 1],
    1920: [2, 20], 1921: [2, 8], 1922: [1, 28], 1923: [2, 16], 1924: [2, 5],
    1925: [1, 24], 1926: [2, 13], 1927: [2, 2], 1928: [1, 23], 1929: [2, 10],
    1930: [1, 30], 1931: [2, 17], 1932: [2, 6], 1933: [1, 26], 1934: [2, 14],
    1935: [2, 4], 1936: [1, 24], 1937: [2, 11], 1938: [1, 31], 1939: [2, 19],
    1940: [2, 8], 1941: [1, 27], 1942: [2, 15], 1943: [2, 5], 1944: [1, 25],
    1945: [2, 13], 1946: [2, 2], 1947: [1, 22], 1948: [2, 10], 1949: [1, 29],
    1950: [2, 17], 1951: [2, 6], 1952: [1, 27], 1953: [2, 14], 1954: [2, 3],
    1955: [1, 24], 1956: [2, 12], 1957: [1, 31], 1958: [2, 18], 1959: [2, 8],
    1960: [1, 28], 1961: [2, 15], 1962: [2, 5], 1963: [1, 25], 1964: [2, 13],
    1965: [2, 2], 1966: [1, 21], 1967: [2, 9], 1968: [1, 30], 1969: [2, 17],
    1970: [2, 6], 1971: [1, 27], 1972: [2, 15], 1973: [2, 3], 1974: [1, 23],
    1975: [2, 11], 1976: [1, 31], 1977: [2, 18], 1978: [2, 7], 1979: [1, 28],
    1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2],
    1985: [2, 20], 1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6],
    1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
    1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
    2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
    2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
    2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
    2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
    2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
    2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
    2030: [2, 3]
  },

  // Heavenly Stems (10-year cycle)
  heavenlyStems: [
    { element: "Metal", polarity: "Yang" },  // 0
    { element: "Metal", polarity: "Yin" },   // 1
    { element: "Water", polarity: "Yang" },  // 2
    { element: "Water", polarity: "Yin" },   // 3
    { element: "Wood", polarity: "Yang" },   // 4
    { element: "Wood", polarity: "Yin" },    // 5
    { element: "Fire", polarity: "Yang" },   // 6
    { element: "Fire", polarity: "Yin" },    // 7
    { element: "Earth", polarity: "Yang" },  // 8
    { element: "Earth", polarity: "Yin" }    // 9
  ],

  // Earthly Branches (12-year cycle)
  earthlyBranches: [
    { animal: "Monkey", emoji: "🐒" },  // 0
    { animal: "Rooster", emoji: "🐓" }, // 1
    { animal: "Dog", emoji: "🐕" },     // 2
    { animal: "Pig", emoji: "🐖" },     // 3
    { animal: "Rat", emoji: "🐀" },     // 4
    { animal: "Ox", emoji: "🐂" },      // 5
    { animal: "Tiger", emoji: "🐅" },   // 6
    { animal: "Rabbit", emoji: "🐇" },  // 7
    { animal: "Dragon", emoji: "🐉" },  // 8
    { animal: "Snake", emoji: "🐍" },   // 9
    { animal: "Horse", emoji: "🐴" },   // 10
    { animal: "Goat", emoji: "🐐" }     // 11
  ],

  /**
   * Calculate Chinese zodiac with Yin/Yang polarity
   * @param {number} year - Birth year
   * @param {number} month - Birth month (1-12)
   * @param {number} day - Birth day (1-31)
   */
  calculate(year, month, day) {
    // Determine which Chinese zodiac year
    let chineseYear = year;
    
    // Check if birth date is before Chinese New Year
    if (this.chineseNewYear[year]) {
      const [cnyMonth, cnyDay] = this.chineseNewYear[year];
      const birthDate = new Date(year, month - 1, day);
      const cnyDate = new Date(year, cnyMonth - 1, cnyDay);
      
      // If born before Chinese New Year, use previous year
      if (birthDate < cnyDate) {
        chineseYear = year - 1;
      }
    }

    // Calculate Heavenly Stem index (10-year cycle)
    const stemIndex = (chineseYear - 4) % 10;
    const stem = this.heavenlyStems[stemIndex];

    // Calculate Earthly Branch index (12-year cycle)
    const branchIndex = (chineseYear - 4) % 12;
    const branch = this.earthlyBranches[branchIndex];

    // Full name with Yin/Yang
    const fullName = `${stem.polarity} ${stem.element} ${branch.animal}`;
    const shortName = `${stem.element} ${branch.animal}`;

    return {
      chineseYear,
      polarity: stem.polarity,
      element: stem.element,
      animal: branch.animal,
      emoji: branch.emoji,
      fullName,
      shortName
    };
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = chineseZodiacCalculator;
}
