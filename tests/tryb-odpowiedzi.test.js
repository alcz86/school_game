const test = require('node:test');
const assert = require('node:assert');
const app = require('../js/app.js');
const postepyMod = require('../js/postepy.js');

// ---------------------------------------------------------------------------
// PO CO TEN PLIK
//
// Trzy rzeczy nie miały żadnego testu i trzy mutacje recenzenta je przeżyły:
// `ustawTrybOdpowiedzi` (walidacja wejścia), zachowanie „🔁 Jeszcze raz"
// (ma powtarzać rundę w TYM SAMYM trybie) i obsługa śmieciowej wartości trybu.
// Doszło do tego zapamiętywanie wyboru w localStorage (decyzja matki 2026-09-08).
// ---------------------------------------------------------------------------

// Magazyn-atrapa o interfejsie localStorage. Trzyma stringi, jak prawdziwy —
// gdyby trzymał obiekty, test przepuściłby błąd serializacji.
function fałszywyMagazyn(poczatkowe) {
  const dane = Object.assign({}, poczatkowe);
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(dane, k) ? dane[k] : null),
    setItem: (k, v) => { dane[k] = String(v); },
    removeItem: (k) => { delete dane[k]; },
    _dane: dane,
  };
}

const KLUCZ_TRYBY = 'gra-szkolna-tryb-odpowiedzi';

// ------------------------------------------------------- ustawTrybOdpowiedzi

test('ustawTrybOdpowiedzi przyjmuje oba znane tryby i odrzuca wszystko inne', () => {
  for (const t of app.TRYBY_ODPOWIEDZI) {
    assert.strictEqual(app.ustawTrybOdpowiedzi(t), true, `odrzucono poprawny tryb "${t}"`);
  }
  // Wartość spoza listy nie ma prawa przejść — inaczej literówka w danych DOM
  // zamieniłaby rundę w tryb, którego nie ma, i pytania wyszłyby bez wariantów
  // ORAZ bez pola do wpisywania.
  for (const smiec of ['WYBOR', 'wybór', 'quiz', '', null, undefined, 0, 1, {}, [], 'wpisywanie ']) {
    assert.strictEqual(app.ustawTrybOdpowiedzi(smiec), false,
      `przepuszczono śmieciowy tryb ${JSON.stringify(smiec)}`);
  }
});

test('ustawTrybOdpowiedzi bez id zestawu nie wybucha (stare wywołania)', () => {
  assert.strictEqual(app.ustawTrybOdpowiedzi('wybor'), true);
  assert.strictEqual(app.ustawTrybOdpowiedzi('wybor', undefined), true);
});

test('opisAktualnegoTrybu nazywa tryb po ludzku, nie kluczem technicznym', () => {
  // Ten tekst czyta matka na ekranie wyboru rozdziału — „wpisywanie" jako
  // surowy klucz nic jej nie mówi o tym, w czym gra syn.
  assert.strictEqual(app.opisAktualnegoTrybu('wybor'), 'Teraz grasz: Wybór z czterech');
  assert.strictEqual(app.opisAktualnegoTrybu('wpisywanie'), 'Teraz grasz: Wpisywanie');
});

// --------------------------------------------- zapamiętywanie w localStorage

test('zapamiętany tryb wraca po ponownym utworzeniu modułu (przeżywa zamknięcie karty)', () => {
  const mag = fałszywyMagazyn();
  const pierwszy = postepyMod.utworz(mag);
  assert.strictEqual(pierwszy.trybOdpowiedzi('zdania-klasa3'), null, 'na starcie brak wyboru');
  assert.strictEqual(pierwszy.zapiszTrybOdpowiedzi('zdania-klasa3', 'wybor'), true);

  // Nowa instancja = nowe otwarcie gry. Czyta z TEGO SAMEGO magazynu.
  const drugi = postepyMod.utworz(mag);
  assert.strictEqual(drugi.trybOdpowiedzi('zdania-klasa3'), 'wybor');
});

test('tryb jest pamiętany OSOBNO dla każdego zestawu', () => {
  // Domyślny tryb zależy od klasy zestawu, więc jedna wspólna wartość narzucałaby
  // powtórce z klasy 2 ustawienie zrobione przy zdaniach klasy 3.
  const mag = fałszywyMagazyn();
  const p = postepyMod.utworz(mag);
  p.zapiszTrybOdpowiedzi('zdania-klasa3', 'wybor');
  p.zapiszTrybOdpowiedzi('klasa2-powtorka', 'wpisywanie');
  assert.strictEqual(p.trybOdpowiedzi('zdania-klasa3'), 'wybor');
  assert.strictEqual(p.trybOdpowiedzi('klasa2-powtorka'), 'wpisywanie');
  assert.strictEqual(p.trybOdpowiedzi('klasa3'), null, 'zestaw bez zapisu nie dziedziczy cudzego');
});

test('śmieciowa wartość w pamięci nie wywraca gry — wraca null, czyli domyślny', () => {
  // Każdy z tych kształtów realnie bywa w localStorage: uszkodzony JSON,
  // wartość z innej wersji gry, ręczne grzebanie w narzędziach przeglądarki.
  const smieci = [
    'to nie jest json',
    '[]',
    'null',
    '"wybor"',
    '{"zdania-klasa3": "quiz"}',
    '{"zdania-klasa3": 1}',
    '{"zdania-klasa3": null}',
    '{"zdania-klasa3": {"tryb": "wybor"}}',
    '{"zdania-klasa3": "WYBOR"}',
  ];
  for (const s of smieci) {
    const p = postepyMod.utworz(fałszywyMagazyn({ [KLUCZ_TRYBY]: s }));
    assert.strictEqual(p.trybOdpowiedzi('zdania-klasa3'), null,
      `śmieć ${s} przeszedł jako tryb`);
  }
});

test('zapis odrzuca śmieciowy tryb i nie psuje tego, co już zapamiętane', () => {
  const mag = fałszywyMagazyn();
  const p = postepyMod.utworz(mag);
  p.zapiszTrybOdpowiedzi('zdania-klasa3', 'wpisywanie');
  for (const smiec of ['quiz', '', null, 0, {}]) {
    assert.strictEqual(p.zapiszTrybOdpowiedzi('zdania-klasa3', smiec), false);
  }
  assert.strictEqual(p.zapiszTrybOdpowiedzi('', 'wybor'), false, 'pusty zestaw nie jest kluczem');
  assert.strictEqual(p.trybOdpowiedzi('zdania-klasa3'), 'wpisywanie', 'poprzedni wybór ocalał');
});

test('tryb jest zapisany pod INNYM kluczem niż postępy — reset postępów go nie kasuje', () => {
  // „🗑️ Wyczyść postępy" ma kasować wyniki dziecka, a nie ustawienie sterowania.
  const mag = fałszywyMagazyn();
  const p = postepyMod.utworz(mag);
  p.zapiszOdpowiedz('angielski', 'zdania-klasa3', 'x', false);
  p.zapiszTrybOdpowiedzi('zdania-klasa3', 'wybor');
  p.reset();
  assert.strictEqual(p.trybOdpowiedzi('zdania-klasa3'), 'wybor', 'reset postępów zjadł ustawienie trybu');
  assert.strictEqual(p.statystyki().mylonePozycje, 0, 'postępy miały zostać wyczyszczone');
});

test('brak magazynu (np. testy w Node) nie wywraca zapisu ani odczytu', () => {
  const p = postepyMod.utworz(null);
  assert.strictEqual(p.trybOdpowiedzi('zdania-klasa3'), null);
  assert.strictEqual(p.zapiszTrybOdpowiedzi('zdania-klasa3', 'wybor'), true);
  assert.strictEqual(p.trybOdpowiedzi('zdania-klasa3'), null, 'bez magazynu nic nie przeżywa');
});

// -------------------------------------------------------- „🔁 Jeszcze raz"

test('„Jeszcze raz" powtarza rundę w TYM SAMYM trybie, nie w domyślnym', () => {
  // Mutacja recenzenta: podmiana `kontekst.trybOdpowiedzi` na `null` w handlerze
  // „Jeszcze raz" przeszła przez wszystkie testy. Skutek dla dziecka: gra zaczyna
  // rundę wpisywania po tym, jak wybrało wybór z czterech — bez żadnego sygnału.
  //
  // Testujemy to przez `pytaniaDla`, bo handler DOM w Node nie istnieje;
  // to ta sama ścieżka, którą handler woła (rozpocznijWalke → pytaniaDla).
  const zapamietany = { tryb: 'angielski', idPoziomu: 'zdania-klasa3', zakres: { tylko: 7 }, trybOdpowiedzi: 'wybor' };

  const pierwsza = app.pytaniaDla(
    zapamietany.tryb, zapamietany.idPoziomu, 12, zapamietany.zakres, zapamietany.trybOdpowiedzi);
  const powtorka = app.pytaniaDla(
    zapamietany.tryb, zapamietany.idPoziomu, 12, zapamietany.zakres, zapamietany.trybOdpowiedzi);

  assert.strictEqual(pierwsza.length, 12);
  assert.strictEqual(powtorka.length, 12);
  for (const p of powtorka) {
    assert.ok(Array.isArray(p.warianty) && p.warianty.length === 4,
      'powtórka zgubiła tryb "wybor" i wróciła do domyślnego wpisywania');
  }

  // I w drugą stronę: zestaw klasy 2 wymuszony na wpisywanie ma tak zostać.
  for (const p of app.pytaniaDla('angielski', 'klasa2-powtorka', 12, null, 'wpisywanie')) {
    assert.strictEqual(p.warianty, null, 'powtórka zgubiła tryb "wpisywanie"');
  }
});

test('„Jeszcze raz" bez zapamiętanego trybu spada na domyślny wg klasy, nie na pustą rundę', () => {
  // Kontekst starej rundy (sprzed przełącznika) ma `trybOdpowiedzi: null`.
  for (const p of app.pytaniaDla('angielski', 'zdania-klasa3', 10, null, null)) {
    assert.strictEqual(p.warianty, null, 'zdania klasy 3 domyślnie to wpisywanie');
  }
  for (const p of app.pytaniaDla('angielski', 'klasa2-powtorka', 10, null, null)) {
    assert.strictEqual(p.warianty.length, 4, 'klasa 2 domyślnie to wybór z czterech');
  }
});

// -------------------------------------------------- odznaka i brak materiału

test('odznaka po rundzie zdań jest odznaką ZA ZDANIA, nie za słówka', () => {
  // ODZNAKI jest kluczowane trybem, a „angielski" ma dwa rodzaje materiału.
  // Dziecko dostawało „Mistrza słówek" za rundę, w której żadnego słówka nie było.
  assert.strictEqual(app.odznakaDla('angielski', 'zdania-klasa3'), '🏅 Mistrz zdań');
  assert.strictEqual(app.odznakaDla('angielski', 'klasa3'), '🏅 Mistrz słówek');
  assert.strictEqual(app.odznakaDla('angielski', 'klasa2-powtorka'), '🏅 Mistrz słówek');
  assert.strictEqual(app.odznakaDla('matematyka', 'trudne'), '🏅 Mistrz tabliczki');
  assert.strictEqual(app.odznakaDla('ortografia', 'o-u'), '🏅 Mistrz ortografii');
  // Nieznany tryb nie może wysypać ekranu wyniku.
  assert.strictEqual(app.odznakaDla('nie-ma-trybu', 'nic'), '🏅 Odznaka');
});

test('komunikat o pustym rozdziale mówi o zdaniach, gdy wybrano zdania', () => {
  assert.strictEqual(app.brakMaterialu('zdania-klasa3'), 'Ten rozdział nie ma jeszcze zdań');
  assert.strictEqual(app.brakMaterialu('klasa3'), 'Ten rozdział nie ma jeszcze słówek');
  assert.strictEqual(app.brakMaterialu('nie-ma-zestawu'), 'Ten rozdział nie ma jeszcze słówek');
});
