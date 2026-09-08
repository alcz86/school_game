const test = require('node:test');
const assert = require('node:assert');
const postepy = require('../js/postepy.js');
const app = require('../js/app.js');

function magazynPamieciowy(poczatkowe) {
  const dane = Object.assign({}, poczatkowe || {});
  return {
    getItem: (k) => (k in dane ? dane[k] : null),
    setItem: (k, v) => { dane[k] = String(v); },
    removeItem: (k) => { delete dane[k]; },
    _dane: dane,
  };
}

const KLUCZ = 'gra-szkolna-postepy';

// ---------------------------------------------------------------- magazyn

test('sposob odpowiedzi zapisuje sie per tryb i zestaw', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('angielski', 'klasa3', 'cat', true, true, 'wpisywanie');
  p.zapiszOdpowiedz('angielski', 'klasa3', 'dog', false, true, 'wpisywanie');
  p.zapiszOdpowiedz('angielski', 'klasa2-powtorka', 'bread', true, true, 'wybor');

  const s = p.statystyki();
  assert.deepStrictEqual(s.sposoby.angielski['klasa3'], { wybor: 0, wpisywanie: 2 });
  assert.deepStrictEqual(s.sposoby.angielski['klasa2-powtorka'], { wybor: 1, wpisywanie: 0 });
});

test('powtorka po pomylce NIE dolicza sie do sposobu — ten sam mianownik co `wszystkie`', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('angielski', 'klasa3', 'cat', false, true, 'wpisywanie');
  p.zapiszOdpowiedz('angielski', 'klasa3', 'cat', true, false, 'wpisywanie');

  const s = p.statystyki();
  assert.strictEqual(s.tryby.angielski['klasa3'].wszystkie, 1);
  assert.strictEqual(s.sposoby.angielski['klasa3'].wpisywanie, 1);
});

test('brak sposobu i wartosc spoza listy nie zapisuja nic i nie wybuchaja', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('ortografia', 'o-u', 'o-u:król', true);                 // stare wywolanie, 4 argumenty
  p.zapiszOdpowiedz('angielski', 'klasa3', 'cat', true, true, 'dyktando');  // literowka / obce dane
  p.zapiszOdpowiedz('angielski', 'klasa3', 'dog', true, true, null);

  const s = p.statystyki();
  assert.deepStrictEqual(s.sposoby, {});
  assert.strictEqual(s.tryby.angielski['klasa3'].wszystkie, 2, 'wyniki maja sie liczyc mimo braku sposobu');
});

test('STARE postepy bez pola `sposoby` wczytuja sie i daja sie dopisac', () => {
  // Dokladnie to, co lezy dzis w localStorage syna: cztery gałęzie, bez `sposoby`.
  const stare = JSON.stringify({
    odpowiedzi: { 'angielski|klasa3|cat': { poprawne: 3, wszystkie: 4 } },
    bledy: { 'angielski|klasa3|cat': 1 },
    walki: [{ tryb: 'angielski', zestaw: 'klasa3', wynik: 'wygrana', data: '2026-09-01' }],
    dni: ['2026-09-01'],
  });
  const m = magazynPamieciowy({ [KLUCZ]: stare });
  const p = postepy.utworz(m);

  const przed = p.statystyki();
  assert.strictEqual(przed.tryby.angielski['klasa3'].wszystkie, 4, 'stare wyniki musza sie dalej pokazywac');
  assert.deepStrictEqual(przed.sposoby, {});

  p.zapiszOdpowiedz('angielski', 'klasa3', 'dog', true, true, 'wybor');
  const po = p.statystyki();
  assert.strictEqual(po.tryby.angielski['klasa3'].wszystkie, 5, 'dopisanie nie kasuje starych wynikow');
  assert.deepStrictEqual(po.sposoby.angielski['klasa3'], { wybor: 1, wpisywanie: 0 });
});

test('uszkodzone `sposoby` w magazynie nie wywracaja ekranu', () => {
  for (const smiec of ['[]', '"wpisywanie"', 'null', '17']) {
    const m = magazynPamieciowy({
      [KLUCZ]: '{"odpowiedzi":{"angielski|klasa3|cat":{"poprawne":1,"wszystkie":2}},"sposoby":' + smiec + '}',
    });
    const s = postepy.utworz(m).statystyki();
    assert.deepStrictEqual(s.sposoby, {}, 'smiec: ' + smiec);
    assert.strictEqual(s.tryby.angielski['klasa3'].wszystkie, 2);
  }
});

test('statystyki zwracaja KOPIE licznikow — mutacja nie skazi magazynu', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('angielski', 'klasa3', 'cat', true, true, 'wybor');
  p.statystyki().sposoby.angielski['klasa3'].wybor = 999;
  assert.strictEqual(p.statystyki().sposoby.angielski['klasa3'].wybor, 1);
});

// ------------------------------------------------------- ekran rodzica

function stat(odp, sposoby) {
  return { tryby: { angielski: odp }, sposoby: sposoby ? { angielski: sposoby } : {} };
}

function wiersz(g, nazwa) { return g.find((x) => x.nazwa === nazwa); }

test('wiersz angielski pokazuje tryb, w ktorym powstaly wyniki', () => {
  const g = app.wierszeAngielski(stat(
    { 'klasa3': { poprawne: 6, wszystkie: 10 } },
    { 'klasa3': { wybor: 0, wpisywanie: 10 } }
  ));
  const w = wiersz(g, 'Klasa 3 — słówka');
  assert.strictEqual(w.sposob, 'wpisywanie');
  assert.strictEqual(w.opisSposobu, 'Wpisywanie');
  assert.strictEqual(w.procent, 60);
});

test('zestaw z rundami w OBU trybach jest oznaczony jako mieszany, z rozbiciem', () => {
  const g = app.wierszeAngielski(stat(
    { 'klasa3': { poprawne: 15, wszystkie: 20 } },
    { 'klasa3': { wybor: 12, wpisywanie: 8 } }
  ));
  const w = wiersz(g, 'Klasa 3 — słówka');
  assert.strictEqual(w.sposob, 'mieszane');
  // Rozbicie musi byc widoczne — inaczej 75% czyta sie jak jeden pomiar.
  assert.match(w.opisSposobu, /^mieszane \(/);
  assert.ok(w.opisSposobu.includes('Wybór z czterech: 12'), w.opisSposobu);
  assert.ok(w.opisSposobu.includes('Wpisywanie: 8'), w.opisSposobu);
});

test('mieszanie zbiera sie takze z ROZNYCH zestawow tej samej grupy', () => {
  // `klasa3` i `klasa3-swieta` to jeden wiersz na ekranie. Jesli syn gral w jednym
  // wyborem, a w drugim wpisywaniem, wiersz jest mieszany, choc kazdy zestaw z osobna
  // nie jest.
  const g = app.wierszeAngielski(stat(
    { 'klasa3': { poprawne: 5, wszystkie: 5 }, 'klasa3-swieta': { poprawne: 3, wszystkie: 5 } },
    { 'klasa3': { wybor: 5, wpisywanie: 0 }, 'klasa3-swieta': { wybor: 0, wpisywanie: 5 } }
  ));
  const w = wiersz(g, 'Klasa 3 — słówka');
  assert.strictEqual(w.sposob, 'mieszane');
  assert.strictEqual(w.wszystkie, 10);
});

test('STARE wpisy bez trybu nie wywracaja ekranu — sa podpisane, nie zmyslone', () => {
  const g = app.wierszeAngielski(stat({ 'klasa2-powtorka': { poprawne: 6, wszystkie: 8 } }));
  const w = wiersz(g, 'Powtórka (klasa 2)');
  assert.strictEqual(w.wszystkie, 8, 'stare wyniki musza sie dalej wyswietlac');
  assert.strictEqual(w.procent, 75);
  assert.strictEqual(w.sposob, null, 'nieznanego trybu nie wolno podpisac zadnym z dwoch');
  assert.strictEqual(w.opisSposobu, app.BEZ_SPOSOBU);
  assert.strictEqual(w.bezPodpisu, 8);
});

test('stare wyniki wymieszane z nowymi daja mieszane, a nie ciche zaokraglenie', () => {
  // 20 odpowiedzi, z czego tylko 12 ma zapisany tryb — reszta jest sprzed tej wersji.
  const g = app.wierszeAngielski(stat(
    { 'klasa2-powtorka': { poprawne: 18, wszystkie: 20 } },
    { 'klasa2-powtorka': { wybor: 12, wpisywanie: 0 } }
  ));
  const w = wiersz(g, 'Powtórka (klasa 2)');
  assert.strictEqual(w.bezPodpisu, 8);
  assert.strictEqual(w.sposob, 'mieszane');
  assert.ok(w.opisSposobu.includes(app.BEZ_SPOSOBU + ': 8'), w.opisSposobu);
});

test('grupa bez zadnej odpowiedzi ma mysnik, nie zmyslony tryb', () => {
  const g = app.wierszeAngielski(stat({}));
  for (const w of g) {
    assert.strictEqual(w.sposob, null);
    assert.strictEqual(w.opisSposobu, '—');
  }
});

test('wierszeAngielski dziala na statystykach BEZ pola `sposoby` (stary ksztalt)', () => {
  const g = app.wierszeAngielski({ tryby: { angielski: { 'klasa3': { poprawne: 1, wszystkie: 2 } } } });
  assert.strictEqual(wiersz(g, 'Klasa 3 — słówka').wszystkie, 2);
  assert.strictEqual(wiersz(g, 'Klasa 3 — słówka').opisSposobu, app.BEZ_SPOSOBU);
});

test('rodzajSposobu i opisSposobu na krancach', () => {
  assert.strictEqual(app.rodzajSposobu(0, 0, 0), null);
  assert.strictEqual(app.rodzajSposobu(3, 0, 0), 'wybor');
  assert.strictEqual(app.rodzajSposobu(0, 3, 0), 'wpisywanie');
  assert.strictEqual(app.rodzajSposobu(0, 0, 3), null);
  assert.strictEqual(app.rodzajSposobu(1, 1, 1), 'mieszane');
  assert.strictEqual(app.opisSposobu(3, 0, 0), 'Wybór z czterech');
  assert.strictEqual(app.opisSposobu(0, 0, 0), '—');
});
