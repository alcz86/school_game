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
