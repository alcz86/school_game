const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const zdania = require('../dane/zdania.js');

// ---------------------------------------------------------------------------
// PO CO TEN PLIK
//
// `dane/zdania.js` to wykonanie dokumentu, który zatwierdził człowiek (matka).
// Do tej pory NIC tych dwóch rzeczy nie wiązało: recenzent pokazał pięcioma
// mutacjami, że można podmienić zdanie, zmienić poprawną odpowiedź na taką,
// której nie ma wśród dystraktorów, zamienić dystraktor w drugą poprawną
// odpowiedź, wpisać nieprawdziwą regułę do wyjaśnienia albo przenumerować unit —
// i CAŁY zestaw testów przechodził na zielono. To dokładnie ta klasa błędu,
// która w tym projekcie kosztowała już cztery razy: dane cicho rozjeżdżają się
// z tym, co zatwierdził człowiek.
//
// Ten test parsuje oba dokumenty źródłowe i porównuje POLE PO POLU:
// zdanie, poprawna odpowiedź, komplet dystraktorów (jako zbiór — kolejność
// w dokumencie nie jest wiążąca), wyjaśnienie i numer unitu.
//
// Wyjaśnienia porównujemy DOSŁOWNIE, nie „po treści merytorycznej". Przy
// poprawianiu polskich znaków (P1) zsynchronizowano oba dokumenty z danymi,
// więc jedno źródło prawdy istnieje i nie trzeba luźnego dopasowania —
// a dosłowne porównanie łapie także literówkę, której dopasowanie „po treści"
// by nie zauważyło.
// ---------------------------------------------------------------------------

const KATALOG = path.join(__dirname, '..', 'docs');
const DOKUMENTY = [
  'zdania-klasa3-do-zatwierdzenia.md',
  'zdania-klasa3-partia2-do-zatwierdzenia.md',
];

// Pozycje przepisane z podręcznika, ale ŚWIADOMIE niewdrożone do gry.
// Lista jest jawna i opisana, bo to jedyne dopuszczalne rozjechanie się
// dokumentu z danymi — każde inne ma być błędem testu.
const SWIADOMIE_POMINIETE = new Map([
  ['An unhappy uncle ____ an umbrella.',
    'Phonics Fun bez orzeczenia — żadna z opcji nie tworzy pełnego zdania (P3, recenzja 2026-09-08)'],
  ['A happy man with a map ____ his lap.',
    'Phonics Fun bez orzeczenia — żadna z opcji nie tworzy pełnego zdania (P3, recenzja 2026-09-08)'],
  ['It ____ got a toothache.',
    'w podręczniku kolorowy prostokąt zamiast słowa — rekonstrukcja, nie przepisanie; matka wyłączyła'],
]);

// Blok dokumentu ma stały kształt (patrz dowolny fragment docs/*.md):
//   unit: 3 | strona 31
//   zdanie:      There ____ any old gadgets in this museum.
//   poprawnie:   aren't
//   dystraktory: isn't · am not · hasn't
//   wyjasnienie: ...
//   sprawdzenie: ...
// Parsujemy liniowo, a nie jednym wielkim regexem, żeby komunikat błędu mógł
// wskazać numer linii — bez tego „coś się rozjechało" jest bezużyteczne.
function parsujDokument(nazwaPliku) {
  const linie = fs.readFileSync(path.join(KATALOG, nazwaPliku), 'utf8').split('\n');
  const pozycje = [];
  let biezaca = null;
  for (let i = 0; i < linie.length; i++) {
    const linia = linie[i];
    const mUnit = linia.match(/^unit:\s*(\d+)\s*\|/);
    if (mUnit) {
      biezaca = { unit: Number(mUnit[1]), plik: nazwaPliku, linia: i + 1 };
      continue;
    }
    if (!biezaca) continue;
    const mZdanie = linia.match(/^zdanie:\s+(.*\S)\s*$/);
    if (mZdanie) { biezaca.zdanie = mZdanie[1]; continue; }
    const mOdp = linia.match(/^poprawnie:\s+(.*\S)\s*$/);
    if (mOdp) { biezaca.odpowiedz = mOdp[1]; continue; }
    const mDys = linia.match(/^dystraktory:\s+(.*\S)\s*$/);
    if (mDys) { biezaca.dystraktory = mDys[1].split('·').map((d) => d.trim()); continue; }
    const mWyj = linia.match(/^wyjasnienie:\s+(.*\S)\s*$/);
    if (mWyj) {
      biezaca.wyjasnienie = mWyj[1];
      // `wyjasnienie` jest ostatnim polem, które nas interesuje — blok zamykamy tutaj,
      // żeby `sprawdzenie` (proza, nieporównywana) nie musiało być parsowane.
      pozycje.push(biezaca);
      biezaca = null;
    }
  }
  return pozycje;
}

const zDokumentow = DOKUMENTY.flatMap(parsujDokument);
const wGrze = zdania.ZESTAWY.find((z) => z.id === 'zdania-klasa3').zdania;
const wGrzePo = new Map(wGrze.map((z) => [z.zdanie, z]));

test('parser dokumentów w ogóle coś znajduje (strażnik samego testu)', () => {
  // Bez tego cichy rozjazd formatu dokumentu (np. zmiana nagłówka bloku)
  // zamieniłby cały ten plik w test, który nie sprawdza NICZEGO i świeci na zielono.
  assert.ok(zDokumentow.length >= 90,
    `parser wyciągnął tylko ${zDokumentow.length} pozycji — format dokumentu się zmienił?`);
  for (const p of zDokumentow) {
    assert.ok(p.zdanie, `blok bez zdania: ${p.plik}:${p.linia}`);
    assert.ok(p.odpowiedz, `blok bez poprawnej odpowiedzi: ${p.plik}:${p.linia}`);
    assert.ok(p.dystraktory && p.dystraktory.length === 3,
      `blok bez trzech dystraktorów: ${p.plik}:${p.linia}`);
    assert.ok(p.wyjasnienie, `blok bez wyjaśnienia: ${p.plik}:${p.linia}`);
  }
});

test('każde zdanie z dokumentów jest w grze — albo jawnie z niej wyłączone', () => {
  for (const p of zDokumentow) {
    if (SWIADOMIE_POMINIETE.has(p.zdanie)) continue;
    assert.ok(wGrzePo.has(p.zdanie),
      `zdanie z ${p.plik}:${p.linia} nie trafiło do gry: "${p.zdanie}". ` +
      'Albo dopisz je do dane/zdania.js, albo wpisz na listę SWIADOMIE_POMINIETE z powodem.');
  }
});

test('żadne zdanie w grze nie jest wymyślone poza dokumentami', () => {
  // Odwrotny kierunek. Bez niego można by dopisać do gry dowolne zdanie
  // spoza materiału, którego matka nigdy nie widziała.
  const wDokumentach = new Set(zDokumentow.map((p) => p.zdanie));
  for (const z of wGrze) {
    assert.ok(wDokumentach.has(z.zdanie),
      `zdanie "${z.zdanie}" jest w grze, ale nie ma go w żadnym zatwierdzonym dokumencie`);
  }
});

test('zdania wyłączone z gry naprawdę w niej nie są', () => {
  for (const [zdanie, powod] of SWIADOMIE_POMINIETE) {
    assert.ok(!wGrzePo.has(zdanie), `"${zdanie}" wróciło do gry, a miało zostać poza nią: ${powod}`);
  }
});

test('pole po polu: odpowiedź, dystraktory, wyjaśnienie i unit zgadzają się z dokumentem', () => {
  for (const p of zDokumentow) {
    if (SWIADOMIE_POMINIETE.has(p.zdanie)) continue;
    const z = wGrzePo.get(p.zdanie);
    if (!z) continue;   // brak zdania raportuje osobny test wyżej
    const gdzie = `"${p.zdanie}" (${p.plik}:${p.linia})`;

    assert.strictEqual(z.odpowiedz, p.odpowiedz,
      `pole "odpowiedz" rozjechało się z dokumentem w ${gdzie}: ` +
      `w grze "${z.odpowiedz}", w dokumencie "${p.odpowiedz}"`);

    // Kolejność dystraktorów w grze i tak jest tasowana przy budowie pytania,
    // więc wiążący jest ZBIÓR, nie kolejność.
    assert.deepStrictEqual([...z.dystraktory].sort(), [...p.dystraktory].sort(),
      `pole "dystraktory" rozjechało się z dokumentem w ${gdzie}: ` +
      `w grze [${z.dystraktory}], w dokumencie [${p.dystraktory}]`);

    assert.strictEqual(z.wyjasnienie, p.wyjasnienie,
      `pole "wyjasnienie" rozjechało się z dokumentem w ${gdzie}: ` +
      `w grze "${z.wyjasnienie}", w dokumencie "${p.wyjasnienie}"`);

    assert.strictEqual(z.unit, p.unit,
      `pole "unit" rozjechało się z dokumentem w ${gdzie}: ` +
      `w grze ${z.unit}, w dokumencie ${p.unit}`);
  }
});

test('liczby się zgadzają: 44 z partii 1 + 45 z partii 2 = 89 zdań w grze', () => {
  const partia1 = parsujDokument(DOKUMENTY[0]);
  const partia2 = parsujDokument(DOKUMENTY[1]);
  const wdrozone = (lista) => lista.filter((p) => !SWIADOMIE_POMINIETE.has(p.zdanie)).length;
  assert.strictEqual(partia1.length, 46, 'partia 1 opisuje 46 przepisanych pozycji');
  assert.strictEqual(partia2.length, 46, 'partia 2 opisuje 46 przepisanych pozycji');
  assert.strictEqual(wdrozone(partia1), 44, 'z partii 1 wchodzą 44 (minus dwa Phonics Fun)');
  assert.strictEqual(wdrozone(partia2), 45, 'z partii 2 wchodzi 45 (minus toothache)');
  assert.strictEqual(wGrze.length, 89);
});
