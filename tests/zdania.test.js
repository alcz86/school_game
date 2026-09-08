const test = require('node:test');
const assert = require('node:assert');
const z = require('../dane/zdania.js');

const ZESTAW = z.ZESTAWY.find((x) => x.id === 'zdania-klasa3');

// `ile` większe niż pula sprawia, że generator przechodzi przez CAŁY materiał
// (indeks cykluje przez `i % pula.length`) — dzięki temu testy zakresu są
// deterministyczne mimo losowania.
const DUZO = 200;
const unitPo = new Map(ZESTAW.zdania.map((s) => [s.zdanie, s.unit]));

test('istnieje zestaw zdania-klasa3 z rozdziałami 1-8, każdy niepusty', () => {
  assert.ok(ZESTAW, 'brak zestawu zdania-klasa3');
  assert.strictEqual(ZESTAW.klasa, 3);
  // 44 z partii 1 (46 przepisanych minus dwa Phonics Fun bez orzeczenia)
  // + 45 z partii 2 (46 przepisanych minus „toothache", którego nie ma w podręczniku).
  assert.strictEqual(ZESTAW.zdania.length, 89, 'zatwierdzono 89 zdań: 44 z partii 1 + 45 z partii 2');
  assert.deepStrictEqual(z.rozdzialy('zdania-klasa3'), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (let u = 1; u <= 8; u++) {
    assert.ok(ZESTAW.zdania.some((s) => s.unit === u), `rozdział ${u} jest pusty`);
  }
});

test('zdanie o płaszczu nie zostało dopisane — nie ma go w podręczniku', () => {
  // Matka potwierdziła, że tego zdania w książce nie ma. Gdyby ktoś je dopisał
  // „bo pasuje do Present Continuous", dziecko uczyłoby się materiału spoza szkoły.
  assert.ok(!ZESTAW.zdania.some((s) => /coat in winter/i.test(s.zdanie)));
});

test('każda pozycja jest ZDANIEM — ma podmiot i orzeczenie, nie sam fragment rymowanki', () => {
  // Recenzja 2026-09-08: dwie pozycje Phonics Fun z unitu 1 („An unhappy uncle ____
  // an umbrella.", „A happy man with a map ____ his lap.") nie miały orzeczenia —
  // żadna z czterech opcji nie tworzyła pełnego zdania, a wyjaśnienie dopowiadało
  // czasownik, którego dziecko w zdaniu nie widziało. Zostały usunięte.
  for (const frag of ['unhappy uncle', 'with a map']) {
    assert.ok(!ZESTAW.zdania.some((s) => s.zdanie.toLowerCase().includes(frag)),
      `fragment bez orzeczenia wrócił do zestawu: "${frag}"`);
  }
});

test('zdanie z rekonstruowanym słowem (toothache) nie weszło do gry', () => {
  // W podręczniku stoi tam kolorowy prostokąt zamiast słowa — rzeczownik był
  // domysłem autora partii 2, a nie przepisaniem. Matka wyłączyła tę pozycję.
  assert.ok(!ZESTAW.zdania.some((s) => /toothache/i.test(s.zdanie)));
});

test('każde zdanie ma dokładnie jedno miejsce na lukę', () => {
  for (const s of ZESTAW.zdania) {
    const luki = s.zdanie.match(/_+/g) || [];
    assert.strictEqual(luki.length, 1, `zdanie "${s.zdanie}" ma ${luki.length} luk`);
    assert.strictEqual(luki[0], '____', `luka w "${s.zdanie}" to "${luki[0]}", a ma być "____"`);
  }
});

test('każde zdanie ma niepustą odpowiedź, wyjaśnienie i całkowity unit', () => {
  for (const s of ZESTAW.zdania) {
    assert.ok(s.odpowiedz && s.odpowiedz.trim(), `pusta odpowiedź przy "${s.zdanie}"`);
    assert.ok(s.wyjasnienie && s.wyjasnienie.trim(), `puste wyjaśnienie przy "${s.zdanie}"`);
    assert.ok(Number.isInteger(s.unit) && s.unit >= 0, `zły unit przy "${s.zdanie}"`);
  }
});

test('odpowiedź nie występuje wśród dystraktorów, a dystraktory się nie powtarzają', () => {
  // Inaczej dziecko widziałoby dwa razy tę samą opcję — jedną z nich poprawną,
  // drugą uznaną za błąd. To nie jest pytanie, to pułapka.
  for (const s of ZESTAW.zdania) {
    assert.strictEqual(s.dystraktory.length, 3, `"${s.zdanie}" ma ${s.dystraktory.length} dystraktorów`);
    assert.strictEqual(new Set(s.dystraktory).size, 3, `powtórzony dystraktor w "${s.zdanie}"`);
    assert.ok(!s.dystraktory.includes(s.odpowiedz),
      `odpowiedź "${s.odpowiedz}" jest też dystraktorem w "${s.zdanie}"`);
  }
});

test('żadne dwa zdania nie mają identycznej treści', () => {
  // Klasa błędu znana z ortografii (morze / może renderowały się tak samo):
  // dwa pytania o tej samej treści i różnych odpowiedziach to pytanie z dwiema
  // poprawnymi odpowiedziami — dziecko odpowiada dobrze i traci serce.
  const widziane = new Map();
  for (const s of ZESTAW.zdania) {
    const klucz = s.zdanie.trim().toLowerCase();
    const poprzednie = widziane.get(klucz);
    assert.ok(!poprzednie,
      `zdublowana treść "${s.zdanie}": odpowiedzi "${poprzednie && poprzednie.odpowiedz}" vs "${s.odpowiedz}"`);
    widziane.set(klucz, s);
  }
});

test('tryb wyboru daje cztery różne opcje z poprawną wśród nich', () => {
  for (const p of z.generuj('zdania-klasa3', DUZO, 'wybor')) {
    assert.strictEqual(p.warianty.length, 4, `"${p.tresc}" ma ${p.warianty.length} opcji`);
    assert.strictEqual(new Set(p.warianty).size, 4, `powtórzone opcje w "${p.tresc}"`);
    assert.ok(p.warianty.includes(p.odpowiedz), `brak poprawnej wśród opcji w "${p.tresc}"`);
  }
});

test('tryb wpisywania nie podaje wariantów', () => {
  for (const p of z.generuj('zdania-klasa3', 20, 'wpisywanie')) {
    assert.strictEqual(p.warianty, null);
  }
});

test('kolejność opcji nie jest stała — nie da się wygrać klikając zawsze w to samo miejsce', () => {
  // Regresja z ortografii: poprawna odpowiedź stała zawsze na tym samym przycisku
  // i dziewięciolatek wygrywał rundę bez czytania. Sprawdzamy JEDNO zdanie
  // wielokrotnie: pozycja poprawnej odpowiedzi musi się zmieniać.
  const pozycje = new Set();
  for (let i = 0; i < 200; i++) {
    for (const p of z.generuj('zdania-klasa3', 4, 'wybor', null, { tylko: 2 })) {
      pozycje.add(p.warianty.indexOf(p.odpowiedz));
    }
  }
  assert.ok(pozycje.size >= 3, `poprawna odpowiedź trafia tylko na pozycje ${[...pozycje]}`);
});

test('pytanie ma kształt wymagany przez walkę', () => {
  for (const p of z.generuj('zdania-klasa3', 10, 'wybor')) {
    assert.ok(p.id && p.tresc && p.odpowiedz && p.wyjasnienie);
    assert.ok(p.tresc.includes('____'), 'treść pytania musi pokazywać lukę');
  }
});

test('identyfikator pytania jest stabilny i niezależny od zakresu', () => {
  // `id` to klucz statystyk. Gdyby zależał od zakresu, to samo zdanie liczyłoby się
  // osobno w rundzie "tylko rozdział 8" i "od początku do 8" — a ekran rodzica
  // pokazywałby dwa wiersze zamiast jednego.
  const bezZakresu = new Map(z.generuj('zdania-klasa3', DUZO, 'wybor').map((p) => [p.tresc, p.id]));
  for (const zakres of [{ tylko: 8 }, { do: 8 }, { do: 3 }, null]) {
    for (const p of z.generuj('zdania-klasa3', DUZO, 'wybor', null, zakres)) {
      assert.strictEqual(p.id, bezZakresu.get(p.tresc), `niestabilne id dla "${p.tresc}"`);
    }
  }
});

test('zakres tylko:N i do:N zwracają wyłącznie zdania z właściwych rozdziałów', () => {
  for (const p of z.generuj('zdania-klasa3', DUZO, 'wybor', null, { tylko: 5 })) {
    assert.strictEqual(unitPo.get(p.tresc), 5, `"${p.tresc}" spoza rozdziału 5`);
  }
  const uzyte = new Set();
  for (const p of z.generuj('zdania-klasa3', DUZO, 'wybor', null, { do: 3 })) {
    assert.ok(unitPo.get(p.tresc) <= 3, `"${p.tresc}" spoza zakresu do:3`);
    uzyte.add(unitPo.get(p.tresc));
  }
  assert.ok(uzyte.size > 1, 'zakres kumulacyjny ma mieszać materiał z wielu rozdziałów');
});

test('zakres podany stringiem znaczy to samo co liczbą (wartości z DOM są stringami)', () => {
  for (const p of z.generuj('zdania-klasa3', DUZO, 'wybor', null, { tylko: '5' })) {
    assert.strictEqual(unitPo.get(p.tresc), 5, `"${p.tresc}" spoza rozdziału tylko:'5'`);
  }
  for (const p of z.generuj('zdania-klasa3', DUZO, 'wybor', null, { do: '3' })) {
    assert.ok(unitPo.get(p.tresc) <= 3, `"${p.tresc}" spoza zakresu do:'3'`);
  }
});

test('null / pusty string / false nie udają rozdziału 0', () => {
  // Pułapka: Number(null) === 0. Gdyby koercja szła przed sprawdzeniem typu,
  // { tylko: null } udawałoby { tylko: 0 } — a rozdziału 0 tu nie ma, więc runda
  // wyszłaby PUSTA i gra odmówiłaby startu bez powodu.
  for (const zakres of [{ tylko: null }, { do: null }, { tylko: '' }, { do: '' },
    { tylko: false }, { do: false }, { tylko: 'abc' }, { do: NaN }]) {
    const uzyte = new Set(
      z.generuj('zdania-klasa3', DUZO, 'wybor', null, zakres).map((p) => unitPo.get(p.tresc)),
    );
    const opis = JSON.stringify(zakres);
    assert.ok(uzyte.size > 1, `${opis} nie może zwężać materiału do jednego rozdziału`);
    assert.ok(uzyte.has(8), `${opis} powinno dać cały zestaw, brakuje rozdziału 8`);
  }
});

test('wagi zwiększają częstość mylonego zdania proporcjonalnie', () => {
  const cel = ZESTAW.zdania.find((s) => s.unit === 8).zdanie;
  const wagi = { ['zdania-klasa3:' + cel]: 100 };
  const pytania = z.generuj('zdania-klasa3', 300, 'wpisywanie', wagi);
  const ile = pytania.filter((p) => p.tresc === cel).length;
  assert.ok(ile >= 20, `oczekiwano częstego powrotu mylonego zdania, było ${ile}`);
});

test('ważone zdanie spoza zakresu nie wchodzi do węższej rundy', () => {
  const celU8 = ZESTAW.zdania.find((s) => s.unit === 8).zdanie;
  const wagi = { ['zdania-klasa3:' + celU8]: 100 };
  const pytania = z.generuj('zdania-klasa3', DUZO, 'wpisywanie', wagi, { tylko: 2 });
  assert.ok(pytania.length > 0, 'runda nie może być pusta');
  assert.ok(pytania.every((p) => p.tresc !== celU8), 'zdanie z rozdziału 8 weszło do rundy "tylko 2"');
  assert.ok(pytania.every((p) => unitPo.get(p.tresc) === 2), 'zakres musi przetrwać mimo wag spoza niego');
});

test('nieistniejący zestaw i pusty zakres zwracają pustą tablicę, nie wybuchają', () => {
  assert.deepStrictEqual(z.generuj('nie-ma-takiego', 5, 'wybor'), []);
  assert.deepStrictEqual(z.generuj('zdania-klasa3', 5, 'wybor', null, { tylko: 99 }), []);
  assert.deepStrictEqual(z.rozdzialy('nie-ma-takiego'), []);
});

test('rozdzialy zwraca posortowaną listę bez duplikatów', () => {
  const r = z.rozdzialy('zdania-klasa3');
  assert.deepStrictEqual(r, Array.from(new Set(r)).sort((a, b) => a - b));
});
