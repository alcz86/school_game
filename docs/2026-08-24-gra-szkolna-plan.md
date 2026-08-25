# Gra szkolna „Pojedynek z Potworem" — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować statyczną grę webową ćwiczącą tabliczkę mnożenia/dzielenia, ortografię polską i słownictwo angielskie w formie pojedynku z bossem, z ekranem postępów dla rodzica.

**Architecture:** Zwykłe skrypty (nie moduły ES) dopisujące się do globalnej przestrzeni `window.GRA`, plus końcówka `module.exports` dla testów w Node. Czysta logika (walka, postępy, generatory danych) jest oddzielona od DOM i testowana w Node bez przeglądarki; warstwa UI tylko renderuje stan i przekazuje zdarzenia.

**Tech Stack:** HTML5, CSS3, waniliowy JavaScript (ES2020). Testy: wbudowany `node:test` + `node:assert` — zero zależności, zero `npm install`. Trwałość: `localStorage`.

**Spec:** `docs/2026-08-24-gra-szkolna-design.md`

## Global Constraints

- **Zero zależności zewnętrznych.** Żadnego npm, CDN, frameworka, fontu z sieci. Gra działa offline.
- **Musi działać przez `file://`** — podwójne kliknięcie `index.html`. Dlatego **żadnych `import`/`export` w kodzie ładowanym przez przeglądarkę** i żadnego `fetch()` plików lokalnych.
- **Wzorzec pliku** — każdy plik `js/` i `dane/` kończy się:
  ```js
  if (typeof module !== 'undefined' && module.exports) module.exports = { /* ... */ };
  ```
  a na początku przypisuje się do `window.GRA.<nazwa>` gdy `window` istnieje.
- **Interfejs w języku polskim.** Cały tekst widoczny dla dziecka po polsku (poza samymi słówkami angielskimi). Nazwy funkcji i zmiennych też po polsku — spójnie z domeną.
- **Bez timera i bez presji czasu** w wersji pierwszej.
- **Żadne dane nie opuszczają urządzenia.** Brak requestów sieciowych, brak analityki.
- **Responsywność:** działa na szerokości od 320 px do desktopu. Przyciski odpowiedzi min. 44×44 px.
- **Testy uruchamiane przez** `node --test` (bez argumentu — sam znajduje `tests/*.test.js`; forma `node --test tests/` NIE działa na Node 22, traktuje katalog jak moduł)` z katalogu projektu.
- Repo git już zainicjowane w `/Users/aczepierga/Desktop/gra-szkolna`.

---

### Task 1: Szkielet projektu i ekran menu

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/app.js`
- Create: `tests/app.test.js`
- Create: `.gitignore`

**Interfaces:**
- Consumes: nic (pierwsze zadanie)
- Produces: `GRA.app.pokazEkran(idEkranu)` — ukrywa wszystkie elementy `.ekran` i pokazuje `#ekran-<idEkranu>`; zwraca `true` gdy ekran istnieje, `false` gdy nie. `GRA.app.EKRANY` — tablica `['menu','wybor-poziomu','walka','wynik','rodzic']`.

- [ ] **Step 1: Napisz test, który nie przechodzi**

Utwórz `tests/app.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const app = require('../js/app.js');

test('EKRANY zawiera wszystkie ekrany gry', () => {
  assert.deepStrictEqual(app.EKRANY, ['menu', 'wybor-poziomu', 'walka', 'wynik', 'rodzic']);
});

test('pokazEkran zwraca false dla nieznanego ekranu', () => {
  assert.strictEqual(app.pokazEkran('nie-ma-takiego'), false);
});

test('pokazEkran zwraca true dla znanego ekranu', () => {
  assert.strictEqual(app.pokazEkran('menu'), true);
});
```

- [ ] **Step 2: Uruchom test i potwierdź, że nie przechodzi**

Run: `cd ~/Desktop/gra-szkolna && node --test tests/app.test.js`
Expected: FAIL — `Cannot find module '../js/app.js'`

- [ ] **Step 3: Napisz minimalną implementację**

Utwórz `js/app.js`:

```js
(function () {
  const EKRANY = ['menu', 'wybor-poziomu', 'walka', 'wynik', 'rodzic'];

  function pokazEkran(idEkranu) {
    if (!EKRANY.includes(idEkranu)) return false;
    if (typeof document === 'undefined') return true;
    document.querySelectorAll('.ekran').forEach((el) => {
      el.hidden = el.id !== 'ekran-' + idEkranu;
    });
    return true;
  }

  const api = { EKRANY, pokazEkran };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.app = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
```

- [ ] **Step 4: Uruchom test i potwierdź, że przechodzi**

Run: `node --test tests/app.test.js`
Expected: PASS — 3 passing

- [ ] **Step 5: Zbuduj stronę i style**

Utwórz `index.html`:

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pojedynek z Potworem</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main id="gra">
    <section class="ekran" id="ekran-menu">
      <h1>Pojedynek z Potworem</h1>
      <p class="podtytul">Wybierz, z czym dziś walczysz</p>
      <div class="kafle">
        <button class="kafel" data-tryb="matematyka"><span class="ikona">✖️</span>Tabliczka mnożenia</button>
        <button class="kafel" data-tryb="ortografia"><span class="ikona">✍️</span>Ortografia</button>
        <button class="kafel" data-tryb="angielski"><span class="ikona">🇬🇧</span>Angielski</button>
      </div>
      <button id="btn-rodzic" class="link-rodzic" title="Postępy">📊</button>
    </section>
    <section class="ekran" id="ekran-wybor-poziomu" hidden></section>
    <section class="ekran" id="ekran-walka" hidden></section>
    <section class="ekran" id="ekran-wynik" hidden></section>
    <section class="ekran" id="ekran-rodzic" hidden></section>
  </main>
  <script src="js/app.js"></script>
</body>
</html>
```

Utwórz `css/style.css`:

```css
:root {
  --tlo: #1b1033;
  --karta: #2c1b52;
  --akcent: #ffd23f;
  --tekst: #f6f2ff;
  --dobrze: #43c59e;
  --zle: #ef476f;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background: var(--tlo);
  color: var(--tekst);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  display: flex;
  justify-content: center;
}
#gra { width: 100%; max-width: 640px; padding: 1.5rem 1rem 3rem; }
h1 { font-size: clamp(1.75rem, 7vw, 2.5rem); text-align: center; margin: .5rem 0; }
.podtytul { text-align: center; opacity: .75; margin-top: 0; }
.kafle { display: grid; gap: 1rem; margin-top: 2rem; }
.kafel {
  display: flex; align-items: center; gap: .9rem;
  min-height: 84px; padding: 1rem 1.25rem;
  font-size: 1.25rem; font-weight: 600;
  color: var(--tekst); background: var(--karta);
  border: 2px solid transparent; border-radius: 18px; cursor: pointer;
}
.kafel:hover, .kafel:focus-visible { border-color: var(--akcent); outline: none; }
.ikona { font-size: 2rem; }
.link-rodzic {
  position: fixed; right: .75rem; bottom: .75rem;
  width: 44px; height: 44px; font-size: 1.1rem;
  background: transparent; color: var(--tekst);
  border: 1px solid rgba(255,255,255,.25); border-radius: 50%;
  opacity: .4; cursor: pointer;
}
.link-rodzic:hover { opacity: 1; }
@media (min-width: 480px) { .kafle { grid-template-columns: 1fr; } }
```

Utwórz `.gitignore`:

```
.DS_Store
node_modules/
```

- [ ] **Step 6: Sprawdź w przeglądarce**

Otwórz `index.html` podwójnym kliknięciem. Oczekiwane: menu z trzema kaflami i ikoną 📊 w prawym dolnym rogu, **zero błędów w konsoli**, czytelne przy zwężeniu okna do 320 px.

- [ ] **Step 7: Commit**

```bash
cd ~/Desktop/gra-szkolna
git add index.html css/style.css js/app.js tests/app.test.js .gitignore
git commit -m "feat: szkielet gry i ekran menu"
```

---

### Task 2: Mechanika pojedynku (czysta logika)

**Files:**
- Create: `js/walka.js`
- Create: `tests/walka.test.js`

**Interfaces:**
- Consumes: nic
- Produces: `GRA.walka.nowaWalka(pytania, opcje)` → obiekt stanu `{ zycieBossa, maxZycieBossa, serca, combo, kolejka, aktualne, skonczona, wynik }`, gdzie `wynik` to `null` | `'wygrana'` | `'przegrana'`. `GRA.walka.odpowiedz(stan, odpowiedzGracza)` → nowy obiekt stanu (nie mutuje wejścia) z dodatkowym polem `ostatnia: { poprawna: bool, oczekiwana, mnoznik }`. `GRA.walka.mnoznikCombo(combo)` → `1 | 2 | 3`.
  Pytanie ma kształt: `{ id, tresc, odpowiedz, wyjasnienie }`.

- [ ] **Step 1: Napisz testy, które nie przechodzą**

Utwórz `tests/walka.test.js`:

```js
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
```

- [ ] **Step 2: Uruchom testy i potwierdź, że nie przechodzą**

Run: `node --test tests/walka.test.js`
Expected: FAIL — `Cannot find module '../js/walka.js'`

- [ ] **Step 3: Napisz implementację**

Utwórz `js/walka.js`:

```js
(function () {
  function mnoznikCombo(combo) {
    if (combo >= 5) return 3;
    if (combo >= 3) return 2;
    return 1;
  }

  function nowaWalka(pytania, opcje) {
    const zycieBossa = (opcje && opcje.zycieBossa) || 10;
    const kolejka = pytania.slice(1);
    return {
      zycieBossa,
      maxZycieBossa: zycieBossa,
      serca: (opcje && opcje.serca) || 3,
      combo: 0,
      kolejka,
      aktualne: pytania[0] || null,
      skonczona: false,
      wynik: null,
      ostatnia: null,
    };
  }

  function odpowiedz(stan, odpowiedzGracza) {
    if (stan.skonczona || !stan.aktualne) return stan;

    const oczekiwana = stan.aktualne.odpowiedz;
    const poprawna = normalizuj(odpowiedzGracza) === normalizuj(oczekiwana);
    const nowy = Object.assign({}, stan, { kolejka: stan.kolejka.slice() });

    if (poprawna) {
      nowy.combo = stan.combo + 1;
      const mnoznik = mnoznikCombo(nowy.combo);
      nowy.zycieBossa = Math.max(0, stan.zycieBossa - mnoznik);
      nowy.ostatnia = { poprawna: true, oczekiwana, mnoznik, pytanie: stan.aktualne };
    } else {
      nowy.combo = 0;
      nowy.serca = stan.serca - 1;
      nowy.kolejka.push(stan.aktualne);
      nowy.ostatnia = { poprawna: false, oczekiwana, mnoznik: 0, pytanie: stan.aktualne };
    }

    if (nowy.zycieBossa <= 0) {
      nowy.skonczona = true;
      nowy.wynik = 'wygrana';
      nowy.aktualne = null;
    } else if (nowy.serca <= 0) {
      nowy.skonczona = true;
      nowy.wynik = 'przegrana';
      nowy.aktualne = null;
    } else {
      nowy.aktualne = nowy.kolejka.shift() || null;
      if (!nowy.aktualne) {
        nowy.skonczona = true;
        nowy.wynik = 'wygrana';
      }
    }
    return nowy;
  }

  function normalizuj(v) {
    return String(v == null ? '' : v).trim().toLowerCase();
  }

  const api = { mnoznikCombo, nowaWalka, odpowiedz };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.walka = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
```

- [ ] **Step 4: Uruchom testy i potwierdź, że przechodzą**

Run: `node --test tests/walka.test.js`
Expected: PASS — 9 passing

- [ ] **Step 5: Commit**

```bash
git add js/walka.js tests/walka.test.js
git commit -m "feat: mechanika pojedynku - serca, combo, kolejka powtorek"
```

---

### Task 3: Generator działań matematycznych

**Files:**
- Create: `dane/matematyka.js`
- Create: `tests/matematyka.test.js`
- Modify: `index.html` (dodaj `<script src="dane/matematyka.js"></script>` przed `js/app.js`)

**Interfaces:**
- Consumes: nic
- Produces: `GRA.matematyka.POZIOMY` — tablica `{ id, nazwa, opis }` w kolejności odblokowywania. `GRA.matematyka.generuj(idPoziomu, ile, wagi)` → tablica pytań `{ id, tresc, odpowiedz, wyjasnienie }`, gdzie `id` ma postać `'7x8'` lub `'56:8'`. `wagi` to opcjonalny obiekt `{ [id]: liczbaBledow }` — pozycje z wyższą wagą pojawiają się częściej.

- [ ] **Step 1: Napisz testy, które nie przechodzą**

Utwórz `tests/matematyka.test.js`:

```js
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
```

- [ ] **Step 2: Uruchom testy i potwierdź, że nie przechodzą**

Run: `node --test tests/matematyka.test.js`
Expected: FAIL — `Cannot find module '../dane/matematyka.js'`

- [ ] **Step 3: Napisz implementację**

Utwórz `dane/matematyka.js`:

```js
(function () {
  const POZIOMY = [
    { id: 'latwe',     nazwa: 'Rozgrzewka',   opis: 'mnożenie przez 2, 5 i 10' },
    { id: 'srednie',   nazwa: 'Rozpęd',       opis: 'mnożenie przez 3 i 4' },
    { id: 'trudne',    nazwa: 'Trudne',       opis: 'mnożenie przez 6, 7, 8 i 9' },
    { id: 'dzielenie', nazwa: 'Dzielenie',    opis: 'dzielenie w zakresie 100' },
    { id: 'mieszane',  nazwa: 'Wszystko',     opis: 'mnożenie i dzielenie na przemian' },
  ];

  const MNOZNIKI = {
    latwe: [2, 5, 10],
    srednie: [3, 4],
    trudne: [6, 7, 8, 9],
  };

  function pytanieMnozenie(a, b) {
    return {
      id: a + 'x' + b,
      tresc: a + ' × ' + b,
      odpowiedz: String(a * b),
      wyjasnienie: a + ' × ' + b + ' = ' + a * b,
    };
  }

  function pytanieDzielenie(a, b) {
    const iloczyn = a * b;
    return {
      id: iloczyn + ':' + b,
      tresc: iloczyn + ' : ' + b,
      odpowiedz: String(a),
      wyjasnienie: iloczyn + ' : ' + b + ' = ' + a + ', bo ' + a + ' × ' + b + ' = ' + iloczyn,
    };
  }

  function losowy(tab) {
    return tab[Math.floor(Math.random() * tab.length)];
  }

  function jednoPytanie(idPoziomu) {
    if (idPoziomu === 'dzielenie') {
      const b = losowy([2, 3, 4, 5, 6, 7, 8, 9]);
      const a = losowy([2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n * b <= 100));
      return pytanieDzielenie(a, b);
    }
    if (idPoziomu === 'mieszane') {
      return Math.random() < 0.5
        ? jednoPytanie('trudne')
        : jednoPytanie('dzielenie');
    }
    const mnozniki = MNOZNIKI[idPoziomu] || MNOZNIKI.trudne;
    const a = losowy(mnozniki);
    const b = losowy([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    return pytanieMnozenie(a, b);
  }

  function generuj(idPoziomu, ile, wagi) {
    const pytania = [];
    const trudne = wagi ? Object.keys(wagi).filter((k) => wagi[k] > 0) : [];
    for (let i = 0; i < ile; i++) {
      // co trzecie pytanie ciągniemy z listy wcześniej mylonych, jeśli jakaś jest
      if (trudne.length && i % 3 === 1) {
        const id = losowy(trudne);
        const odtworzone = zId(id);
        if (odtworzone) { pytania.push(odtworzone); continue; }
      }
      pytania.push(jednoPytanie(idPoziomu));
    }
    return pytania;
  }

  function zId(id) {
    let m2 = /^(\d+)x(\d+)$/.exec(id);
    if (m2) return pytanieMnozenie(Number(m2[1]), Number(m2[2]));
    m2 = /^(\d+):(\d+)$/.exec(id);
    if (m2) {
      const iloczyn = Number(m2[1]), b = Number(m2[2]);
      if (b !== 0 && iloczyn % b === 0) return pytanieDzielenie(iloczyn / b, b);
    }
    return null;
  }

  const api = { POZIOMY, generuj, zId };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.matematyka = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
```

- [ ] **Step 4: Uruchom testy i potwierdź, że przechodzą**

Run: `node --test tests/matematyka.test.js`
Expected: PASS — 6 passing

- [ ] **Step 5: Podłącz plik w `index.html`**

W `index.html`, tuż przed `<script src="js/app.js"></script>`, dodaj:

```html
  <script src="dane/matematyka.js"></script>
  <script src="js/walka.js"></script>
```

- [ ] **Step 6: Commit**

```bash
git add dane/matematyka.js tests/matematyka.test.js index.html
git commit -m "feat: generator dzialan z wazeniem mylonych pozycji"
```

---

### Task 4: Zbiór ortograficzny

**Files:**
- Create: `dane/ortografia.js`
- Create: `tests/ortografia.test.js`
- Modify: `index.html` (dodaj `<script src="dane/ortografia.js"></script>`)

**Interfaces:**
- Consumes: nic
- Produces: `GRA.ortografia.ZESTAWY` — tablica `{ id, nazwa, warianty: [a, b], wyrazy: [...] }`. Wyraz: `{ wyraz, luka, poprawny, zasada }`, gdzie `luka` to indeks znaku do ukrycia. `GRA.ortografia.generuj(idZestawu, ile, wagi)` → pytania `{ id, tresc, odpowiedz, wyjasnienie, warianty }`; `tresc` ma podkreślnik w miejscu luki (np. `kr_l`).

- [ ] **Step 1: Napisz testy, które nie przechodzą**

Utwórz `tests/ortografia.test.js`:

```js
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
```

- [ ] **Step 2: Uruchom testy i potwierdź, że nie przechodzą**

Run: `node --test tests/ortografia.test.js`
Expected: FAIL — `Cannot find module '../dane/ortografia.js'`

- [ ] **Step 3: Napisz implementację**

Utwórz `dane/ortografia.js`. Poniżej pełna struktura z kompletem wyrazów dla `o-u`; **zestawy `rz-z` i `ch-h` uzupełnij tym samym wzorcem do min. 15 wyrazów każdy** — pola dokładnie te same, zasada zawsze konkretna (wymiana, wyjątek, lub końcówka), nigdy „bo tak się pisze".

```js
(function () {
  const ZESTAWY = [
    {
      id: 'o-u',
      nazwa: 'ó czy u',
      warianty: ['ó', 'u'],
      wyrazy: [
        { wyraz: 'król',     luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na o: królowa' },
        { wyraz: 'wóz',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: wozy' },
        { wyraz: 'stół',     luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na o: stoły' },
        { wyraz: 'nóż',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na e: noże' },
        { wyraz: 'lód',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: lodowy' },
        { wyraz: 'mróz',     luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na o: mrozy' },
        { wyraz: 'pióro',    luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na e: pierze' },
        { wyraz: 'góra',     luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: górski, ale porównaj: gorzeć' },
        { wyraz: 'ogórek',   luka: 2, poprawny: 'ó', zasada: 'wyjątek — ó trzeba zapamiętać' },
        { wyraz: 'wróbel',   luka: 2, poprawny: 'ó', zasada: 'wyjątek — ó trzeba zapamiętać' },
        { wyraz: 'skrót',    luka: 3, poprawny: 'ó', zasada: 'ó wymienia się na o: skrócony, skrót od skrócić' },
        { wyraz: 'kubek',    luka: 1, poprawny: 'u', zasada: 'u w wyrazie niewymiennym — zapamiętaj' },
        { wyraz: 'butelka',  luka: 1, poprawny: 'u', zasada: 'u w wyrazie niewymiennym — zapamiętaj' },
        { wyraz: 'ulica',    luka: 0, poprawny: 'u', zasada: 'u na początku wyrazu piszemy zawsze przez u' },
        { wyraz: 'uczeń',    luka: 0, poprawny: 'u', zasada: 'u na początku wyrazu piszemy zawsze przez u' },
        { wyraz: 'rysunek',  luka: 5, poprawny: 'u', zasada: 'końcówka -unek zawsze przez u' },
        { wyraz: 'ratunek',  luka: 5, poprawny: 'u', zasada: 'końcówka -unek zawsze przez u' },
        { wyraz: 'córka',    luka: 1, poprawny: 'ó', zasada: 'wyjątek — ó trzeba zapamiętać' },
      ],
    },
    // DO NAPISANIA W TYM KROKU: zestawy 'rz-z' (warianty ['rz','ż']) i 'ch-h'
    // (warianty ['ch','h']), każdy min. 15 wyrazów, ten sam kształt pól.
    // Zasady oprzyj na: wymiana (rzeka/rzeczny, morze/morski), po spółgłoskach
    // p/b/t/d/k/g/ch (przyjaciel, brzeg), wyjątki (pszenica, kształt),
    // h w wyrazach obcych (herbata, hałas), ch na końcu wyrazu (dach, groch).
  ];

  function losowy(tab) { return tab[Math.floor(Math.random() * tab.length)]; }

  function naPytanie(zestaw, w) {
    return {
      id: zestaw.id + ':' + w.wyraz,
      tresc: w.wyraz.slice(0, w.luka) + '_' + w.wyraz.slice(w.luka + w.poprawny.length),
      odpowiedz: w.poprawny,
      wyjasnienie: w.wyraz + ' — ' + w.zasada,
      warianty: zestaw.warianty,
    };
  }

  function generuj(idZestawu, ile, wagi) {
    const zestaw = ZESTAWY.find((z) => z.id === idZestawu);
    if (!zestaw) return [];
    const pula = zestaw.wyrazy.slice();
    // wyrazy wcześniej mylone na początek puli
    if (wagi) pula.sort((a, b) => (wagi[zestaw.id + ':' + b.wyraz] || 0) - (wagi[zestaw.id + ':' + a.wyraz] || 0));
    const wybrane = [];
    const reszta = wagi ? pula.slice(0, Math.min(ile, pula.length)) : pula;
    const mieszane = reszta.slice();
    for (let i = mieszane.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mieszane[i], mieszane[j]] = [mieszane[j], mieszane[i]];
    }
    for (let i = 0; i < ile; i++) {
      wybrane.push(naPytanie(zestaw, mieszane[i % mieszane.length] || losowy(pula)));
    }
    return wybrane;
  }

  const api = { ZESTAWY, generuj };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.ortografia = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
```

- [ ] **Step 4: Uruchom testy i potwierdź, że przechodzą**

Run: `node --test tests/ortografia.test.js`
Expected: PASS — 6 passing. Test „każdy zestaw ma co najmniej 15 wyrazów" wymusza dopisanie `rz-z` i `ch-h`; test „luka wskazuje na znak" wyłapie pomyłkę w indeksie luki (uwaga: `rz` i `ch` mają długość 2).

- [ ] **Step 5: Podłącz plik i commit**

W `index.html` dodaj `<script src="dane/ortografia.js"></script>` obok pozostałych plików danych.

```bash
git add dane/ortografia.js tests/ortografia.test.js index.html
git commit -m "feat: zestawy ortograficzne z zasada przy kazdym wyrazie"
```

---

### Task 5: Słówka angielskie — struktura i przepisanie z podręcznika

**Files:**
- Create: `dane/slowka.js`
- Create: `tests/slowka.test.js`
- Modify: `index.html` (dodaj `<script src="dane/slowka.js"></script>`)

**Interfaces:**
- Consumes: nic
- Produces: `GRA.slowka.ZESTAWY` — tablica `{ id, nazwa, klasa, slowa: [{ pl, en, unit }] }`. `GRA.slowka.rozdzialy(idZestawu)` → posortowana rosnąco tablica numerów rozdziałów obecnych w zestawie. `GRA.slowka.generuj(idZestawu, ile, tryb, wagi, zakres)` → pytania `{ id, tresc, odpowiedz, wyjasnienie, warianty }`; przy `tryb === 'wybor'` pole `warianty` to 4 propozycje po angielsku (jedna poprawna), przy `tryb === 'wpisywanie'` — `null`.
  `zakres` (opcjonalny) wybiera materiał: `{ tylko: N }` — wyłącznie rozdział N; `{ do: N }` — kumulacyjnie rozdziały 1..N; pominięty lub `null` — cały zestaw. Warianty w trybie `wybor` losowane są **tylko z wybranego zakresu** — inaczej dziecko dostałoby jako dystraktor słowo, którego jeszcze nie zna.

**Uwaga wykonawcza:** ten task ma **bramkę zatwierdzenia przez Aleksandrę** w kroku 4. Nie wolno jej pominąć.

- [ ] **Step 1: Napisz testy, które nie przechodzą**

Utwórz `tests/slowka.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const s = require('../dane/slowka.js');

test('istnieje zestaw powtórkowy z klasy 2', () => {
  const z = s.ZESTAWY.find((x) => x.id === 'klasa2-powtorka');
  assert.ok(z, 'brak zestawu klasa2-powtorka');
  assert.strictEqual(z.klasa, 2);
  assert.ok(z.slowa.length >= 40, `za mało słów: ${z.slowa.length}`);
});

test('każde słowo ma niepuste pl i en', () => {
  for (const z of s.ZESTAWY) {
    for (const w of z.slowa) {
      assert.ok(w.pl && w.pl.trim(), `puste pl przy "${w.en}" w ${z.id}`);
      assert.ok(w.en && w.en.trim(), `puste en przy "${w.pl}" w ${z.id}`);
    }
  }
});

test('w obrębie zestawu nie ma duplikatów po stronie angielskiej', () => {
  for (const z of s.ZESTAWY) {
    const en = z.slowa.map((w) => w.en.toLowerCase());
    assert.strictEqual(new Set(en).size, en.length, `duplikaty en w ${z.id}`);
  }
});

test('tryb wybor daje 4 różne warianty zawierające poprawną odpowiedź', () => {
  for (const p of s.generuj('klasa2-powtorka', 20, 'wybor')) {
    assert.strictEqual(p.warianty.length, 4);
    assert.strictEqual(new Set(p.warianty).size, 4, 'warianty się powtarzają');
    assert.ok(p.warianty.includes(p.odpowiedz), 'brak poprawnej wśród wariantów');
  }
});

test('tryb wpisywanie nie podaje wariantów', () => {
  for (const p of s.generuj('klasa2-powtorka', 5, 'wpisywanie')) {
    assert.strictEqual(p.warianty, null);
  }
});

test('każde słowo ma numer rozdziału', () => {
  for (const z of s.ZESTAWY) {
    for (const w of z.slowa) {
      assert.ok(Number.isInteger(w.unit) && w.unit >= 1, `zły unit przy "${w.en}" w ${z.id}`);
    }
  }
});

test('rozdzialy zwraca posortowaną listę bez duplikatów', () => {
  const r = s.rozdzialy('klasa2-powtorka');
  assert.ok(r.length >= 2, `oczekiwano wielu rozdziałów, było ${r.length}`);
  assert.deepStrictEqual(r, Array.from(new Set(r)).sort((a, b) => a - b));
});

test('zakres tylko:N daje wyłącznie slowa z rozdzialu N', () => {
  const zestaw = s.ZESTAWY.find((z) => z.id === 'klasa2-powtorka');
  const n = s.rozdzialy('klasa2-powtorka')[1];
  const dozwolone = new Set(zestaw.slowa.filter((w) => w.unit === n).map((w) => w.en));
  for (const p of s.generuj('klasa2-powtorka', 20, 'wybor', null, { tylko: n })) {
    assert.ok(dozwolone.has(p.odpowiedz), `"${p.odpowiedz}" spoza rozdzialu ${n}`);
    for (const w of p.warianty) {
      assert.ok(dozwolone.has(w), `wariant "${w}" spoza rozdzialu ${n}`);
    }
  }
});

test('zakres do:N daje slowa z rozdzialow 1..N i nic ponad', () => {
  const zestaw = s.ZESTAWY.find((z) => z.id === 'klasa2-powtorka');
  const rozdzialy = s.rozdzialy('klasa2-powtorka');
  const n = rozdzialy[rozdzialy.length - 2];
  const dozwolone = new Set(zestaw.slowa.filter((w) => w.unit <= n).map((w) => w.en));
  const uzyte = new Set();
  for (const p of s.generuj('klasa2-powtorka', 40, 'wybor', null, { do: n })) {
    assert.ok(dozwolone.has(p.odpowiedz), `"${p.odpowiedz}" spoza zakresu 1..${n}`);
    uzyte.add(p.odpowiedz);
  }
  assert.ok(uzyte.size > 1, 'zakres kumulacyjny powinien mieszać materiał z wielu rozdziałów');
});
```

- [ ] **Step 2: Uruchom testy i potwierdź, że nie przechodzą**

Run: `node --test tests/slowka.test.js`
Expected: FAIL — `Cannot find module '../dane/slowka.js'`

- [ ] **Step 3: Przepisz słówka ze zdjęć podręcznika**

Album Google Photos „ANGIELSKI": https://photos.app.goo.gl/9Uvg4mu6APaJtih36

Otwórz przez narzędzia przeglądarki (`mcp__Claude_Browser__preview_start` z tym URL). Album ma ~25 zdjęć; **interesuje Cię wyłącznie ostatnich 5 — Picture Dictionary** (widoczne w ostatnim rzędzie siatki: strona z liczbami 1–20 i strony z siatkami obrazków podpisanymi Unit 1–7).

Dla każdej z tych 5 stron: kliknij, żeby otworzyć w pełnym rozmiarze, użyj `computer` z akcją `zoom` na fragmenty, i przepisz angielskie podpisy pogrupowane po unitach.

Zasady:
- Przepisuj **tylko to, co faktycznie widzisz.** Jeśli podpis jest nieostry lub przycięty — zapisz go na listę „nieczytelne" i zgłoś Aleksandrze, **nie zgaduj**.
- Polskie tłumaczenia dopisujesz sam, ale **znaczenie rozstrzyga obrazek obok słowa**, nie słownik. `rubber` w podręczniku brytyjskim to *gumka do mazania*, nie *guma*. `coach` przy autokarze to *autokar*, nie *trener*.
- Zachowaj podział na unity jako osobne pod-zestawy albo pole grupujące — struktura ma odzwierciedlać książkę.

- [ ] **Step 4: BRAMKA — pokaż listę Aleksandrze do zatwierdzenia**

Przedstaw pełną listę w formacie `en — pl`, pogrupowaną po unitach, plus osobną listę pozycji nieczytelnych. Zapytaj o poprawki. **Nie przechodź dalej bez wyraźnej zgody.** To wymóg ze specyfikacji (§3.3), nie uprzejmość — błędne tłumaczenie utrwali się jako nauczone.

- [ ] **Step 5: Napisz `dane/slowka.js` z zatwierdzoną listą**

> **UWAGA — poniższy blok jest szkieletem SPRZED dodania wyboru zakresu rozdziałów.**
> Wiążące są sekcja **Interfaces** tego taska i testy z kroku 1, nie ten blok. Szkielet
> nie zna `rozdzialy()`, nie ma piątego argumentu `zakres`, eksportuje tylko
> `{ ZESTAWY, generuj }` i losuje dystraktory z całego zestawu zamiast z zakresu.
> Skopiowany dosłownie daje cztery czerwone testy. Użyj go jako punktu wyjścia dla
> struktury pliku, nie jako gotowej implementacji. Krok 6 mówi „5 passing" — testów
> słówek jest dziewięć.

```js
(function () {
  const ZESTAWY = [
    {
      id: 'klasa2-powtorka',
      nazwa: 'Klasa 2 — powtórka',
      klasa: 2,
      slowa: [
        // WYPEŁNIJ zatwierdzoną listą z kroku 4, w formacie:
        // { pl: 'gumka do mazania', en: 'rubber', unit: 1 },
      ],
    },
    // Kolejne zestawy dopisujemy w trakcie roku szkolnego:
    // { id: 'klasa3-unit1', nazwa: 'Klasa 3 — Unit 1', klasa: 3, slowa: [...] },
  ];

  function losowy(tab) { return tab[Math.floor(Math.random() * tab.length)]; }

  function generuj(idZestawu, ile, tryb, wagi) {
    const zestaw = ZESTAWY.find((z) => z.id === idZestawu);
    if (!zestaw) return [];
    const pula = zestaw.slowa.slice();
    for (let i = pula.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pula[i], pula[j]] = [pula[j], pula[i]];
    }
    if (wagi) pula.sort((a, b) => (wagi[idZestawu + ':' + b.en] || 0) - (wagi[idZestawu + ':' + a.en] || 0));

    const pytania = [];
    for (let i = 0; i < ile; i++) {
      const w = pula[i % pula.length];
      let warianty = null;
      if (tryb === 'wybor') {
        const inne = zestaw.slowa.filter((x) => x.en.toLowerCase() !== w.en.toLowerCase());
        const wybrane = new Set([w.en]);
        while (wybrane.size < 4 && wybrane.size < inne.length + 1) wybrane.add(losowy(inne).en);
        warianty = Array.from(wybrane);
        for (let k = warianty.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [warianty[k], warianty[j]] = [warianty[j], warianty[k]];
        }
      }
      pytania.push({
        id: idZestawu + ':' + w.en,
        tresc: w.pl,
        odpowiedz: w.en,
        wyjasnienie: w.pl + ' — ' + w.en,
        warianty,
      });
    }
    return pytania;
  }

  const api = { ZESTAWY, generuj };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.slowka = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
```

- [ ] **Step 6: Uruchom testy i potwierdź, że przechodzą**

Run: `node --test tests/slowka.test.js`
Expected: PASS — 5 passing. Test wymagający ≥40 słów nie przejdzie, dopóki lista nie jest wypełniona.

- [ ] **Step 7: Podłącz plik i commit**

W `index.html` dodaj `<script src="dane/slowka.js"></script>`.

```bash
git add dane/slowka.js tests/slowka.test.js index.html
git commit -m "feat: slowka angielskie - zestaw powtorkowy z klasy 2"
```

---

### Task 6: Zapis postępów i statystyki

**Files:**
- Create: `js/postepy.js`
- Create: `tests/postepy.test.js`
- Modify: `index.html` (dodaj `<script src="js/postepy.js"></script>`)

**Interfaces:**
- Consumes: nic (przyjmuje `magazyn` przez wstrzyknięcie, żeby dało się testować bez przeglądarki)
- Produces: `GRA.postepy.utworz(magazyn)` → obiekt z metodami:
  - `zapiszOdpowiedz(tryb, zestaw, idPytania, poprawna)` → void
  - `zapiszWalke(tryb, zestaw, wynik)` → void (`wynik`: `'wygrana' | 'przegrana'`)
  - `statystyki()` → `{ tryby: { [tryb]: { [zestaw]: { poprawne, wszystkie, procent } } }, najczestszeBledy: [{ tryb, zestaw, id, bledy }], dniZRzedu, ostatnioGrane }`
  - `wagi(tryb, zestaw)` → `{ [idPytania]: liczbaBledow }` — karmi generatory z Tasków 3–5
  - `reset()` → void

  `magazyn` to obiekt zgodny z `localStorage`: `getItem(k)`, `setItem(k,v)`, `removeItem(k)`. Domyślnie `window.localStorage`.

- [ ] **Step 1: Napisz testy, które nie przechodzą**

Utwórz `tests/postepy.test.js`:

```js
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

test('uszkodzone dane w magazynie nie wywracają gry', () => {
  const m = magazynPamieciowy();
  m.setItem('gra-szkolna-postepy', '{to nie jest json');
  const s = postepy.utworz(m).statystyki();
  assert.deepStrictEqual(s.najczestszeBledy, []);
});
```

- [ ] **Step 2: Uruchom testy i potwierdź, że nie przechodzą**

Run: `node --test tests/postepy.test.js`
Expected: FAIL — `Cannot find module '../js/postepy.js'`

- [ ] **Step 3: Napisz implementację**

Utwórz `js/postepy.js`:

```js
(function () {
  const KLUCZ = 'gra-szkolna-postepy';

  function pustyStan() {
    return { odpowiedzi: {}, bledy: {}, walki: [], dni: [] };
  }

  function utworz(magazyn) {
    const mag = magazyn || (typeof window !== 'undefined' ? window.localStorage : null);

    function wczytaj() {
      if (!mag) return pustyStan();
      try {
        const surowe = mag.getItem(KLUCZ);
        if (!surowe) return pustyStan();
        const s = JSON.parse(surowe);
        return Object.assign(pustyStan(), s);
      } catch (e) {
        return pustyStan();
      }
    }

    function zapisz(stan) {
      if (!mag) return;
      try { mag.setItem(KLUCZ, JSON.stringify(stan)); } catch (e) { /* pełny magazyn — pomijamy */ }
    }

    function klucz(tryb, zestaw, id) { return tryb + '|' + zestaw + '|' + id; }

    function zapiszOdpowiedz(tryb, zestaw, idPytania, poprawna) {
      const stan = wczytaj();
      const k = klucz(tryb, zestaw, idPytania);
      const wpis = stan.odpowiedzi[k] || { poprawne: 0, wszystkie: 0 };
      wpis.wszystkie += 1;
      if (poprawna) wpis.poprawne += 1;
      else stan.bledy[k] = (stan.bledy[k] || 0) + 1;
      stan.odpowiedzi[k] = wpis;
      oznaczDzien(stan);
      zapisz(stan);
    }

    function zapiszWalke(tryb, zestaw, wynik) {
      const stan = wczytaj();
      stan.walki.push({ tryb, zestaw, wynik, data: dzisiaj() });
      oznaczDzien(stan);
      zapisz(stan);
    }

    function dzisiaj() { return new Date().toISOString().slice(0, 10); }

    function oznaczDzien(stan) {
      const d = dzisiaj();
      if (stan.dni[stan.dni.length - 1] !== d) stan.dni.push(d);
    }

    function policzDniZRzedu(dni) {
      if (!dni.length) return 0;
      let seria = 1;
      for (let i = dni.length - 1; i > 0; i--) {
        const roznica = (Date.parse(dni[i]) - Date.parse(dni[i - 1])) / 86400000;
        if (roznica === 1) seria += 1; else break;
      }
      return seria;
    }

    function statystyki() {
      const stan = wczytaj();
      const tryby = {};
      for (const k of Object.keys(stan.odpowiedzi)) {
        const [tryb, zestaw] = k.split('|');
        tryby[tryb] = tryby[tryb] || {};
        const cel = tryby[tryb][zestaw] || { poprawne: 0, wszystkie: 0, procent: 0 };
        cel.poprawne += stan.odpowiedzi[k].poprawne;
        cel.wszystkie += stan.odpowiedzi[k].wszystkie;
        cel.procent = cel.wszystkie ? Math.round((cel.poprawne / cel.wszystkie) * 100) : 0;
        tryby[tryb][zestaw] = cel;
      }

      const najczestszeBledy = Object.keys(stan.bledy)
        .map((k) => {
          const [tryb, zestaw, id] = k.split('|');
          return { tryb, zestaw, id, bledy: stan.bledy[k] };
        })
        .sort((a, b) => b.bledy - a.bledy)
        .slice(0, 10);

      return {
        tryby,
        najczestszeBledy,
        dniZRzedu: policzDniZRzedu(stan.dni),
        ostatnioGrane: stan.dni[stan.dni.length - 1] || null,
      };
    }

    function wagi(tryb, zestaw) {
      const stan = wczytaj();
      const wynik = {};
      const prefiks = tryb + '|' + zestaw + '|';
      for (const k of Object.keys(stan.bledy)) {
        if (k.indexOf(prefiks) === 0) wynik[k.slice(prefiks.length)] = stan.bledy[k];
      }
      return wynik;
    }

    function reset() { if (mag) mag.removeItem(KLUCZ); }

    return { zapiszOdpowiedz, zapiszWalke, statystyki, wagi, reset };
  }

  const api = { utworz };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.postepy = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
```

- [ ] **Step 4: Uruchom testy i potwierdź, że przechodzą**

Run: `node --test tests/postepy.test.js`
Expected: PASS — 8 passing

- [ ] **Step 5: Podłącz plik i commit**

W `index.html` dodaj `<script src="js/postepy.js"></script>`.

```bash
git add js/postepy.js tests/postepy.test.js index.html
git commit -m "feat: zapis postepow, statystyki i wagi mylonych pozycji"
```

---

### Task 7: Ekran wyboru poziomu

**Files:**
- Modify: `js/app.js`
- Modify: `css/style.css`
- Modify: `tests/app.test.js`

**Interfaces:**
- Consumes: `GRA.matematyka.POZIOMY`, `GRA.ortografia.ZESTAWY`, `GRA.slowka.ZESTAWY`, `GRA.postepy`
- Produces: `GRA.app.poziomyDla(tryb)` → tablica `{ id, nazwa, opis }` dla danego trybu. `GRA.app.pytaniaDla(tryb, idPoziomu, ile)` → tablica pytań gotowa dla `GRA.walka.nowaWalka`, z wagami z postępów zastosowanymi automatycznie.

- [ ] **Step 1: Dopisz testy, które nie przechodzą**

Dopisz na końcu `tests/app.test.js`:

```js
const matematyka = require('../dane/matematyka.js');
const ortografia = require('../dane/ortografia.js');
const slowka = require('../dane/slowka.js');

test('poziomyDla zwraca poziomy właściwe dla trybu', () => {
  assert.strictEqual(app.poziomyDla('matematyka').length, matematyka.POZIOMY.length);
  assert.strictEqual(app.poziomyDla('ortografia').length, ortografia.ZESTAWY.length);
  assert.strictEqual(app.poziomyDla('angielski').length, slowka.ZESTAWY.length);
  assert.deepStrictEqual(app.poziomyDla('nie-ma'), []);
});

test('poziomyDla zawsze zwraca id, nazwę i opis', () => {
  for (const tryb of ['matematyka', 'ortografia', 'angielski']) {
    for (const p of app.poziomyDla(tryb)) {
      assert.ok(p.id, 'brak id');
      assert.ok(p.nazwa, `brak nazwy dla ${p.id}`);
      assert.strictEqual(typeof p.opis, 'string');
    }
  }
});

test('pytaniaDla zwraca komplet pytań w kształcie wymaganym przez walkę', () => {
  const pytania = app.pytaniaDla('matematyka', 'trudne', 12);
  assert.strictEqual(pytania.length, 12);
  for (const p of pytania) {
    assert.ok(p.id && p.tresc && p.odpowiedz !== undefined && p.wyjasnienie !== undefined);
  }
});
```

- [ ] **Step 2: Uruchom testy i potwierdź, że nie przechodzą**

Run: `node --test tests/app.test.js`
Expected: FAIL — `app.poziomyDla is not a function`

- [ ] **Step 3: Napisz implementację**

W `js/app.js` — na początku IIFE dodaj most do modułów (działa i w Node, i w przeglądarce):

```js
  function modul(nazwa, sciezka) {
    if (typeof window !== 'undefined' && window.GRA && window.GRA[nazwa]) return window.GRA[nazwa];
    if (typeof require !== 'undefined') return require(sciezka);
    return null;
  }
  const matematyka = modul('matematyka', '../dane/matematyka.js');
  const ortografia = modul('ortografia', '../dane/ortografia.js');
  const slowka     = modul('slowka',     '../dane/slowka.js');
  const postepyMod = modul('postepy',    './postepy.js');
  const postepy    = postepyMod.utworz();
```

i dwie funkcje przed `const api`:

```js
  function poziomyDla(tryb) {
    if (tryb === 'matematyka') return matematyka.POZIOMY.map((p) => ({ id: p.id, nazwa: p.nazwa, opis: p.opis }));
    if (tryb === 'ortografia') return ortografia.ZESTAWY.map((z) => ({ id: z.id, nazwa: z.nazwa, opis: z.warianty.join(' czy ') }));
    if (tryb === 'angielski')  return slowka.ZESTAWY.map((z) => ({ id: z.id, nazwa: z.nazwa, opis: z.slowa.length + ' słówek' }));
    return [];
  }

  function pytaniaDla(tryb, idPoziomu, ile) {
    const w = postepy.wagi(tryb, idPoziomu);
    if (tryb === 'matematyka') return matematyka.generuj(idPoziomu, ile, w);
    if (tryb === 'ortografia') return ortografia.generuj(idPoziomu, ile, w);
    if (tryb === 'angielski') {
      // Spec §3.3: zestawy powtórkowe (klasa 2) — wybór z 4; nowy materiał (klasa 3+) — wpisywanie
      const zestaw = slowka.ZESTAWY.find((z) => z.id === idPoziomu);
      const trybPytania = zestaw && zestaw.klasa >= 3 ? 'wpisywanie' : 'wybor';
      return slowka.generuj(idPoziomu, ile, trybPytania, w, zakres);
    }
    return [];
  }
```

**Zakres rozdziałów (spec §3.3).** `pytaniaDla` przyjmuje piąty argument `zakres`, przekazywany
w niezmienionej postaci do `slowka.generuj`; dla matematyki i ortografii jest ignorowany.
Pełna sygnatura: `pytaniaDla(tryb, idPoziomu, ile, zakres)`. Statystyki błędów mają być
liczone **per zestaw, nie per zakres** — to samo słówko pomylone w rundzie „tylko rozdział 3"
i w rundzie „do rozdziału 5" to ta sama pozycja do przećwiczenia, więc `wagi(tryb, idPoziomu)`
zostaje bez zmian.

**Guard na pustą pulę pytań (znalezisko z Taska 2).** `nowaWalka([])` daje stan zamrożony:
`aktualne` jest `null`, `skonczona` nigdy nie staje się `true` i nie ma wyjścia z ekranu.
Ponieważ `pytaniaDla` jest jedynym producentem pytań, guard należy tutaj: jeśli wynik jest
pustą tablicą (np. wybrany rozdział nie ma słówek), zwróć pustą tablicę, a wołający
(Task 8) MUSI to obsłużyć komunikatem „Ten rozdział nie ma jeszcze słówek" zamiast
uruchamiać walkę. Dopisz test:

```js
test('pytaniaDla dla nieistniejacego poziomu zwraca pusta tablice, nie wybucha', () => {
  assert.deepStrictEqual(app.pytaniaDla('angielski', 'nie-ma-takiego', 10), []);
  assert.deepStrictEqual(app.pytaniaDla('nie-ma-trybu', 'cokolwiek', 10), []);
});
```

Rozszerz eksport: `const api = { EKRANY, pokazEkran, poziomyDla, pytaniaDla, postepy };`

Dodaj renderowanie ekranu wyboru — po kliknięciu kafla w menu:

```js
  function renderujWyborPoziomu(tryb) {
    const sekcja = document.getElementById('ekran-wybor-poziomu');
    const poziomy = poziomyDla(tryb);
    sekcja.innerHTML =
      '<button class="wstecz" data-akcja="menu">← Wróć</button>' +
      '<h2>Wybierz poziom</h2>' +
      '<div class="kafle">' +
      poziomy.map((p) =>
        '<button class="kafel kafel-poziom" data-poziom="' + p.id + '">' +
        '<span><strong>' + p.nazwa + '</strong><br><small>' + p.opis + '</small></span></button>'
      ).join('') +
      '</div>';
    pokazEkran('wybor-poziomu');
  }
```

i podłącz obsługę kliknięć (delegacja zdarzeń na `#gra`, bez `onclick` w HTML).

- [ ] **Step 4: Uruchom testy i potwierdź, że przechodzą**

Run: `node --test` (bez argumentu — sam znajduje `tests/*.test.js`; forma `node --test tests/` NIE działa na Node 22, traktuje katalog jak moduł)`
Expected: PASS — wszystkie pliki testowe zielone

- [ ] **Step 5: Sprawdź w przeglądarce**

Otwórz `index.html`. Kliknij każdy z trzech kafli — pojawia się lista poziomów; „← Wróć" wraca do menu. Konsola bez błędów.

- [ ] **Step 6: Commit**

```bash
git add js/app.js css/style.css tests/app.test.js
git commit -m "feat: ekran wyboru poziomu dla trzech trybow"
```

---

### Task 8: Ekran walki i ekran wyniku

**Files:**
- Modify: `js/app.js`
- Modify: `css/style.css`
- Modify: `index.html` (jeśli trzeba dodać kontenery)

**Interfaces:**
- Consumes: `GRA.walka`, `GRA.app.pytaniaDla`, `GRA.app.postepy`
- Produces: `GRA.app.rozpocznijWalke(tryb, idPoziomu)` — buduje stan i renderuje ekran walki. Stan trzymany w zmiennej modułu, nie w DOM.

- [ ] **Step 0: Ekran wyboru rozdziału — tylko dla trybu angielskiego (spec §3.3)**

Po wybraniu zestawu w trybie `angielski` NIE startuj od razu walki. Pokaż pośredni ekran
wyboru zakresu, zbudowany z `GRA.slowka.rozdzialy(idZestawu)`. Dla każdego rozdziału N dwa
przyciski:

- **„Tylko rozdział N"** → `pytaniaDla('angielski', idZestawu, ile, { tylko: N })`
- **„Od początku do N"** → `pytaniaDla('angielski', idZestawu, ile, { do: N })`

Ten wybór jest obowiązkowy przy każdej rundzie angielskiego — nie ma ścieżki „graj bez
wybierania zakresu" i nie chowaj go za żadnym ustawieniem. Tryby `matematyka` i `ortografia`
pomijają ten ekran i idą prosto do walki.

Jeśli `pytaniaDla` zwróci pustą tablicę (rozdział bez słówek), pokaż komunikat
„Ten rozdział nie ma jeszcze słówek" i wróć do wyboru — NIE wywołuj `nowaWalka([])`,
bo daje stan zamrożony bez wyjścia.

Ekran korzysta z istniejącej sekcji `#ekran-wybor-poziomu` albo dostaje własną — jeśli
własną, dopisz jej id do `EKRANY` w `js/app.js` i zaktualizuj test w `tests/app.test.js`,
który sprawdza dokładną zawartość tej tablicy.

- [ ] **Step 1: Zbuduj ekran walki**

Renderowanie ma pokazywać, w tej kolejności od góry:
1. pasek życia bossa (szerokość = `zycieBossa / maxZycieBossa`) + prosta grafika potwora (emoji, zmienia się co poziom)
2. trzy serca (`♥♥♥`, wygaszone po utracie)
3. wskaźnik combo — widoczny dopiero od combo ≥ 3, z tekstem `×2` / `×3`
4. treść pytania, dużą czcionką
5. pole odpowiedzi zależne od trybu:
   - **matematyka** — ekranowa klawiatura numeryczna 0–9, „usuń", „OK" (przyciski min. 44×44 px; działa też fizyczna klawiatura)
   - **ortografia** — dwa duże przyciski z `warianty[0]` i `warianty[1]`
   - **angielski, tryb wybor** — cztery przyciski z `warianty`
   - **angielski, tryb wpisywanie** — `<input type="text">` + „OK"

Po każdej odpowiedzi: zablokuj wejście, pokaż informację zwrotną przez ~1,2 s (zielone „Dobrze!" albo czerwone `oczekiwana` + `wyjasnienie`), wywołaj `postepy.zapiszOdpowiedz(...)`, potem odblokuj i wyrenderuj kolejne pytanie. Gdy `stan.skonczona` — wywołaj `postepy.zapiszWalke(...)` i pokaż ekran wyniku.

Kluczowy szczegół: **wyjaśnienie pokazuj także przy poprawnej odpowiedzi w trybie ortografii** — dziecko ma zobaczyć zasadę również wtedy, gdy trafiło.

- [ ] **Step 2: Zbuduj ekran wyniku**

Wygrana: „Potwór pokonany!", liczba trafień, najdłuższe combo, zdobyta odznaka, przyciski „Jeszcze raz" i „Wróć do menu".
Przegrana: bez dramatu — „Prawie! Potworowi zostało X życia", lista pomylonych pozycji z tej rundy z ich wyjaśnieniami, te same dwa przyciski.

- [ ] **Step 3: Sprawdź ręcznie każdy tryb**

Otwórz `index.html` i przejdź pełną rundę w każdym z trzech trybów. Sprawdź kolejno:
- błąd odejmuje serce, pokazuje poprawną odpowiedź i **to samo pytanie wraca później w tej rundzie**
- 3 poprawne z rzędu włączają `×2`, 5 z rzędu `×3`, błąd zeruje wskaźnik
- 3 błędy kończą rundę przegraną, zbicie bossa — wygraną
- konsola bez błędów, układ czytelny przy 320 px

- [ ] **Step 4: Commit**

```bash
git add js/app.js css/style.css index.html
git commit -m "feat: ekran pojedynku i ekran wyniku"
```

---

### Task 9: Ekran postępów dla rodzica

**Files:**
- Modify: `js/app.js`
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `GRA.app.postepy.statystyki()`
- Produces: `GRA.app.renderujRodzica()` — wypełnia `#ekran-rodzic` i pokazuje go.

- [ ] **Step 1: Zbuduj ekran**

Wejście: przycisk `#btn-rodzic` z menu. Zawartość:

1. **Skuteczność wg trybu i poziomu** — tabela: tryb, poziom/zestaw, `poprawne/wszystkie`, procent. Procenty poniżej 60% wyróżnione kolorem `--zle`.
2. **Angielski osobno: powtórka vs nowy materiał** — zestawy `klasa === 2` zsumowane w jednym wierszu „Powtórka (klasa 2)", zestawy `klasa === 3` w drugim „Klasa 3". To wymóg ze specyfikacji §4 — pokazuje, czy stary materiał się trzyma, gdy dochodzi nowy.
3. **10 najczęściej mylonych** — z `najczestszeBledy`, każda pozycja opisana po ludzku: `7×8` (nie `7x8`), `rz/ż: żaba`, `słówko: bread`. Zamiana identyfikatora na czytelny opis idzie po `tryb`.
4. **Dni z rzędu** — `dniZRzedu` i data ostatniej gry.
5. **Wyczyść postępy** — z potwierdzeniem `confirm()`; wywołuje `postepy.reset()` i przerenderowuje.

Gdy statystyki są puste: „Jeszcze brak danych — zagraj pierwszą rundę." Bez pustych tabel i bez `NaN%`.

- [ ] **Step 2: Sprawdź ręcznie**

Zagraj po jednej rundzie w każdym trybie, celowo myląc kilka razy tę samą pozycję. Otwórz ekran rodzica. Oczekiwane: pomylona pozycja na szczycie listy błędów, procenty się zgadzają, po `F5` dane nadal są. Kliknij „Wyczyść postępy" — wraca komunikat o braku danych.

- [ ] **Step 3: Commit**

```bash
git add js/app.js css/style.css
git commit -m "feat: ekran postepow dla rodzica"
```

---

### Task 10: Weryfikacja kryteriów ukończenia

**Files:**
- Create: `README.md`
- Modify: dowolne, jeśli weryfikacja coś wykaże

- [ ] **Step 1: Uruchom komplet testów**

Run: `cd ~/Desktop/gra-szkolna && node --test` (bez argumentu — sam znajduje `tests/*.test.js`; forma `node --test tests/` NIE działa na Node 22, traktuje katalog jak moduł)`
Expected: wszystko zielone, zero pominiętych

- [ ] **Step 2: Przejdź listę kryteriów ze specyfikacji §6, jedno po drugim**

Dla każdego zapisz wynik. Kryterium, którego nie da się potwierdzić, zgłoś jako niespełnione — nie zaliczaj go „na oko".

1. `index.html` otwarty z pliku działa bez błędów w konsoli, na desktopie i przy 320 px
2. Każdy z trzech trybów da się przejść od wyboru poziomu do pokonania bossa
3. Błąd: odejmuje serce, pokazuje poprawną odpowiedź, pytanie wraca w tej samej rundzie
4. Combo ×2 od 3 poprawnych z rzędu, ×3 od 5, zerowanie po błędzie
5. Ekran rodzica pokazuje niezerowe statystyki i przeżywa odświeżenie strony
6. Tryb angielskiego ma wypełniony zestaw „Klasa 2 — powtórka" z zatwierdzonymi tłumaczeniami
7. Dopisanie nowego zestawu słówek wymaga edycji wyłącznie `dane/slowka.js` — **zweryfikuj to realnie**: dopisz tymczasowy zestaw `klasa3-unit1` z 5 słowami, sprawdź, że pojawia się na liście poziomów i da się nim zagrać, po czym cofnij zmianę

- [ ] **Step 3: Napisz README**

Utwórz `README.md`: jak uruchomić (podwójne kliknięcie), jak dopisać nowe słówka (przykładowy blok w `dane/slowka.js`), jak dopisać wyrazy ortograficzne, jak uruchomić testy, gdzie leżą postępy i jak je wyczyścić.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README - uruchamianie i dopisywanie materialu"
```

---

## Uwagi dla wykonawcy

- **Task 5 ma bramkę zatwierdzenia.** Lista tłumaczeń idzie do Aleksandry przed wpisaniem do kodu. Pozycje nieczytelne na zdjęciu zgłaszasz, nie zgadujesz.
- **Task 4 celowo zostawia dwa zestawy do dopisania.** Testy to wymuszą — nie da się ich obejść, nie łagodź testów.
- Jeśli w trakcie okaże się, że któryś task jest większy, niż zakładał plan, zatrzymaj się i powiedz, zamiast ciąć zakres po cichu.
