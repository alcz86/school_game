const test = require('node:test');
const assert = require('node:assert');
const zdania = require('../dane/zdania.js');

// ---------------------------------------------------------------------------
// PO CO TEN PLIK
//
// Wyjaśnienia wyświetlają się dziecku po KAŻDEJ odpowiedzi. Ta sama gra w trybie
// „Ortografia" uczy tego samego dziewięciolatka polskiego zapisu — 46 wyjaśnień
// napisanych „uzywamy / wiec / mowimy / koncowke" podważało tamten tryb i całą
// wiarygodność gry. Poprawiono to razem z drugą partią; ten test pilnuje, żeby
// przy dopisywaniu KOLEJNYCH partii okaleczenia nie wróciły.
//
// DLACZEGO TEST WYGLĄDA TAK, A NIE INACZEJ
//
// Odrzucone podejście nr 1: „zabroń w wyjaśnieniach znaków spoza ASCII-i-polskich".
//   Nic nie daje — okaleczone słowo („wiec") składa się z samych liter ASCII.
//
// Odrzucone podejście nr 2: „wymagaj, żeby każde wyjaśnienie miało diakrytyk".
//   Fałszywe alarmy: „Dwie osoby = have got." jest poprawną polszczyzną bez
//   ani jednego ogonka, a test kazałby psuć poprawny tekst.
//
// Wybrane podejście: JAWNA LISTA konkretnych okaleczeń, które faktycznie były
// w tym pliku, plus kilka bardzo bliskich wariantów tej samej odmiany. Lista
// jest wąska i dosłowna — nie zgaduje polskiej morfologii, więc nie ma szans
// na fałszywy alarm, a łapie dokładnie ten nawyk pisania bez ogonków, który tu
// wystąpił. Rozszerzaj ją, kiedy pojawi się nowe okaleczenie, zamiast robić
// z niej heurystykę.
//
// UWAGA na słowa-pułapki, których NIE wolno tu wpisać:
//   „czasownik", „rzeczownik", „osoba", „liczba", „mnoga" — to poprawne formy
//   bez diakrytyków. Wpisanie ich zamieniłoby test w generator fałszywych alarmów.
// ---------------------------------------------------------------------------

const OKALECZENIA = [
  // czasowniki i formy, które wystąpiły w pierwotnych 46 wyjaśnieniach
  { zle: 'uzywamy', dobrze: 'używamy' },
  { zle: 'uzywa', dobrze: 'używa' },
  { zle: 'mowimy', dobrze: 'mówimy' },
  { zle: 'zmienia sie', dobrze: 'zmienia się' },
  { zle: 'lezy', dobrze: 'leży' },
  { zle: 'moge', dobrze: 'mogę' },
  // spójnik „więc" — najczęstsze okaleczenie w tym pliku (14 wystąpień)
  { zle: 'wiec', dobrze: 'więc' },
  { zle: 'wiecej', dobrze: 'więcej' },
  { zle: 'niz ', dobrze: 'niż' },
  // rzeczowniki gramatyczne
  { zle: 'koncowk', dobrze: 'końcówk' },
  { zle: 'forme', dobrze: 'formę' },
  { zle: 'osobe', dobrze: 'osobę' },
  { zle: 'jedna rzecz,', dobrze: 'jedną rzecz,' },
  // zaimki i przyimki
  { zle: 'kims', dobrze: 'kimś' },
  { zle: 'kogos', dobrze: 'kogoś' },
  { zle: 'zadne', dobrze: 'żadne' },
  { zle: 'goly', dobrze: 'goły' },
  { zle: 'byc ', dobrze: 'być' },
  { zle: 'sa w formie', dobrze: 'są w formie' },
  { zle: 'maja -ing', dobrze: 'mają -ing' },
  // konkretne frazy z pierwszej partii
  { zle: 'Spedzam', dobrze: 'Spędzam' },
  { zle: 'sobote', dobrze: 'sobotę' },
  { zle: 'rodzina.', dobrze: 'rodziną.' },
  { zle: 'z tata', dobrze: 'z tatą' },
  { zle: 'srodkach', dobrze: 'środkach' },
  { zle: 'gorach', dobrze: 'górach' },
  { zle: 'wedrowce', dobrze: 'wędrówce' },
];

const WSZYSTKIE = zdania.ZESTAWY.flatMap((z) => z.zdania);

test('żadne wyjaśnienie nie jest napisane po polsku bez diakrytyków', () => {
  const znalezione = [];
  for (const z of WSZYSTKIE) {
    const tekst = z.wyjasnienie.toLowerCase();
    for (const o of OKALECZENIA) {
      if (tekst.includes(o.zle.toLowerCase())) {
        znalezione.push(`"${z.zdanie}" → "${z.wyjasnienie}" zawiera "${o.zle}" zamiast "${o.dobrze}"`);
      }
    }
  }
  assert.deepStrictEqual(znalezione, [],
    'Wyjaśnienia wyświetlają się dziecku po każdej odpowiedzi, a druga część gry uczy ' +
    'ortografii — polskie słowa muszą mieć diakrytyki:\n  ' + znalezione.join('\n  '));
});

test('lista okaleczeń faktycznie łapie regresję (strażnik samego testu)', () => {
  // Test z pustą albo martwą listą świeciłby na zielono, nie sprawdzając niczego.
  // Sprawdzamy więc, że każdy wpis jest w stanie trafić w tekst, który go zawiera,
  // a poprawna wersja tego samego słowa NIE jest łapana.
  assert.ok(OKALECZENIA.length >= 20, 'lista okaleczeń podejrzanie krótka');
  for (const o of OKALECZENIA) {
    const przyklad = 'Zdanie testowe ' + o.zle + ' dalej.';
    assert.ok(przyklad.toLowerCase().includes(o.zle.toLowerCase()), `wzorzec "${o.zle}" nie trafia`);
    assert.ok(!o.dobrze.toLowerCase().includes(o.zle.toLowerCase()),
      `wzorzec "${o.zle}" łapie też poprawną formę "${o.dobrze}" — to byłby fałszywy alarm`);
  }
});

test('wyjaśnienia z polskimi znakami przetrwały w danych (nie zostały zesłane do ASCII)', () => {
  // Odwrotny strażnik: gdyby ktoś „naprawił kodowanie", usuwając ogonki,
  // poprzedni test nadal by przeszedł dla słów spoza listy. Ten nie.
  const zDiakrytykami = WSZYSTKIE.filter((z) => /[ąćęłńóśźż]/i.test(z.wyjasnienie));
  assert.ok(zDiakrytykami.length >= 60,
    `tylko ${zDiakrytykami.length} wyjaśnień ma polskie znaki — czy plik nie stracił kodowania?`);
});
