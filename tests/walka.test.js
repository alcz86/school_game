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

test('pomylone pytanie wraca po dokladnie dwoch kolejnych pytaniach', () => {
  const pula = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({
    id, tresc: id, odpowiedz: 'ok-' + id, wyjasnienie: '',
  }));
  let s = walka.nowaWalka(pula, { zycieBossa: 50 });
  assert.strictEqual(s.aktualne.id, 'a');
  s = walka.odpowiedz(s, 'zle');            // 'a' pomylone
  assert.strictEqual(s.aktualne.id, 'b');   // nastepne
  s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  assert.strictEqual(s.aktualne.id, 'c');   // jeszcze jedno
  s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  assert.strictEqual(s.aktualne.id, 'a', 'pomylone pytanie musi wrocic jako trzecie z kolei');
});

test('pomylone pytanie wraca, gdy reszta rundy to same poprawne odpowiedzi', () => {
  // NAJWAZNIEJSZY przypadek dydaktyczny i najlatwiejszy do przeoczenia: dziecko
  // myli JEDNO pytanie, potem odpowiada bezblednie. Przy dokladaniu pomylonego
  // pytania na koniec kolejki boss ginial, zanim ono wrocilo — powtorka istniala
  // w kodzie, ale nigdy nie pojawiala sie na ekranie.
  const pula = [];
  for (let i = 0; i < 12; i++) pula.push({ id: 'p' + i, tresc: 'p' + i, odpowiedz: 'ok' + i, wyjasnienie: '' });

  let s = walka.nowaWalka(pula, { zycieBossa: 10 });
  const pomylone = s.aktualne.id;
  s = walka.odpowiedz(s, 'zle');

  let wrocilo = false;
  while (!s.skonczona) {
    if (s.aktualne.id === pomylone) wrocilo = true;
    s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  }
  assert.strictEqual(s.wynik, 'wygrana');
  assert.ok(wrocilo, 'pomylone pytanie musi wrocic przed koncem rundy');
});

test('pomylone pytanie wraca takze przy bardzo krotkiej kolejce', () => {
  // kolejka krotsza niz 2 — splice dokłada na koniec, co jest prawidlowe
  const s = walka.odpowiedz(walka.nowaWalka(P, { zycieBossa: 10 }), '5');
  assert.ok(s.kolejka.some((p) => p.id === 'a'));
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

test('wyczerpanie puli pytan nie konczy walki, gdy boss zyje', () => {
  let s = walka.nowaWalka(P, { zycieBossa: 30 });
  for (let i = 0; i < 8; i++) {
    assert.strictEqual(s.skonczona, false, 'walka nie moze sie skonczyc po ' + i + ' odpowiedziach');
    assert.ok(s.aktualne, 'zawsze musi byc kolejne pytanie');
    s = walka.odpowiedz(s, s.aktualne.odpowiedz);
  }
  assert.strictEqual(s.wynik, null);
});

test('odpowiedz nie mutuje przekazanego stanu', () => {
  const s0 = walka.nowaWalka(P, { zycieBossa: 10 });
  walka.odpowiedz(s0, '4');
  assert.strictEqual(s0.zycieBossa, 10);
  assert.strictEqual(s0.combo, 0);
});

// -------------------------------------------------------- odpowiedzi liczbowe

test('odpowiedz czysto liczbowa porownuje sie liczbowo — "07" to 7', () => {
  const P7 = [{ id: '1x7', tresc: '1 x 7', odpowiedz: '7' }];
  let s = walka.nowaWalka(P7, { zycieBossa: 10 });
  s = walka.odpowiedz(s, '07');
  assert.strictEqual(s.ostatnia.poprawna, true, '"07" musi zaliczyc sie jako 7');
  assert.strictEqual(s.serca, 3, 'nie wolno odbierac serca za wiodace zero');
});

test('porownanie liczbowe nie psuje odpowiedzi tekstowych ani pustej odpowiedzi', () => {
  // Number('') === 0 — pulapka, ktora juz raz wystapila w tym projekcie.
  assert.strictEqual(walka.rowne('', '0'), false, 'pusta odpowiedz nie moze zaliczyc "0"');
  assert.strictEqual(walka.rowne('   ', '0'), false);
  assert.strictEqual(walka.rowne('0x10', '16'), false, 'bez rzutowania hexa');
  assert.strictEqual(walka.rowne('7.0', '7'), false, 'kropka nie wchodzi do galezi liczbowej');
  assert.strictEqual(walka.rowne('  NOTEBOOK ', 'notebook'), true);
  assert.strictEqual(walka.rowne('rz', 'z'), false);
  assert.strictEqual(walka.rowne('0', '0'), true);
  assert.strictEqual(walka.rowne('007', '7'), true);
});
