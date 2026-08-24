const test = require('node:test');
const assert = require('node:assert');
const walka = require('../js/walka.js');

const P = [
  { id: 'a', tresc: '2×2', odpowiedz: '4', wyjasnienie: '' },
  { id: 'b', tresc: '3×3', odpowiedz: '9', wyjasnienie: '' },
];

test('mnoznikCombo: 1 do 2 trafień, ×2 od 3, ×3 od 5', () => {
  assert.strictEqual(walka.mnoznikCombo(0), 1);
  assert.strictEqual(walka.mnoznikCombo(2), 1);
  assert.strictEqual(walka.mnoznikCombo(3), 2);
  assert.strictEqual(walka.mnoznikCombo(4), 2);
  assert.strictEqual(walka.mnoznikCombo(5), 3);
  assert.strictEqual(walka.mnoznikCombo(9), 3);
});

test('nowaWalka ustawia 3 serca i pełne życie bossa', () => {
  const s = walka.nowaWalka(P, { zycieBossa: 10 });
  assert.strictEqual(s.serca, 3);
  assert.strictEqual(s.zycieBossa, 10);
  assert.strictEqual(s.combo, 0);
  assert.strictEqual(s.aktualne.id, 'a');
  assert.strictEqual(s.skonczona, false);
});

test('poprawna odpowiedź zabiera bossowi życie i podnosi combo', () => {
  const s = walka.odpowiedz(walka.nowaWalka(P, { zycieBossa: 10 }), '4');
  assert.strictEqual(s.zycieBossa, 9);
  assert.strictEqual(s.combo, 1);
  assert.strictEqual(s.serca, 3);
  assert.strictEqual(s.ostatnia.poprawna, true);
});

test('błędna odpowiedź zabiera serce, zeruje combo i podaje poprawną', () => {
  const s = walka.odpowiedz(walka.nowaWalka(P, { zycieBossa: 10 }), '5');
  assert.strictEqual(s.serca, 2);
  assert.strictEqual(s.combo, 0);
  assert.strictEqual(s.zycieBossa, 10);
  assert.strictEqual(s.ostatnia.poprawna, false);
  assert.strictEqual(s.ostatnia.oczekiwana, '4');
});

test('błędne pytanie wraca do kolejki tej samej rundy', () => {
  const s = walka.odpowiedz(walka.nowaWalka(P, { zycieBossa: 10 }), '5');
  assert.ok(s.kolejka.some((p) => p.id === 'a'), 'pytanie a musi wrócić do kolejki');
});

test('combo ×2 zadaje podwójne obrażenia', () => {
  let s = walka.nowaWalka(P, { zycieBossa: 20 });
  s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  assert.strictEqual(s.zycieBossa, 18);
  s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  assert.strictEqual(s.zycieBossa, 16, 'trzecie trafienie to już ×2');
  assert.strictEqual(s.ostatnia.mnoznik, 2);
});

test('zbicie życia bossa do zera kończy walkę wygraną', () => {
  let s = walka.nowaWalka(P, { zycieBossa: 1 });
  s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  assert.strictEqual(s.skonczona, true);
  assert.strictEqual(s.wynik, 'wygrana');
});

test('utrata trzech serc kończy walkę przegraną', () => {
  let s = walka.nowaWalka(P, { zycieBossa: 50 });
  s = walka.odpowiedz(s, 'zle');
  s = walka.odpowiedz(s, 'zle');
  s = walka.odpowiedz(s, 'zle');
  assert.strictEqual(s.serca, 0);
  assert.strictEqual(s.skonczona, true);
  assert.strictEqual(s.wynik, 'przegrana');
});

test('odpowiedz nie mutuje przekazanego stanu', () => {
  const s0 = walka.nowaWalka(P, { zycieBossa: 10 });
  walka.odpowiedz(s0, '4');
  assert.strictEqual(s0.zycieBossa, 10);
  assert.strictEqual(s0.combo, 0);
});
