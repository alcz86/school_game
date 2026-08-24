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
