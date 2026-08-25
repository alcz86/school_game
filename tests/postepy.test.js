const test = require('node:test');
const assert = require('node:assert');
const postepy = require('../js/postepy.js');

function magazynPamieciowy() {
  const dane = {};
  return {
    getItem: (k) => (k in dane ? dane[k] : null),
    setItem: (k, v) => { dane[k] = String(v); },
    removeItem: (k) => { delete dane[k]; },
  };
}

test('statystyki na czystym magazynie są puste, nie wybuchają', () => {
  const p = postepy.utworz(magazynPamieciowy());
  const s = p.statystyki();
  assert.deepStrictEqual(s.najczestszeBledy, []);
  assert.strictEqual(s.dniZRzedu, 0);
});

test('liczy procent poprawnych osobno dla trybu i zestawu', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', false);
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', true);
  p.zapiszOdpowiedz('matematyka', 'trudne', '6x6', true);
  p.zapiszOdpowiedz('angielski', 'klasa2-powtorka', 'bread', true);

  const s = p.statystyki();
  assert.strictEqual(s.tryby.matematyka.trudne.wszystkie, 3);
  assert.strictEqual(s.tryby.matematyka.trudne.poprawne, 2);
  assert.strictEqual(s.tryby.matematyka.trudne.procent, 67);
  assert.strictEqual(s.tryby.angielski['klasa2-powtorka'].procent, 100);
});

test('najczestszeBledy sortuje malejąco i tnie do 10', () => {
  const p = postepy.utworz(magazynPamieciowy());
  for (let i = 0; i < 3; i++) p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', false);
  p.zapiszOdpowiedz('matematyka', 'trudne', '6x9', false);
  for (let i = 0; i < 12; i++) p.zapiszOdpowiedz('matematyka', 'trudne', 'x' + i, false);

  const bledy = p.statystyki().najczestszeBledy;
  assert.strictEqual(bledy.length, 10);
  assert.strictEqual(bledy[0].id, '7x8');
  assert.strictEqual(bledy[0].bledy, 3);
});

test('poprawna odpowiedź nie trafia do błędów', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('matematyka', 'trudne', '2x2', true);
  assert.deepStrictEqual(p.statystyki().najczestszeBledy, []);
});

test('wagi zwracają tylko liczby błędów dla danego trybu i zestawu', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', false);
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', false);
  p.zapiszOdpowiedz('matematyka', 'latwe', '2x2', false);
  assert.deepStrictEqual(p.wagi('matematyka', 'trudne'), { '7x8': 2 });
});

test('dane przeżywają utworzenie nowego obiektu na tym samym magazynie', () => {
  const m = magazynPamieciowy();
  postepy.utworz(m).zapiszOdpowiedz('matematyka', 'trudne', '7x8', true);
  assert.strictEqual(postepy.utworz(m).statystyki().tryby.matematyka.trudne.wszystkie, 1);
});

test('reset czyści wszystko', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', false);
  p.reset();
  assert.deepStrictEqual(p.statystyki().najczestszeBledy, []);
});

test('data jest lokalna, nie UTC', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', true);
  const teraz = new Date();
  const oczekiwana =
    teraz.getFullYear() + '-' +
    String(teraz.getMonth() + 1).padStart(2, '0') + '-' +
    String(teraz.getDate()).padStart(2, '0');
  assert.strictEqual(p.statystyki().ostatnioGrane, oczekiwana);
});

test('uszkodzone dane w magazynie nie wywracają gry', () => {
  const m = magazynPamieciowy();
  m.setItem('gra-szkolna-postepy', '{to nie jest json');
  const s = postepy.utworz(m).statystyki();
  assert.deepStrictEqual(s.najczestszeBledy, []);
});

// ------------------------------------- pierwsze podejscie vs darmowa powtorka

test('powtorka po pomylce nie wchodzi do skutecznosci, ale zlicza blad do wag', () => {
  const p = postepy.utworz(magazynPamieciowy());
  // dziecko myli pytanie, po dwoch krokach widzi je znowu i trafia (odpowiedz
  // byla na ekranie 1,2 s wczesniej) — to NIE jest dowod wiedzy
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', false, true);
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', true, false);

  const s = p.statystyki();
  assert.strictEqual(s.tryby.matematyka.trudne.wszystkie, 1, 'powtorka nie zwieksza liczby prob');
  assert.strictEqual(s.tryby.matematyka.trudne.poprawne, 0);
  assert.strictEqual(s.tryby.matematyka.trudne.procent, 0, 'ekran rodzica ma pokazac 0%, nie 50%');
  assert.deepStrictEqual(p.wagi('matematyka', 'trudne'), { '7x8': 1 }, 'blad musi karmic wagi');
});

test('zawyzenie procentu jest zablokowane na calej rundzie', () => {
  const p = postepy.utworz(magazynPamieciowy());
  // 10 pytan, dziecko umie 3 — reszte myli za pierwszym razem i poprawia w powtorce
  for (let i = 0; i < 10; i++) {
    const umie = i < 3;
    p.zapiszOdpowiedz('matematyka', 'trudne', 'q' + i, umie, true);
    if (!umie) p.zapiszOdpowiedz('matematyka', 'trudne', 'q' + i, true, false);
  }
  const s = p.statystyki();
  assert.strictEqual(s.tryby.matematyka.trudne.procent, 30,
    'realna wiedza to 30% — bez poprawki ekran pokazywalby 65%');
});

test('brak piatego argumentu znaczy pierwsze podejscie (zgodnosc wstecz)', () => {
  const p = postepy.utworz(magazynPamieciowy());
  p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', true);
  assert.strictEqual(p.statystyki().tryby.matematyka.trudne.wszystkie, 1);
});

// -------------------------------- liczba prob, suma mylonych, "zawsze mylone"

test('statystyki podaja liczbe prob i sume WSZYSTKICH mylonych pozycji', () => {
  const p = postepy.utworz(magazynPamieciowy());
  for (let i = 0; i < 15; i++) p.zapiszOdpowiedz('matematyka', 'trudne', 'q' + i, false, true);
  const s = p.statystyki();
  assert.strictEqual(s.najczestszeBledy.length, 10, 'lista nadal ucieta do 10');
  assert.strictEqual(s.mylonePozycje, 15, 'ale suma musi znac wszystkie 15');
  for (const b of s.najczestszeBledy) {
    assert.strictEqual(b.proby, 1);
    assert.strictEqual(b.bledyPierwsze, 1);
  }
});

test('zawszeMylone lapie pozycje 0/2, ktore wypadaja z listy najczestszych', () => {
  const p = postepy.utworz(magazynPamieciowy());
  // pozycja czesto mylona, ale w wiekszosci trafiana
  for (let i = 0; i < 4; i++) p.zapiszOdpowiedz('matematyka', 'trudne', 'czeste', false, true);
  for (let i = 0; i < 16; i++) p.zapiszOdpowiedz('matematyka', 'trudne', 'czeste', true, true);
  // pozycja mylona ZAWSZE, tylko dwa razy
  p.zapiszOdpowiedz('matematyka', 'trudne', 'zawsze', false, true);
  p.zapiszOdpowiedz('matematyka', 'trudne', 'zawsze', false, true);

  const s = p.statystyki();
  const zawsze = s.zawszeMylone.map((b) => b.id);
  assert.deepStrictEqual(zawsze, ['zawsze']);
  assert.strictEqual(s.zawszeMylone[0].proby, 2);
  assert.strictEqual(s.zawszeMylone[0].bledyPierwsze, 2);
  assert.ok(!zawsze.includes('czeste'), 'pozycja z 16 trafieniami nie jest "zawsze mylona"');

  const czeste = s.najczestszeBledy.find((b) => b.id === 'czeste');
  assert.strictEqual(czeste.proby, 20, 'lista ma pokazac mianownik, nie sama liczbe pomylek');
});

const OBCE_KSZTALTY = [
  '{to nie jest json',
  'null',
  '[]',
  '42',
  '"tekst"',
  '{"odpowiedzi":"nie-obiekt"}',
  '{"bledy":"nie-obiekt"}',
  '{"dni":"nie-tablica"}',
  '{"walki":"nie-tablica"}',
  '{"odpowiedzi":null}',
  '{"odpowiedzi":[]}',
];

for (const surowe of OBCE_KSZTALTY) {
  test('obcy kształt danych w magazynie nie wywraca gry i nie gubi zapisu: ' + surowe, () => {
    const m = magazynPamieciowy();
    m.setItem('gra-szkolna-postepy', surowe);
    const p = postepy.utworz(m);

    const s = p.statystyki();
    assert.deepStrictEqual(s.najczestszeBledy, []);
    assert.strictEqual(s.dniZRzedu, 0);
    for (const tryb of Object.keys(s.tryby)) {
      for (const zestaw of Object.keys(s.tryby[tryb])) {
        const cel = s.tryby[tryb][zestaw];
        assert.ok(!Number.isNaN(cel.poprawne));
        assert.ok(!Number.isNaN(cel.wszystkie));
        assert.ok(!Number.isNaN(cel.procent));
      }
    }

    assert.doesNotThrow(() => p.zapiszOdpowiedz('matematyka', 'trudne', '7x8', true));
    const s2 = p.statystyki();
    assert.strictEqual(s2.tryby.matematyka.trudne.wszystkie, 1);
    assert.strictEqual(s2.tryby.matematyka.trudne.poprawne, 1);
    assert.strictEqual(s2.tryby.matematyka.trudne.procent, 100);
  });
}
