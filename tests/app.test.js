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

test('poziomyDla zwraca poziomy właściwe dla trybu', () => {
  assert.strictEqual(app.poziomyDla('matematyka').length, matematyka.POZIOMY.length);
  assert.strictEqual(app.poziomyDla('ortografia').length, ortografia.ZESTAWY.length);
  assert.strictEqual(app.poziomyDla('angielski').length, slowka.ZESTAWY.length);
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
  assert.strictEqual(app.nazwaPoziomu('matematyka', 'nie-ma'), 'nie-ma');
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
  assert.strictEqual(g.length, 2);
  assert.strictEqual(g[0].nazwa, 'Powtórka (klasa 2)');
  assert.strictEqual(g[0].wszystkie, 8);
  assert.strictEqual(g[0].procent, 75);
  assert.strictEqual(g[1].nazwa, 'Klasa 3');
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
