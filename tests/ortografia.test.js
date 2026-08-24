const test = require('node:test');
const assert = require('node:assert');
const o = require('../dane/ortografia.js');

test('są zestawy ó/u, rz/ż, ch/h', () => {
  const ids = o.ZESTAWY.map((z) => z.id);
  for (const wymagany of ['o-u', 'rz-z', 'ch-h']) {
    assert.ok(ids.includes(wymagany), `brak zestawu ${wymagany}`);
  }
});

test('każdy zestaw ma co najmniej 15 wyrazów', () => {
  for (const z of o.ZESTAWY) {
    assert.ok(z.wyrazy.length >= 15, `${z.id} ma tylko ${z.wyrazy.length} wyrazów`);
  }
});

test('KAŻDY wyraz ma niepustą zasadę', () => {
  for (const z of o.ZESTAWY) {
    for (const w of z.wyrazy) {
      assert.ok(w.zasada && w.zasada.length > 5, `brak zasady dla "${w.wyraz}"`);
    }
  }
});

test('luka wskazuje na znak, który faktycznie jest poprawną odpowiedzią', () => {
  for (const z of o.ZESTAWY) {
    for (const w of z.wyrazy) {
      const znak = w.wyraz.substr(w.luka, w.poprawny.length);
      assert.strictEqual(znak, w.poprawny, `luka nie trafia w "${w.poprawny}" w "${w.wyraz}"`);
      assert.ok(z.warianty.includes(w.poprawny), `"${w.poprawny}" spoza wariantów ${z.id}`);
    }
  }
});

test('generuj tworzy treść z podkreślnikiem i poprawną odpowiedzią', () => {
  const pytania = o.generuj('o-u', 10);
  assert.strictEqual(pytania.length, 10);
  for (const p of pytania) {
    assert.ok(p.tresc.includes('_'), `"${p.tresc}" nie ma luki`);
    assert.deepStrictEqual(p.warianty, ['ó', 'u']);
    assert.ok(p.wyjasnienie.length > 5);
  }
});

test('generuj nie powtarza wyrazu, dopóki starcza materiału', () => {
  const pytania = o.generuj('o-u', 10);
  const unikalne = new Set(pytania.map((p) => p.id));
  assert.strictEqual(unikalne.size, 10);
});

test('każdy zestaw miesza oba warianty', () => {
  for (const z of o.ZESTAWY) {
    for (const wariant of z.warianty) {
      const ile = z.wyrazy.filter((w) => w.poprawny === wariant).length;
      assert.ok(ile >= 5, `${z.id} ma tylko ${ile} wyrazów z "${wariant}"`);
    }
  }
});

test('treść ma dokładnie jeden podkreślnik, także dla dwuznaków', () => {
  for (const z of o.ZESTAWY) {
    for (const w of z.wyrazy) {
      const pytania = o.generuj(z.id, 1);
      assert.ok(pytania.length === 1);
      const t = z.wyrazy
        .map((x) => x.wyraz.slice(0, x.luka) + '_' + x.wyraz.slice(x.luka + x.poprawny.length));
      for (const tresc of t) {
        assert.strictEqual(tresc.split('_').length - 1, 1, `zła liczba luk w "${tresc}"`);
      }
      break;
    }
  }
});

test('generuj dla nieznanego zestawu zwraca pustą tablicę', () => {
  assert.deepStrictEqual(o.generuj('nie-ma-takiego', 5), []);
});
