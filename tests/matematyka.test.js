const test = require('node:test');
const assert = require('node:assert');
const m = require('../dane/matematyka.js');

test('POZIOMY ma pięć poziomów w ustalonej kolejności', () => {
  assert.deepStrictEqual(
    m.POZIOMY.map((p) => p.id),
    ['latwe', 'srednie', 'trudne', 'dzielenie', 'mieszane']
  );
});

test('generuj zwraca żądaną liczbę pytań', () => {
  assert.strictEqual(m.generuj('trudne', 10).length, 10);
});

test('każde wygenerowane pytanie ma poprawną odpowiedź', () => {
  for (const poziom of m.POZIOMY) {
    for (const p of m.generuj(poziom.id, 30)) {
      const [a, znak, b] = p.tresc.split(' ');
      const oczekiwana = znak === '×' ? Number(a) * Number(b) : Number(a) / Number(b);
      assert.strictEqual(
        Number(p.odpowiedz), oczekiwana,
        `zła odpowiedź dla "${p.tresc}" na poziomie ${poziom.id}`
      );
    }
  }
});

test('poziom trudne używa tylko mnożników 6-9', () => {
  for (const p of m.generuj('trudne', 40)) {
    const [a, , b] = p.tresc.split(' ');
    assert.ok(
      [Number(a), Number(b)].some((n) => n >= 6 && n <= 9),
      `"${p.tresc}" nie zawiera mnożnika 6-9`
    );
  }
});

test('dzielenie zawsze wychodzi bez reszty i w zakresie 100', () => {
  for (const p of m.generuj('dzielenie', 40)) {
    const [a, znak, b] = p.tresc.split(' ');
    assert.strictEqual(znak, ':');
    assert.ok(Number(a) <= 100, `${p.tresc} przekracza 100`);
    assert.strictEqual(Number(a) % Number(b), 0, `${p.tresc} ma resztę`);
  }
});

test('wagi zwiększają częstość mylonych działań', () => {
  const wagi = { '7x8': 50 };
  const pytania = m.generuj('trudne', 60, wagi);
  const ile = pytania.filter((p) => p.id === '7x8').length;
  assert.ok(ile >= 5, `oczekiwano częstego 7x8, było ${ile}`);
});

test('wagi nie wciagaja dzialan spoza biezacego poziomu', () => {
  for (const p of m.generuj('latwe', 60, { '7x8': 50 })) {
    const [a, znak, b] = p.tresc.split(' ');
    assert.strictEqual(znak, '×');
    assert.ok(
      [2, 5, 10].includes(Number(a)),
      `"${p.tresc}" ma mnoznik spoza poziomu latwe`
    );
  }
});

test('czestosc rosnie proporcjonalnie do wagi', () => {
  const wagi = { '7x8': 100, '6x6': 1 };
  const pytania = m.generuj('trudne', 3000, wagi);
  const czesto = pytania.filter((p) => p.id === '7x8').length;
  const rzadko = pytania.filter((p) => p.id === '6x6').length;
  assert.ok(
    czesto > rzadko * 5,
    `oczekiwano wyraznej przewagi 7x8, bylo ${czesto} vs ${rzadko}`
  );
});
