(function () {
  function mnoznikCombo(combo) {
    if (combo >= 5) return 3;
    if (combo >= 3) return 2;
    return 1;
  }

  function nowaWalka(pytania, opcje) {
    const zycieBossa = (opcje && opcje.zycieBossa) || 10;
    const pula = pytania.slice();
    const kolejka = pytania.slice(1);
    return {
      zycieBossa,
      maxZycieBossa: zycieBossa,
      serca: (opcje && opcje.serca) || 3,
      combo: 0,
      pula,
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
    const poprawna = pasuje(odpowiedzGracza, stan.aktualne);
    const nowy = Object.assign({}, stan, { kolejka: stan.kolejka.slice(), pula: stan.pula.slice() });

    if (poprawna) {
      nowy.combo = stan.combo + 1;
      const mnoznik = mnoznikCombo(nowy.combo);
      nowy.zycieBossa = Math.max(0, stan.zycieBossa - mnoznik);
      nowy.ostatnia = { poprawna: true, oczekiwana, mnoznik, pytanie: stan.aktualne };
    } else {
      nowy.combo = 0;
      nowy.serca = stan.serca - 1;
      // Pomylone pytanie wraca na POZYCJĘ 2 kolejki, nie na jej koniec.
      //
      // Na końcu wracałoby dopiero jako odpowiedź numer (pozycja + rozmiar puli - 1),
      // a boss przy 10 życia i mnożnikach 1/1/2/2/3/3 ginie już po 6-8 odpowiedziach.
      // Dziecko, które pomyli jedno pytanie i resztę odpowie dobrze, NIGDY by go nie
      // zobaczyło — czyli dokładnie w scenariuszu, w którym ma się najwięcej nauczyć,
      // powtórka nie działała. Pozycja 2 daje powrót po dwóch kolejnych pytaniach
      // zawsze, niezależnie od rozmiaru puli i życia bossa.
      //
      // Odstęp dwóch pytań jest celowy: powrót natychmiastowy byłby przepisaniem
      // odpowiedzi z ekranu, a nie przypomnieniem sobie jej.
      // Gdy kolejka jest krótsza niż 2, splice dokłada na koniec — to prawidłowe.
      nowy.kolejka.splice(2, 0, stan.aktualne);
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
      if (nowy.kolejka.length === 0) {
        nowy.kolejka = nowy.pula.slice();
      }
      nowy.aktualne = nowy.kolejka.shift() || null;
    }
    return nowy;
  }

  // Wszystkie znaki, które klawiatura potrafi wstawić w miejsce apostrofu.
  // iOS i Android DOMYŚLNIE zamieniają prosty apostrof U+0027 na typograficzny
  // U+2019 — na ekranie oba wyglądają identycznie, więc dziecko wpisujące
  // "aren’t" na tablecie widziało odrzuconą odpowiedź bez żadnej wskazówki,
  // co jest źle. Siedem zdań w materiale ma apostrof w poprawnej odpowiedzi.
  const APOSTROFY = /[’‘`´ʼ‛]/g;

  // Formy rozwinięte i skrócone to TO SAMO poprawne zdanie po angielsku —
  // dziecko może napisać którąkolwiek. Sprowadzamy obie strony porównania
  // do formy rozwiniętej (a nie skróconej), bo "cannot" i "can not" też
  // muszą trafić w to samo miejsce co "can't".
  //
  // Lista jest CELOWO zamknięta: tylko czasowniki posiłkowe i modalne, które
  // faktycznie występują w materiale klasy 3. Uogólnianie regexem po każdym
  // "n't" zaczęłoby sklejać formy, których gra nie uczy.
  const SKROTY = [
    [/\bcannot\b/g, 'can not'],
    [/\bcan't\b/g, 'can not'],
    [/\baren't\b/g, 'are not'],
    [/\bisn't\b/g, 'is not'],
    [/\bdon't\b/g, 'do not'],
    [/\bdoesn't\b/g, 'does not'],
    [/\bhaven't\b/g, 'have not'],
    [/\bhasn't\b/g, 'has not'],
  ];

  function normalizuj(v) {
    let s = String(v == null ? '' : v).toLowerCase().replace(APOSTROFY, "'");
    // Wielokrotne i nietypowe białe znaki w środku ("are  not") sprowadzamy
    // do jednej spacji — inaczej rozwinięcie skrótu nie trafiłoby w wzorzec.
    s = s.replace(/\s+/g, ' ').trim();
    for (const [wzorzec, forma] of SKROTY) s = s.replace(wzorzec, forma);
    return s;
  }

  // Porównanie liczbowe TYLKO wtedy, gdy obie strony to czyste ciągi cyfr.
  //
  // Na klawiaturze numerycznej dziecko potrafi zacząć od zera — „07" to
  // merytorycznie poprawne 7, a gra odbierała za to serce.
  //
  // Warunek jest celowo wąski: Number('') to 0, Number(' ') to 0 i Number('0x10')
  // to 16, więc każde luźniejsze rzutowanie zaliczyłoby pustą odpowiedź przy
  // oczekiwanym „0". Regex /^\d+$/ nie przepuszcza pustego ciągu, spacji, minusa
  // ani kropki, a odpowiedzi tekstowe (słówka, warianty ortograficzne) w ogóle
  // do tej gałęzi nie wchodzą.
  function rowne(a, b) {
    const x = normalizuj(a);
    const y = normalizuj(b);
    if (/^\d+$/.test(x) && /^\d+$/.test(y)) return Number(x) === Number(y);
    return x === y;
  }

  // Część zdań w materiale ma DWIE poprawne odpowiedzi w trybie wpisywania.
  // "My sister and I ____ scared." przyjmuje i "aren't" (wersja z podręcznika),
  // i "are" — bez obrazka nic w zdaniu nie rozstrzyga, o którą formę chodzi.
  // Cztery recenzje tego nie złapały, bo sprawdzały tylko, czy któryś
  // z DYSTRAKTORÓW nie jest drugą poprawną odpowiedzią; w trybie wpisywania
  // dystraktorów nie ma i nic nie zawęża pola.
  //
  // Dodatkowe formy siedzą w `takze_poprawne` przy zdaniu i są używane
  // WYŁĄCZNIE do oceniania — na liście czterech przycisków się nie pojawiają.
  // Pole jest opcjonalne i domyślnie puste: akceptowanie zbyt szerokie
  // chwaliłoby błąd, więc dopisujemy je tylko tam, gdzie zdanie naprawdę
  // nie rozstrzyga (np. "It ____ expensive, it's cheap." zostaje bez niego).
  function pasuje(odpowiedzGracza, pytanie) {
    if (!pytanie) return false;
    if (rowne(odpowiedzGracza, pytanie.odpowiedz)) return true;
    const alternatywy = pytanie.takze_poprawne;
    if (!Array.isArray(alternatywy)) return false;
    return alternatywy.some((a) => rowne(odpowiedzGracza, a));
  }

  const api = { mnoznikCombo, nowaWalka, odpowiedz, rowne, normalizuj, pasuje };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.walka = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
