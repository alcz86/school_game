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
