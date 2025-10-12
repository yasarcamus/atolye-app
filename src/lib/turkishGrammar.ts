// Türkçe dilbilgisi kuralları - İyelik eki ekleme

/**
 * Türkçe iyelik eki ekler (possessive suffix)
 * Örnek: "Ahmet" -> "Ahmet'in", "Yasar" -> "Yasar'ın"
 */
export function addPossessiveSuffix(name: string): string {
  if (!name) return '';
  
  const lastChar = name.toLowerCase().slice(-1);
  
  // Sesli harfler
  const vowels = {
    a: "'ın",
    e: "'in",
    ı: "'ın",
    i: "'in",
    o: "'un",
    ö: "'ün",
    u: "'un",
    ü: "'ün"
  };
  
  // Son harf sesli ise
  if (vowels[lastChar as keyof typeof vowels]) {
    return name + vowels[lastChar as keyof typeof vowels];
  }
  
  // Son harf sessiz ise - kelimeyi analiz et
  // Kalın ünlüler (a, ı, o, u) için 'ın veya 'un
  // İnce ünlüler (e, i, ö, ü) için 'in veya 'ün
  
  const nameVowels = name.toLowerCase().match(/[aeıioöuü]/g) || [];
  const lastVowel = nameVowels[nameVowels.length - 1];
  
  if (!lastVowel) return name + "'in"; // Varsayılan
  
  // Kalın ünlüler
  if (['a', 'ı'].includes(lastVowel)) {
    return name + "'ın";
  }
  // Yuvarlak kalın ünlüler
  if (['o', 'u'].includes(lastVowel)) {
    return name + "'un";
  }
  // İnce düz ünlüler
  if (['e', 'i'].includes(lastVowel)) {
    return name + "'in";
  }
  // Yuvarlak ince ünlüler
  if (['ö', 'ü'].includes(lastVowel)) {
    return name + "'ün";
  }
  
  return name + "'in"; // Varsayılan
}

/**
 * Test fonksiyonu
 */
export function testPossessiveSuffix() {
  const tests = [
    { name: 'Ahmet', expected: "Ahmet'in" },
    { name: 'Yasar', expected: "Yasar'ın" },
    { name: 'Mehmet', expected: "Mehmet'in" },
    { name: 'Ayşe', expected: "Ayşe'nin" },
    { name: 'Fatma', expected: "Fatma'nın" },
    { name: 'Ali', expected: "Ali'nin" },
    { name: 'Veli', expected: "Veli'nin" },
    { name: 'Zeynep', expected: "Zeynep'in" },
    { name: 'Gözlük', expected: "Gözlük'ün" },
    { name: 'Osman', expected: "Osman'ın" },
    { name: 'Ömer', expected: "Ömer'in" },
    { name: 'Ümit', expected: "Ümit'in" },
  ];
  
  console.log('Türkçe İyelik Eki Testleri:');
  tests.forEach(test => {
    const result = addPossessiveSuffix(test.name);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.name} -> ${result} (Beklenen: ${test.expected})`);
  });
}
