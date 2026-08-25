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

test('zaden wyraz nie renderuje sie identycznie jak inny w tym samym zestawie', () => {
  // Bez tego dziecko dostaje luke, ktorej NIE DA SIE rozstrzygnac: `morze` i `może`
  // renderowaly sie oba jako "mo_e", wiec w polowie przypadkow tracilo serce mimo
  // poprawnego rozumowania, a wyjasnienie dotyczylo wyrazu, o ktory nie bylo pytane.
  for (const z of o.ZESTAWY) {
    const widziane = new Map();
    for (const w of z.wyrazy) {
      const tresc = w.wyraz.slice(0, w.luka) + '_' + w.wyraz.slice(w.luka + w.poprawny.length);
      if (widziane.has(tresc)) {
        assert.fail(
          `kolizja w ${z.id}: "${w.wyraz}" i "${widziane.get(tresc)}" oba renderuja sie jako "${tresc}"`
        );
      }
      widziane.set(tresc, w.wyraz);
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

test('zly wariant nie tworzy innego czestego polskiego slowa', () => {
  // Recenzja: wstawienie ZLEGO wariantu w luke daje prawdziwe polskie slowo tylko
  // dwa razy w calym pliku — `morze -> moze` (usuniete, zastapione przez `dworzec`)
  // i `noz -> nuz`. `nuz` zostaje swiadomie: zyje wylacznie w potocznym "a nuz",
  // a `noz` jest za dobrym nosnikiem wymiany o->o, zeby go wyrzucac.
  //
  // Ten test nie jest slownikiem — pilnuje konkretnej listy slow, ktore
  // dziewieciolatek zna i ktore skusilyby go do "poprawnej" odpowiedzi na wyraz,
  // o ktory nie bylo pytane.
  const ZAKAZANE = ['może', 'morze', 'wóz', 'lód', 'miód', 'ważny', 'waży', 'góra', 'hart', 'chart'];
  const DOZWOLONE_WYJATKI = ['nóż'];

  for (const z of o.ZESTAWY) {
    for (const w of z.wyrazy) {
      if (DOZWOLONE_WYJATKI.includes(w.wyraz)) continue;
      for (const zly of z.warianty) {
        if (zly === w.poprawny) continue;
        const forma = w.wyraz.slice(0, w.luka) + zly + w.wyraz.slice(w.luka + w.poprawny.length);
        assert.ok(!ZAKAZANE.includes(forma),
          `"${w.wyraz}" ze zlym wariantem "${zly}" daje prawdziwe slowo "${forma}"`);
      }
    }
  }
});

test('generuj dla nieznanego zestawu zwraca pustą tablicę', () => {
  assert.deepStrictEqual(o.generuj('nie-ma-takiego', 5), []);
});
