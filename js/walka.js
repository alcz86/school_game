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
    const poprawna = normalizuj(odpowiedzGracza) === normalizuj(oczekiwana);
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
