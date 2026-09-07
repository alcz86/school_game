const test = require('node:test');
const assert = require('node:assert');
const app = require('../js/app.js');

test('EKRANY zawiera wszystkie ekrany gry', () => {
  assert.deepStrictEqual(app.EKRANY, ['menu', 'wybor-poziomu', 'wybor-rozdzialu', 'walka', 'wynik', 'rodzic']);
});

test('pokazEkran zwraca false dla nieznanego ekranu', () => {
  assert.strictEqual(app.pokazEkran('nie-ma-takiego'), false);
});

test('pokazEkran zwraca true dla znanego ekranu', () => {
  assert.strictEqual(app.pokazEkran('menu'), true);
});

const matematyka = require('../dane/matematyka.js');
const ortografia = require('../dane/ortografia.js');
const slowka = require('../dane/slowka.js');
const zdania = require('../dane/zdania.js');

test('poziomyDla zwraca poziomy właściwe dla trybu', () => {
  assert.strictEqual(app.poziomyDla('matematyka').length, matematyka.POZIOMY.length);
  assert.strictEqual(app.poziomyDla('ortografia').length, ortografia.ZESTAWY.length);
  // Angielski ma DWA źródła: słówka i zdania z luką.
  assert.strictEqual(app.poziomyDla('angielski').length, slowka.ZESTAWY.length + zdania.ZESTAWY.length);
  assert.deepStrictEqual(app.poziomyDla('nie-ma'), []);
});

test('poziomyDla zawsze zwraca id, nazwę i opis', () => {
  for (const tryb of ['matematyka', 'ortografia', 'angielski']) {
    for (const p of app.poziomyDla(tryb)) {
      assert.ok(p.id, 'brak id');
      assert.ok(p.nazwa, `brak nazwy dla ${p.id}`);
      assert.strictEqual(typeof p.opis, 'string');
    }
  }
});

test('pytaniaDla zwraca komplet pytań w kształcie wymaganym przez walkę', () => {
  const pytania = app.pytaniaDla('matematyka', 'trudne', 12);
  assert.strictEqual(pytania.length, 12);
  for (const p of pytania) {
    assert.ok(p.id && p.tresc && p.odpowiedz !== undefined && p.wyjasnienie !== undefined);
  }
});

test('pytaniaDla dla nieistniejacego poziomu zwraca pusta tablice, nie wybucha', () => {
  assert.deepStrictEqual(app.pytaniaDla('angielski', 'nie-ma-takiego', 10), []);
  assert.deepStrictEqual(app.pytaniaDla('nie-ma-trybu', 'cokolwiek', 10), []);
});

test('PYTAN_NA_RUNDE wystarcza, by boss nie zbil sie z jednej puli bez powtorek', () => {
  // Boss ma 10 zycia; przy mnoznikach 1/1/2/2/3/3 do zbicia trzeba co najmniej
  // 6 poprawnych odpowiedzi. Pula musi byc od tego wieksza, inaczej runda
  // zaczynalaby cyklowac te same pytania juz przy bezblednej grze.
  assert.ok(app.PYTAN_NA_RUNDE >= 8, 'pula za mala: ' + app.PYTAN_NA_RUNDE);
});

test('rozpocznijWalke odmawia startu, gdy nie ma materialu', () => {
  // Straznik przed nowaWalka([]) — stan bez pytan zamraza gre, bo `aktualne`
  // jest null, a walka nigdy sie nie konczy.
  assert.strictEqual(app.rozpocznijWalke('angielski', 'klasa2-powtorka', { tylko: 99 }), false);
  assert.strictEqual(app.rozpocznijWalke('angielski', 'nie-ma-zestawu'), false);
  assert.strictEqual(app.rozpocznijWalke('nie-ma-trybu', 'cokolwiek'), false);
  assert.strictEqual(app.rozpocznijWalke('matematyka', 'nie-ma-poziomu'), false);
});

test('rozpocznijWalke startuje dla poprawnego trybu i poziomu', () => {
  assert.strictEqual(app.rozpocznijWalke('matematyka', 'trudne'), true);
  assert.strictEqual(app.rozpocznijWalke('ortografia', 'o-u'), true);
  assert.strictEqual(app.rozpocznijWalke('angielski', 'klasa2-powtorka', { tylko: 3 }), true);
});

test('komunikat o braku materialu jest po polsku i niepusty', () => {
  assert.ok(app.BRAK_MATERIALU && app.BRAK_MATERIALU.length > 10);
});

test('pytaniaDla dla nieznanego poziomu zwraca [] we WSZYSTKICH trybach', () => {
  // Krytyczny przypadek: matematyka.generuj cicho fallbackuje na "trudne" dla
  // nieznanego idPoziomu — guard MUSI siedzieć w pytaniaDla, przed delegacją,
  // inaczej literówka w poziomie po cichu uruchamia rundę z niewłaściwym materiałem.
  assert.deepStrictEqual(app.pytaniaDla('matematyka', 'nie-ma-takiego-poziomu', 5), []);
  assert.deepStrictEqual(app.pytaniaDla('ortografia', 'nie-ma-takiego-poziomu', 5), []);
  assert.deepStrictEqual(app.pytaniaDla('angielski', 'nie-ma-takiego-poziomu', 5), []);
});

// ------------------------------------------------------- ekran rodzica (Task 9)

// Sztuczne statystyki w kształcie zwracanym przez postepy.statystyki().
// W Node nie ma localStorage, więc realny magazyn jest pusty — funkcje ekranu
// rodzica są czystymi funkcjami od `stat` właśnie po to, żeby dały się przetestować.
const STAT = {
  tryby: {
    matematyka: { trudne: { poprawne: 5, wszystkie: 10, procent: 50 } },
    ortografia: { 'o-u': { poprawne: 9, wszystkie: 10, procent: 90 } },
    angielski: { 'klasa2-powtorka': { poprawne: 6, wszystkie: 8, procent: 75 } },
  },
  najczestszeBledy: [
    { tryb: 'matematyka', zestaw: 'trudne', id: '7x8', bledy: 4 },
    { tryb: 'matematyka', zestaw: 'dzielenie', id: '56:8', bledy: 3 },
    { tryb: 'ortografia', zestaw: 'o-u', id: 'o-u:król', bledy: 2 },
    { tryb: 'angielski', zestaw: 'klasa2-powtorka', id: 'klasa2-powtorka:chair', bledy: 1 },
  ],
  dniZRzedu: 3,
  ostatnioGrane: '2026-08-24',
};

test('opisBledu tlumaczy identyfikatory na opis po ludzku', () => {
  assert.strictEqual(app.opisBledu('matematyka', 'trudne', '7x8'), '7 × 8');
  assert.strictEqual(app.opisBledu('matematyka', 'dzielenie', '56:8'), '56 : 8');
  assert.strictEqual(app.opisBledu('ortografia', 'o-u', 'o-u:król'), 'król (ó/u)');
  assert.strictEqual(app.opisBledu('angielski', 'klasa2-powtorka', 'klasa2-powtorka:chair'), 'chair — krzesło');
});

test('opisBledu nie zostawia surowego identyfikatora z prefiksem zestawu', () => {
  // Surowy klucz techniczny na ekranie rodzica jest bezuzyteczny — Aleksandra ma
  // zobaczyc, czego uczyc syna, a nie klucz z localStorage.
  for (const b of STAT.najczestszeBledy) {
    const opis = app.opisBledu(b.tryb, b.zestaw, b.id);
    assert.ok(!opis.includes(b.zestaw + ':'), 'prefiks zestawu zostal w opisie: ' + opis);
    assert.ok(!/^\d+x\d+$/.test(opis), 'surowy identyfikator matematyczny: ' + opis);
  }
});

test('opisBledu nie wybucha na nieznanych danych', () => {
  assert.strictEqual(app.opisBledu('nie-ma', 'nie-ma', 'cos'), 'cos');
  assert.strictEqual(app.opisBledu('angielski', 'nie-ma-zestawu', 'x'), 'x');
  assert.strictEqual(app.opisBledu('matematyka', 'trudne', null), '');
});

test('nazwaPoziomu zwraca czytelna nazwe, nie identyfikator', () => {
  assert.strictEqual(app.nazwaPoziomu('matematyka', 'trudne'), 'Trudne');
  assert.strictEqual(app.nazwaPoziomu('ortografia', 'o-u'), 'ó czy u');
  assert.strictEqual(app.nazwaPoziomu('angielski', 'klasa2-powtorka'), 'Klasa 2 — powtórka');
  // Nieznany identyfikator NIE MOŻE wyciec na ekran rodzica jako surowy klucz.
  assert.strictEqual(app.nazwaPoziomu('matematyka', 'nie-ma'), 'Zestaw z wcześniejszej wersji gry');
});

test('nazwaPoziomu podpisuje stare zestawy zmiekczen, a nie pokazuje ich kluczy', () => {
  // Realne postępy dziecka sprzed scalenia — zestawów już nie ma w danych,
  // ale wiersze zostają na ekranie rodzica i muszą być czytelne.
  ['s-si', 'c-ci', 'n-ni', 'z-zi', 'dz-dzi'].forEach((id) => {
    assert.strictEqual(app.nazwaPoziomu('ortografia', id), 'Zmiękczenia (starsze wyniki)');
  });
  // Nieznany zestaw ortograficzny też nie pokazuje klucza.
  assert.strictEqual(app.nazwaPoziomu('ortografia', 'a-e'), 'Zestaw z wcześniejszej wersji gry');
});

test('poziomyDla ortografia nie wywala sie na zestawie bez opisu i bez wariantow', () => {
  // P3: `opis || warianty.join()` — drugi człon też potrzebuje strażnika.
  // Wstrzykujemy na chwilę zestaw bez OBU pól; bez strażnika to rzuca TypeError
  // i cała lista poziomów przestaje się renderować.
  const ortografia = require('../dane/ortografia.js');
  ortografia.ZESTAWY.push({ id: 'test-bez-opisu', nazwa: 'Bez opisu', wyrazy: [] });
  try {
    const poziomy = app.poziomyDla('ortografia');
    const dodany = poziomy.find((p) => p.id === 'test-bez-opisu');
    assert.strictEqual(dodany.opis, '');
    poziomy.forEach((p) => assert.strictEqual(typeof p.opis, 'string'));
  } finally {
    ortografia.ZESTAWY.pop();
  }
});

test('wierszeSkutecznosci buduje wiersze dla wszystkich trybow', () => {
  const w = app.wierszeSkutecznosci(STAT);
  assert.strictEqual(w.length, 3);
  assert.deepStrictEqual(w.map((x) => x.tryb), ['matematyka', 'ortografia', 'angielski']);
  assert.strictEqual(w[0].procent, 50);
  assert.strictEqual(w[0].nazwaPoziomu, 'Trudne');
});

test('wierszeSkutecznosci pomija wpisy bez odpowiedzi — zadnych 0/0 ani NaN%', () => {
  const pusty = { tryby: { matematyka: { trudne: { poprawne: 0, wszystkie: 0, procent: 0 } } } };
  assert.deepStrictEqual(app.wierszeSkutecznosci(pusty), []);
  assert.deepStrictEqual(app.wierszeSkutecznosci({ tryby: {} }), []);
  assert.deepStrictEqual(app.wierszeSkutecznosci({}), []);
});

test('wierszeSkutecznosci trzyma kolejnosc poziomow z danych, nie z localStorage', () => {
  const stat = { tryby: { matematyka: {
    mieszane: { poprawne: 1, wszystkie: 2, procent: 50 },
    latwe:    { poprawne: 1, wszystkie: 2, procent: 50 },
  } } };
  assert.deepStrictEqual(app.wierszeSkutecznosci(stat).map((w) => w.poziom), ['latwe', 'mieszane']);
});

test('wierszeAngielski rozdziela powtorke klasy 2 od nowego materialu', () => {
  const g = app.wierszeAngielski(STAT);
  // Trzy grupy: powtórka, słówka klasy 3 i — osobno — zdania z luką.
  assert.strictEqual(g.length, 3);
  assert.strictEqual(g[0].nazwa, 'Powtórka (klasa 2)');
  assert.strictEqual(g[0].wszystkie, 8);
  assert.strictEqual(g[0].procent, 75);
  assert.strictEqual(g[1].nazwa, 'Klasa 3 — słówka');
  assert.strictEqual(g[2].nazwa, 'Klasa 3 — zdania');
  assert.strictEqual(g[2].wszystkie, 0);
  assert.strictEqual(g[1].wszystkie, 0);
  // Brak danych to null, nie 0% i nie NaN — inaczej ekran klamalby, ze syn ma 0%.
  assert.strictEqual(g[1].procent, null);
});

test('wierszeAngielski przypisuje kazdy zestaw do wlasciwej grupy wg pola klasa', () => {
  // Test rosnie sam wraz z danymi: dzis zestawow klasy 3 jeszcze nie ma
  // (sa zakomentowane w dane/slowka.js), wiec sprawdza glownie klase 2.
  // Po dopisaniu pierwszego unitu klasy 3 zaczyna pilnowac obu grup.
  const stat = { tryby: { angielski: {} } };
  for (const z of slowka.ZESTAWY) stat.tryby.angielski[z.id] = { poprawne: 1, wszystkie: 2, procent: 50 };
  const g = app.wierszeAngielski(stat);
  const k2 = slowka.ZESTAWY.filter((z) => z.klasa < 3).length;
  const k3 = slowka.ZESTAWY.filter((z) => z.klasa >= 3).length;
  assert.strictEqual(g[0].wszystkie, k2 * 2);
  assert.strictEqual(g[1].wszystkie, k3 * 2);
});

test('formatujDate i formatujDni sa po polsku i odporne na smieci', () => {
  assert.strictEqual(app.formatujDate('2026-08-24'), '24.08.2026');
  assert.strictEqual(app.formatujDate(null), '');
  assert.strictEqual(app.formatujDni(1), '1 dzień');
  assert.strictEqual(app.formatujDni(3), '3 dni');
});

test('prog wyrozniania slabego wyniku to 60% (spec §4)', () => {
  assert.strictEqual(app.PROG_SLABY, 60);
});

test('komunikat o braku danych jest po polsku i niepusty', () => {
  assert.ok(app.BRAK_DANYCH && app.BRAK_DANYCH.length > 10);
});

test('renderujRodzica bez DOM nie wybucha, tylko zwraca false', () => {
  assert.strictEqual(app.renderujRodzica(), false);
});

test('"Od poczatku do N" nie pokazuje sie przy PIERWSZYM rozdziale zestawu', () => {
  // Regresja: wyjatek byl zaszyty na `n === 0`, wiec zestaw zaczynajacy sie od
  // rozdzialu 1 (tak wyglada kazdy dopisany wedlug README) dawal dwa przyciski
  // uruchamiajace identyczna runde.
  assert.strictEqual(app.zakresDoMaSens([0, 1, 2], 0), false);
  assert.strictEqual(app.zakresDoMaSens([0, 1, 2], 1), true);
  assert.strictEqual(app.zakresDoMaSens([1, 2, 3], 1), false, 'rozdzial 1 jako pierwszy — bez duplikatu');
  assert.strictEqual(app.zakresDoMaSens([1, 2, 3], 3), true);
  assert.strictEqual(app.zakresDoMaSens([4], 4), false, 'jeden rozdzial — nie ma "od poczatku"');
});

test('kazdy realny zestaw slowek ma zakres "do" tylko poza pierwszym rozdzialem', () => {
  for (const z of slowka.ZESTAWY) {
    const numery = slowka.rozdzialy(z.id);
    assert.strictEqual(app.zakresDoMaSens(numery, numery[0]), false, z.id);
  }
});

test('lista mylonych pokazuje mianownik, nie sama liczbe bledow', () => {
  assert.strictEqual(app.opisPomylek({ bledy: 3, bledyPierwsze: 3, proby: 4 }), '3 błędy z 4 prób');
  assert.strictEqual(app.opisPomylek({ bledy: 1, bledyPierwsze: 1, proby: 1 }), '1 błąd z 1 próby');
  assert.strictEqual(app.opisPomylek({ bledy: 5, bledyPierwsze: 5, proby: 12 }), '5 błędów z 12 prób');
  assert.strictEqual(app.opisPomylek({ bledy: 2, bledyPierwsze: 2, proby: 2 }), '2 błędy z 2 prób');
});

// ------------------------------------- zdania z lukami + przełącznik trybu

test('poziomyDla("angielski") pokazuje zdania obok slowek, z licznikiem zdan', () => {
  const poziomy = app.poziomyDla('angielski');
  const z = poziomy.find((p) => p.id === 'zdania-klasa3');
  assert.ok(z, 'brak poziomu "zdania-klasa3" na liscie angielskiego');
  assert.strictEqual(z.nazwa, 'Zdania z lukami');
  // Opis MUSI mowic o zdaniach, nie o slowkach — to inna jednostka materialu.
  assert.strictEqual(z.opis, zdania.ZESTAWY[0].zdania.length + ' zdań');
  // Slowka nie znikaja.
  for (const s of slowka.ZESTAWY) assert.ok(poziomy.some((p) => p.id === s.id), s.id);
});

test('pytaniaDla deleguje do wlasciciela idPoziomu', () => {
  const trescZdan = new Set(zdania.ZESTAWY[0].zdania.map((s) => s.zdanie));
  for (const p of app.pytaniaDla('angielski', 'zdania-klasa3', 12)) {
    assert.ok(trescZdan.has(p.tresc), `"${p.tresc}" nie jest zdaniem z zestawu`);
  }
  const enSlowek = new Set(slowka.ZESTAWY.flatMap((z) => z.slowa.map((w) => w.en)));
  for (const p of app.pytaniaDla('angielski', 'klasa3', 12)) {
    assert.ok(enSlowek.has(p.odpowiedz), `"${p.odpowiedz}" nie jest slowkiem`);
  }
});

test('rozdzialyAngielski dziala dla obu modulow, nie tylko dla slowek', () => {
  assert.deepStrictEqual(app.rozdzialyAngielski('zdania-klasa3'), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepStrictEqual(app.rozdzialyAngielski('klasa3'), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepStrictEqual(app.rozdzialyAngielski('nie-ma-zestawu'), []);
});

test('bez jawnego trybu pytaniaDla zachowuje stare zachowanie oparte na klasie', () => {
  // Klasa 2 = wybor z czterech; klasa 3+ = wpisywanie. Dokladnie jak przed przelacznikiem.
  assert.strictEqual(app.domyslnyTrybOdpowiedzi('klasa2-powtorka'), 'wybor');
  assert.strictEqual(app.domyslnyTrybOdpowiedzi('klasa3'), 'wpisywanie');
  assert.strictEqual(app.domyslnyTrybOdpowiedzi('zdania-klasa3'), 'wpisywanie');

  for (const p of app.pytaniaDla('angielski', 'klasa2-powtorka', 10)) {
    assert.ok(Array.isArray(p.warianty) && p.warianty.length === 4, 'klasa 2 bez argumentu: wybor');
  }
  for (const id of ['klasa3', 'zdania-klasa3']) {
    for (const p of app.pytaniaDla('angielski', id, 10)) {
      assert.strictEqual(p.warianty, null, id + ' bez argumentu: wpisywanie');
    }
  }
});

test('jawny tryb wygrywa nad domyslnym — w obie strony, na slowkach i na zdaniach', () => {
  // Zestaw klasy 3 wymuszony na "wybor" ma dac cztery opcje z poprawna wsrod nich.
  for (const id of ['klasa3', 'zdania-klasa3']) {
    const pytania = app.pytaniaDla('angielski', id, 12, null, 'wybor');
    assert.strictEqual(pytania.length, 12, id);
    for (const p of pytania) {
      assert.strictEqual(p.warianty.length, 4, id + ': oczekiwano czterech opcji');
      assert.strictEqual(new Set(p.warianty).size, 4, id + ': opcje sie powtarzaja');
      assert.ok(p.warianty.includes(p.odpowiedz), id + ': brak poprawnej wsrod opcji');
    }
  }
  // Zestaw klasy 2 wymuszony na "wpisywanie" ma NIE dac wariantow.
  for (const p of app.pytaniaDla('angielski', 'klasa2-powtorka', 12, null, 'wpisywanie')) {
    assert.strictEqual(p.warianty, null);
  }
});

test('smieciowy tryb odpowiedzi spada na domyslny, nie tworzy trzeciego trybu', () => {
  for (const smiec of ['WYBOR', 'quiz', '', 0, {}]) {
    for (const p of app.pytaniaDla('angielski', 'klasa2-powtorka', 5, null, smiec)) {
      assert.strictEqual(p.warianty.length, 4, 'oczekiwano domyslnego trybu klasy 2');
    }
  }
});

test('TRYBY_ODPOWIEDZI to dokladnie dwa tryby', () => {
  assert.deepStrictEqual(app.TRYBY_ODPOWIEDZI, ['wybor', 'wpisywanie']);
});

test('rozpocznijWalke startuje dla zdan i respektuje zakres', () => {
  assert.strictEqual(app.rozpocznijWalke('angielski', 'zdania-klasa3', { tylko: 7 }), true);
  assert.strictEqual(app.rozpocznijWalke('angielski', 'zdania-klasa3', { tylko: 99 }), false);
});

test('ekran rodzica opisuje pomylone zdanie czytelnie, nie surowym kluczem', () => {
  const s = zdania.ZESTAWY[0].zdania[0];
  const opis = app.opisBledu('angielski', 'zdania-klasa3', 'zdania-klasa3:' + s.zdanie);
  assert.ok(!opis.includes('zdania-klasa3:'), 'prefiks zestawu zostal w opisie: ' + opis);
  assert.ok(opis.includes(s.zdanie), 'opis ma pokazac tresc zdania');
  assert.ok(opis.includes(s.odpowiedz), 'opis ma pokazac poprawna odpowiedz');
  // Slowka dalej dzialaja po staremu.
  assert.strictEqual(app.opisBledu('angielski', 'klasa2-powtorka', 'klasa2-powtorka:chair'), 'chair — krzesło');
});

test('naglowek ekranu rozdzialow mowi o zdaniach, gdy wybrano zdania', () => {
  assert.strictEqual(app.naglowekRozdzialow('zdania-klasa3'), 'Które zdania ćwiczymy?');
  assert.strictEqual(app.naglowekRozdzialow('klasa3'), 'Które słówka ćwiczymy?');
  assert.strictEqual(app.naglowekRozdzialow('nie-ma'), 'Które słówka ćwiczymy?');
});

test('nazwaPoziomu zna zestaw zdan', () => {
  assert.strictEqual(app.nazwaPoziomu('angielski', 'zdania-klasa3'), 'Zdania z lukami');
});

test('zdania maja WLASNY wiersz na ekranie rodzica, osobny od slowek klasy 3', () => {
  // Matka ma widziec osobno "czy zna slowka" i "czy rozumie zdania" — to dwie
  // rozne umiejetnosci i wlasnie po to ten poziom powstal.
  const stat = { tryby: { angielski: {
    'klasa2-powtorka': { poprawne: 8, wszystkie: 10, procent: 80 },
    'klasa3':          { poprawne: 9, wszystkie: 10, procent: 90 },
    'zdania-klasa3':   { poprawne: 3, wszystkie: 10, procent: 30 },
  } } };
  const g = app.wierszeAngielski(stat);
  assert.strictEqual(g.length, 3);
  const slowkaK3 = g.find((x) => x.nazwa === 'Klasa 3 — słówka');
  const zdaniaK3 = g.find((x) => x.nazwa === 'Klasa 3 — zdania');
  assert.strictEqual(slowkaK3.wszystkie, 10);
  assert.strictEqual(slowkaK3.procent, 90);
  assert.strictEqual(zdaniaK3.wszystkie, 10, 'zdania nie moga wpasc do wiersza slowek');
  assert.strictEqual(zdaniaK3.procent, 30, 'dobre slowka nie moga maskowac slabych zdan');
});

test('wierszeSkutecznosci pokazuje zestaw zdan pod czytelna nazwa', () => {
  const stat = { tryby: { angielski: { 'zdania-klasa3': { poprawne: 4, wszystkie: 8, procent: 50 } } } };
  const w = app.wierszeSkutecznosci(stat);
  assert.strictEqual(w.length, 1);
  assert.strictEqual(w[0].nazwaPoziomu, 'Zdania z lukami');
});
