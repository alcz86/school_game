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
    // generujemy tyle pytań, ile jest wyrazów — każdy wyraz trafia do treści
    const pytania = o.generuj(z.id, z.wyrazy.length);
    assert.strictEqual(pytania.length, z.wyrazy.length);
    for (const p of pytania) {
      const luk = p.tresc.split('_').length - 1;
      assert.strictEqual(luk, 1, `zła liczba luk (${luk}) w "${p.tresc}"`);
      assert.strictEqual(
        p.tresc.replace('_', p.odpowiedz),
        p.wyjasnienie.split(' — ')[0],
        `wstawienie odpowiedzi nie odtwarza wyrazu: "${p.tresc}"`
      );
    }
  }
});

test('warianty w pytaniu to kopia, nie referencja do danych źródłowych', () => {
  const zestaw = o.ZESTAWY.find((z) => z.id === 'rz-z');
  const przed = zestaw.warianty.slice();
  const p = o.generuj('rz-z', 1)[0];
  p.warianty.push('SKAZA');
  assert.deepStrictEqual(zestaw.warianty, przed, 'mutacja pytania skaziła ZESTAWY');
});

test('losowanie obejmuje CALY zestaw, nie tylko poczatek listy', () => {
  // Regresja: `pula.slice(0, ile)` przed tasowaniem powodowalo, ze gra pokazywala
  // stale pierwsze `ile` wyrazow. A dane sa pogrupowane wariantami, wiec przez cala
  // runde poprawna odpowiedzia bylo zawsze warianty[0].
  for (const z of o.ZESTAWY) {
    const widziane = new Set();
    for (let i = 0; i < 200; i++) {
      for (const p of o.generuj(z.id, 8, {})) widziane.add(p.id);
    }
    assert.strictEqual(widziane.size, z.wyrazy.length,
      `${z.id}: wylosowano tylko ${widziane.size} z ${z.wyrazy.length} wyrazow`);
  }
});

test('obie odpowiedzi pojawiaja sie w rundzie — zaden wariant nie dominuje', () => {
  for (const z of o.ZESTAWY) {
    const licznik = {};
    for (const w of z.warianty) licznik[w] = 0;
    for (let i = 0; i < 200; i++) {
      for (const p of o.generuj(z.id, 8, {})) licznik[p.odpowiedz] += 1;
    }
    const suma = z.warianty.reduce((s, w) => s + licznik[w], 0);
    for (const w of z.warianty) {
      const udzial = licznik[w] / suma;
      assert.ok(udzial > 0.2,
        `${z.id}: wariant "${w}" to tylko ${Math.round(udzial * 100)}% poprawnych odpowiedzi`);
    }
  }
});

test('wyrazy wczesniej mylone wracaja czesciej', () => {
  const z = o.ZESTAWY.find((x) => x.id === 'o-u');
  const cel = z.wyrazy[z.wyrazy.length - 1];          // z KOŃCA listy, bez wag nieuprzywilejowany
  const wagi = {}; wagi['o-u:' + cel.wyraz] = 9;
  let zWagami = 0; let bezWag = 0;
  for (let i = 0; i < 200; i++) {
    if (o.generuj('o-u', 5, wagi).some((p) => p.id === 'o-u:' + cel.wyraz)) zWagami += 1;
    if (o.generuj('o-u', 5, {}).some((p) => p.id === 'o-u:' + cel.wyraz)) bezWag += 1;
  }
  assert.strictEqual(zWagami, 200, 'wyraz z waga musi trafiac do kazdej rundy');
  assert.ok(bezWag < 150, 'bez wagi wyraz nie moze byc w kazdej rundzie (' + bezWag + '/200)');
});

test('generuj dla nieznanego zestawu zwraca pustą tablicę', () => {
  assert.deepStrictEqual(o.generuj('nie-ma-takiego', 5), []);
});
