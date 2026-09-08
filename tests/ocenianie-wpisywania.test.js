const test = require('node:test');
const assert = require('node:assert');
const walka = require('../js/walka.js');
const zdania = require('../dane/zdania.js');

// ---------------------------------------------------------------------------
// PO CO TEN PLIK
//
// Zgłoszenie z prawdziwej gry (matka + 9-latek, 2026-09-08): gra odrzuciła
// poprawne odpowiedzi w trybie wpisywania z dwóch niezależnych powodów.
//
// 1. `normalizuj` robiło tylko trim().toLowerCase(), więc "aren’t" wpisane
//    na tablecie (iOS/Android zamieniają U+0027 na U+2019 automatycznie)
//    nie równało się "aren't" z danych. Siedem zdań w materiale ma apostrof
//    w poprawnej odpowiedzi, a na ekranie oba znaki wyglądają identycznie.
// 2. Część zdań ma DWIE poprawne odpowiedzi, gdy nie widać obrazka
//    z podręcznika ("My sister and I ____ scared." przyjmuje "are" i "aren't").
//    Wcześniejsze recenzje sprawdzały tylko dystraktory — w trybie wpisywania
//    dystraktorów nie ma.
// ---------------------------------------------------------------------------

function pytanie(odpowiedz, takze) {
  return { id: 'x', tresc: 't', odpowiedz, takze_poprawne: takze || null };
}
const przyjmuje = (odp, p) => walka.pasuje(odp, p);

// --- USTERKA 1: warianty apostrofu -----------------------------------------

const APOSTROFY = ["'", '’', '‘', '`', '´'];

test('każdy wariant apostrofu znaczy to samo — w obie strony', () => {
  const SKROTY = ["isn't", "aren't", "don't", "doesn't", "haven't", "hasn't", "can't"];
  for (const skrot of SKROTY) {
    for (const znak of APOSTROFY) {
      const wpisane = skrot.replace("'", znak);
      assert.ok(przyjmuje(wpisane, pytanie(skrot)),
        `dziecko wpisało "${wpisane}", oczekiwane "${skrot}" — powinno być zaliczone`);
      // I odwrotnie: gdyby to dane miały typograficzny apostrof.
      assert.ok(przyjmuje(skrot, pytanie(wpisane)),
        `oczekiwane "${wpisane}", dziecko wpisało "${skrot}" — powinno być zaliczone`);
    }
  }
});

test('konkretny przypadek ze zgłoszenia: aren’t z iPada', () => {
  assert.ok(przyjmuje('aren’t', pytanie("aren't")));
});

// --- USTERKA 1: formy rozwinięte -------------------------------------------

const PARY = [
  ['are not', "aren't"],
  ['is not', "isn't"],
  ['do not', "don't"],
  ['does not', "doesn't"],
  ['have not', "haven't"],
  ['has not', "hasn't"],
  ['can not', "can't"],
  ['cannot', "can't"],
];

test('forma rozwinięta i skrócona są równoważne — w obie strony', () => {
  for (const [rozwinieta, skrocona] of PARY) {
    assert.ok(przyjmuje(rozwinieta, pytanie(skrocona)),
      `dziecko wpisało "${rozwinieta}", oczekiwane "${skrocona}"`);
    assert.ok(przyjmuje(skrocona, pytanie(rozwinieta)),
      `dziecko wpisało "${skrocona}", oczekiwane "${rozwinieta}"`);
  }
});

test('rozwinięcie działa też z typograficznym apostrofem po drugiej stronie', () => {
  assert.ok(przyjmuje('are not', pytanie('aren’t')));
  assert.ok(przyjmuje('cannot', pytanie('can’t')));
});

test('wielokrotne spacje w środku nie psują porównania', () => {
  assert.ok(przyjmuje('are  not', pytanie("aren't")));
  assert.ok(przyjmuje('  are   not  ', pytanie('are not')));
  assert.ok(przyjmuje('can  not', pytanie('cannot')));
});

test('rozluźnienie nie skleja form, które NIE są zamiennikami', () => {
  // "am not" nie ma formy skróconej w jednym słowie i nie może się zrównać
  // z niczym innym; "is not" nie może zrównać się z "are not".
  assert.ok(!przyjmuje('am not', pytanie("isn't")));
  assert.ok(!przyjmuje('is not', pytanie("aren't")));
  assert.ok(!przyjmuje("don't", pytanie("doesn't")));
  assert.ok(!przyjmuje('have', pytanie("haven't")));
  assert.ok(!przyjmuje('can', pytanie("can't")));
});

// --- USTERKA 1: zachowania, których NIE WOLNO było zepsuć -------------------

test('porównanie liczbowe z klawiatury numerycznej działa dalej', () => {
  assert.ok(walka.rowne('07', '7'));
  assert.ok(walka.rowne('7', '07'));
  assert.ok(walka.rowne(' 12 ', '12'));
  assert.ok(!walka.rowne('8', '7'));
});

test('wąski warunek liczbowy pozostaje wąski', () => {
  // Number('') === 0, Number(' ') === 0, Number('0x10') === 16 — żadne z nich
  // nie może zaliczyć się przy oczekiwanym "0" / "16".
  assert.ok(!walka.rowne('', '0'));
  assert.ok(!walka.rowne('   ', '0'));
  assert.ok(!walka.rowne('0x10', '16'));
  assert.ok(!walka.rowne('-7', '7'));
  assert.ok(!walka.rowne('7.0', '7'));
});

test('odpowiedzi jednowyrazowe działają jak dotąd', () => {
  assert.ok(walka.rowne('  Dog ', 'dog'));
  assert.ok(walka.rowne('rzeka', 'rzeka'));
  assert.ok(!walka.rowne('kot', 'pies'));
  assert.ok(!walka.rowne('', 'dog'));
});

// --- USTERKA 2: dodatkowe akceptowane odpowiedzi ----------------------------

test('takze_poprawne jest zaliczane, a forma spoza listy nie', () => {
  const p = pytanie("aren't", ['are']);
  assert.ok(przyjmuje("aren't", p), 'odpowiedź z podręcznika');
  assert.ok(przyjmuje('are', p), 'druga poprawna forma');
  assert.ok(przyjmuje('are not', p), 'rozwinięcie działa też na alternatywie');
  assert.ok(!przyjmuje("isn't", p));
  assert.ok(!przyjmuje('am', p));
});

test('brak pola takze_poprawne niczego nie rozluźnia', () => {
  const p = pytanie("isn't");
  assert.ok(przyjmuje("isn't", p));
  assert.ok(!przyjmuje('is', p), 'bez pola forma przeciwna MUSI być odrzucona');
});

const wGrze = zdania.ZESTAWY.find((z) => z.id === 'zdania-klasa3').zdania;
const zAlternatywa = wGrze.filter((z) => z.takze_poprawne);

test('w materiale w ogóle są zdania z alternatywą (strażnik samego testu)', () => {
  assert.ok(zAlternatywa.length >= 20,
    `tylko ${zAlternatywa.length} zdań z takze_poprawne — pole zniknęło z danych?`);
});

test('dla każdego zdania z takze_poprawne każda wymieniona forma jest zaliczana', () => {
  for (const z of zAlternatywa) {
    assert.ok(przyjmuje(z.odpowiedz, z), `"${z.zdanie}": odrzuca własną odpowiedź`);
    for (const alt of z.takze_poprawne) {
      assert.ok(przyjmuje(alt, z), `"${z.zdanie}": nie zalicza "${alt}"`);
    }
  }
});

test('żadna forma spoza odpowiedzi i takze_poprawne nie jest zaliczana', () => {
  for (const z of wGrze) {
    const dozwolone = [z.odpowiedz].concat(z.takze_poprawne || []);
    for (const d of z.dystraktory) {
      assert.ok(!przyjmuje(d, z),
        `"${z.zdanie}": dystraktor "${d}" jest zaliczany, a nie powinien ` +
        `(dozwolone: ${dozwolone.join(' / ')})`);
    }
    // Formy z innych zdań też nie mogą przechodzić „przy okazji".
    for (const obca of ['xyz', 'be', 'was', 'am not']) {
      if (dozwolone.includes(obca)) continue;
      assert.ok(!przyjmuje(obca, z), `"${z.zdanie}": zalicza obcą formę "${obca}"`);
    }
  }
});

test('alternatywa nigdy nie jest jednym z dystraktorów tego samego zdania', () => {
  // Gdyby była, tryb wyboru pokazałby dwa poprawne przyciski.
  for (const z of zAlternatywa) {
    for (const alt of z.takze_poprawne) {
      assert.ok(!z.dystraktory.includes(alt),
        `"${z.zdanie}": "${alt}" jest jednocześnie alternatywą i dystraktorem`);
    }
  }
});

test('zdania z wymuszonym kontekstem NIE dostały alternatywy', () => {
  // Lista jest jawna: to są przypadki, w których zdanie samo rozstrzyga formę,
  // więc przyjęcie formy przeciwnej pochwaliłoby błąd.
  const WYMUSZONE = [
    'There ____ any old gadgets in this museum.',   // "any" wymusza przeczenie
    'I ____ eat meat, please give me peas.',        // druga część zdania wymusza przeczenie
    'Kevin is not an adult, but he ____ tall.',     // "but" po przeczeniu wymusza twierdzenie
    '____ he hiking? Yes, he is.',                  // odpowiedź w zdaniu wymusza formę
    'Are you playing tennis? No, I ____ not.',      // "not" już stoi w zdaniu
    'Mark is ten years old. He ____ elderly.',      // wiek rozstrzyga sens
  ];
  const po = new Map(wGrze.map((z) => [z.zdanie, z]));
  for (const zd of WYMUSZONE) {
    const z = po.get(zd);
    assert.ok(z, `zdanie kontrolne zniknęło z materiału: "${zd}"`);
    assert.ok(!z.takze_poprawne,
      `"${zd}" dostało takze_poprawne, a kontekst w zdaniu rozstrzyga formę`);
  }
});

// --- integracja z walką ----------------------------------------------------

test('walka.odpowiedz honoruje alternatywę i apostrof z tabletu', () => {
  const p = { id: 'z1', tresc: 'My sister and I ____ scared.', odpowiedz: "aren't",
    takze_poprawne: ['are'], wyjasnienie: '' };
  for (const wpisane of ['are', "aren't", 'aren’t', 'are not', 'ARE  NOT']) {
    const stan = walka.nowaWalka([p], { zycieBossa: 10, serca: 3 });
    const nowy = walka.odpowiedz(stan, wpisane);
    assert.ok(nowy.ostatnia.poprawna, `"${wpisane}" powinno być zaliczone`);
    assert.strictEqual(nowy.serca, 3);
  }
  const zle = walka.odpowiedz(walka.nowaWalka([p], { zycieBossa: 10, serca: 3 }), "isn't");
  assert.ok(!zle.ostatnia.poprawna);
  assert.strictEqual(zle.serca, 2);
});
