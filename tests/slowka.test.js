const test = require('node:test');
const assert = require('node:assert');
const s = require('../dane/slowka.js');

test('istnieje zestaw powtórkowy z klasy 2', () => {
  const z = s.ZESTAWY.find((x) => x.id === 'klasa2-powtorka');
  assert.ok(z, 'brak zestawu klasa2-powtorka');
  assert.strictEqual(z.klasa, 2);
  assert.ok(z.slowa.length >= 40, `za mało słów: ${z.slowa.length}`);
});

test('każde słowo ma niepuste pl i en', () => {
  for (const z of s.ZESTAWY) {
    for (const w of z.slowa) {
      assert.ok(w.pl && w.pl.trim(), `puste pl przy "${w.en}" w ${z.id}`);
      assert.ok(w.en && w.en.trim(), `puste en przy "${w.pl}" w ${z.id}`);
    }
  }
});

test('w obrębie zestawu nie ma duplikatów po stronie angielskiej', () => {
  for (const z of s.ZESTAWY) {
    const en = z.slowa.map((w) => w.en.toLowerCase());
    assert.strictEqual(new Set(en).size, en.length, `duplikaty en w ${z.id}`);
  }
});

test('tryb wybor daje 4 różne warianty zawierające poprawną odpowiedź', () => {
  for (const p of s.generuj('klasa2-powtorka', 20, 'wybor')) {
    assert.strictEqual(p.warianty.length, 4);
    assert.strictEqual(new Set(p.warianty).size, 4, 'warianty się powtarzają');
    assert.ok(p.warianty.includes(p.odpowiedz), 'brak poprawnej wśród wariantów');
  }
});

test('tryb wpisywanie nie podaje wariantów', () => {
  for (const p of s.generuj('klasa2-powtorka', 5, 'wpisywanie')) {
    assert.strictEqual(p.warianty, null);
  }
});

test('każde słowo ma numer rozdziału', () => {
  for (const z of s.ZESTAWY) {
    for (const w of z.slowa) {
      // unit === 0 jest POPRAWNY i celowy: to materiał przekrojowy spoza rozdziałów
      // (sekcja "Hello" ze słowniczka — liczby 1-20, przyimki, meble klasowe).
      // Numeracja rozdziałów pochodzi z podręcznika, więc Unit 1 w grze musi być
      // Unitem 1 z książki. NIE zmieniaj tego z powrotem na `>= 1`.
      assert.ok(Number.isInteger(w.unit) && w.unit >= 0, `zły unit przy "${w.en}" w ${z.id}`);
    }
  }
});

test('rozdzialy zwraca posortowaną listę bez duplikatów', () => {
  const r = s.rozdzialy('klasa2-powtorka');
  assert.ok(r.length >= 2, `oczekiwano wielu rozdziałów, było ${r.length}`);
  assert.deepStrictEqual(r, Array.from(new Set(r)).sort((a, b) => a - b));
});

test('zakres tylko:N daje wyłącznie slowa z rozdzialu N', () => {
  const zestaw = s.ZESTAWY.find((z) => z.id === 'klasa2-powtorka');
  const n = s.rozdzialy('klasa2-powtorka')[1];
  const dozwolone = new Set(zestaw.slowa.filter((w) => w.unit === n).map((w) => w.en));
  for (const p of s.generuj('klasa2-powtorka', 20, 'wybor', null, { tylko: n })) {
    assert.ok(dozwolone.has(p.odpowiedz), `"${p.odpowiedz}" spoza rozdzialu ${n}`);
    for (const w of p.warianty) {
      assert.ok(dozwolone.has(w), `wariant "${w}" spoza rozdzialu ${n}`);
    }
  }
});

test('zakres do:N daje slowa z rozdzialow 1..N i nic ponad', () => {
  const zestaw = s.ZESTAWY.find((z) => z.id === 'klasa2-powtorka');
  const rozdzialy = s.rozdzialy('klasa2-powtorka');
  const n = rozdzialy[rozdzialy.length - 2];
  const dozwolone = new Set(zestaw.slowa.filter((w) => w.unit <= n).map((w) => w.en));
  const uzyte = new Set();
  for (const p of s.generuj('klasa2-powtorka', 40, 'wybor', null, { do: n })) {
    assert.ok(dozwolone.has(p.odpowiedz), `"${p.odpowiedz}" spoza zakresu 1..${n}`);
    for (const w of p.warianty) {
      assert.ok(dozwolone.has(w), `wariant "${w}" spoza zakresu 1..${n}`);
    }
    uzyte.add(p.odpowiedz);
  }
  assert.ok(uzyte.size > 1, 'zakres kumulacyjny powinien mieszać materiał z wielu rozdziałów');
});

// --- przypadki brzegowe ---
//
// Poniższe testy blokują zachowania, które łatwo "uprościć" z powrotem do wersji
// ze szkieletu briefu. Konsekwencją takiego uproszczenia byłaby gra zawieszona
// dziecku w trakcie rundy albo po cichu zignorowany wybór rozdziału.

const zestawPowtorka = s.ZESTAWY.find((z) => z.id === 'klasa2-powtorka');
const unitPo = new Map(zestawPowtorka.slowa.map((w) => [w.en, w.unit]));

// `ile` > liczby słów w puli sprawia, że generator przechodzi przez CAŁĄ pulę
// (indeks cykluje przez `i % pula.length`). Dzięki temu testy zakresu poniżej są
// deterministyczne mimo losowania: gdyby filtr przepuścił cały zestaw, słowo
// z rozdziału 8 pojawiłoby się na pewno, a nie tylko czasem.
const DUZO = 200;

test('zakres z mniej niż 4 słowami nie zapętla się i zwraca tyle wariantów, ile się da', () => {
  s.ZESTAWY.push({
    id: 'test-maly',
    nazwa: 'test',
    klasa: 9,
    slowa: [
      { pl: 'a', en: 'aa', unit: 1 },
      { pl: 'b', en: 'bb', unit: 1 },
    ],
  });
  try {
    const pytania = s.generuj('test-maly', 5, 'wybor');
    assert.strictEqual(pytania.length, 5, 'generator ma oddać żądaną liczbę pytań');
    for (const p of pytania) {
      assert.strictEqual(p.warianty.length, 2, 'przy 2 słowach mają być 2 warianty, nie 4');
      assert.strictEqual(new Set(p.warianty).size, 2, 'warianty nie mogą się powtarzać');
      assert.ok(p.warianty.includes(p.odpowiedz), 'poprawna odpowiedź musi być wśród wariantów');
    }
  } finally {
    // ZESTAWY jest współdzielone między testami — sprzątamy, żeby nie zatruć reszty pliku.
    s.ZESTAWY.pop();
  }
});

test('nieistniejący zestaw i pusty zakres zwracają pustą tablicę, nie wybuchają', () => {
  assert.deepStrictEqual(s.generuj('nie-ma-takiego', 5, 'wybor'), []);
  assert.deepStrictEqual(s.generuj('nie-ma-takiego', 5, 'wpisywanie'), []);
  assert.deepStrictEqual(s.generuj('klasa2-powtorka', 5, 'wybor', null, { tylko: 99 }), []);
  assert.deepStrictEqual(s.rozdzialy('nie-ma-takiego'), []);
});

test('zakres podany stringiem znaczy to samo co liczbą (wartości z DOM są stringami)', () => {
  // `<select>.value` i `dataset.*` zawsze zwracają string. Gdyby koercji nie było,
  // te wywołania po cichu oddałyby cały materiał zamiast wybranego zakresu.
  for (const p of s.generuj('klasa2-powtorka', DUZO, 'wybor', null, { do: '3' })) {
    assert.ok(unitPo.get(p.odpowiedz) <= 3, `"${p.odpowiedz}" spoza zakresu do:'3'`);
    for (const w of p.warianty) {
      assert.ok(unitPo.get(w) <= 3, `wariant "${w}" spoza zakresu do:'3'`);
    }
  }
  for (const p of s.generuj('klasa2-powtorka', DUZO, 'wybor', null, { tylko: '1' })) {
    assert.strictEqual(unitPo.get(p.odpowiedz), 1, `"${p.odpowiedz}" spoza rozdziału tylko:'1'`);
  }
});

test('nieliczbowy zakres znaczy brak zakresu, a nie rozdział 0', () => {
  // Pułapka: Number(null) === 0, a 0 to prawidłowy rozdział (sekcja "Hello").
  // Gdyby koercja szła przed sprawdzeniem typu, { tylko: null } udawałoby { tylko: 0 }
  // i dziecko dostałoby same liczebniki zamiast całego materiału.
  for (const zakres of [{ tylko: null }, { do: null }, { tylko: 'abc' }, { do: '' }, { tylko: NaN }]) {
    const uzyteUnity = new Set(
      s.generuj('klasa2-powtorka', DUZO, 'wybor', null, zakres).map((p) => unitPo.get(p.odpowiedz)),
    );
    const opis = JSON.stringify(zakres);
    assert.ok(uzyteUnity.has(8), `${opis} powinno dać cały zestaw, brakuje rozdziału 8`);
    assert.ok(uzyteUnity.size > 1, `${opis} nie może zwężać materiału do jednego rozdziału`);
  }
});
