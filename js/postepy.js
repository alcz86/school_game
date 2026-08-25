(function () {
  const KLUCZ = 'gra-szkolna-postepy';

  function pustyStan() {
    return { odpowiedzi: {}, bledy: {}, walki: [], dni: [] };
  }

  function utworz(magazyn) {
    const mag = magazyn || (typeof window !== 'undefined' ? window.localStorage : null);

    function jestObiektem(v) {
      return typeof v === 'object' && v !== null && !Array.isArray(v);
    }

    function wczytaj() {
      if (!mag) return pustyStan();
      try {
        const surowe = mag.getItem(KLUCZ);
        if (!surowe) return pustyStan();
        const s = JSON.parse(surowe);
        const domyslny = pustyStan();
        if (!jestObiektem(s)) return domyslny;
        return {
          odpowiedzi: jestObiektem(s.odpowiedzi) ? s.odpowiedzi : domyslny.odpowiedzi,
          bledy: jestObiektem(s.bledy) ? s.bledy : domyslny.bledy,
          walki: Array.isArray(s.walki) ? s.walki : domyslny.walki,
          dni: Array.isArray(s.dni) ? s.dni : domyslny.dni,
        };
      } catch (e) {
        return pustyStan();
      }
    }

    function zapisz(stan) {
      if (!mag) return;
      try { mag.setItem(KLUCZ, JSON.stringify(stan)); } catch (e) { /* pełny magazyn — pomijamy */ }
    }

    // Uwaga: '|' jest znakiem zastrzeżonym jako separator klucza tryb|zestaw|id.
    // Identyfikatory pytań (tryb, zestaw, id) NIE MOGĄ zawierać znaku '|' —
    // statystyki() i wagi() dzielą klucz przez split('|') bez ograniczenia liczby części.
    function klucz(tryb, zestaw, id) { return tryb + '|' + zestaw + '|' + id; }

    // `pierwszePodejscie` (domyślnie true) rozdziela DWA różne pytania:
    //   - "ile procent dziecko umie"        -> tylko pierwsze podejście w rundzie
    //   - "co dziecko myli" (wagi powtórek) -> KAŻDA pomyłka, także w powtórce
    //
    // Pomylone pytanie wraca po dwóch krokach (walka.js), a dziecko widziało
    // wtedy odpowiedź na ekranie 1,2 s wcześniej — więc trafia niemal zawsze.
    // Wliczanie tej darmowej powtórki do skuteczności zawyżało procent na ekranie
    // rodzica o ok. +11..+15 pp przy realnej wiedzy 30% (im słabiej dziecko umie,
    // tym większe zawyżenie — czyli błąd był największy tam, gdzie ekran ma
    // znaczenie). Dlatego licznik `odpowiedzi` rusza się tylko przy pierwszym
    // podejściu, a `bledy` (karmiące wagi) — zawsze.
    function zapiszOdpowiedz(tryb, zestaw, idPytania, poprawna, pierwszePodejscie) {
      const stan = wczytaj();
      const k = klucz(tryb, zestaw, idPytania);
      const pierwsze = pierwszePodejscie === undefined ? true : !!pierwszePodejscie;
      if (pierwsze) {
        const wpis = stan.odpowiedzi[k] || { poprawne: 0, wszystkie: 0 };
        wpis.wszystkie += 1;
        if (poprawna) wpis.poprawne += 1;
        stan.odpowiedzi[k] = wpis;
      }
      if (!poprawna) stan.bledy[k] = (stan.bledy[k] || 0) + 1;
      oznaczDzien(stan);
      zapisz(stan);
    }

    function zapiszWalke(tryb, zestaw, wynik) {
      const stan = wczytaj();
      stan.walki.push({ tryb, zestaw, wynik, data: dzisiaj() });
      oznaczDzien(stan);
      zapisz(stan);
    }

    function dzisiaj() {
      const d = new Date();
      const rok = d.getFullYear();
      const miesiac = String(d.getMonth() + 1).padStart(2, '0');
      const dzien = String(d.getDate()).padStart(2, '0');
      return rok + '-' + miesiac + '-' + dzien;
    }

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

      // Do każdej mylonej pozycji dokładamy liczbę PRÓB (pierwszych podejść) i
      // liczbę błędów w tych próbach. Bez tego "4 pomyłki" nie da się odczytać:
      // 4 z 20 to co innego niż 4 z 4. `bledy` zostaje bez zmian — to ta sama
      // liczba co dotąd (wszystkie pomyłki, także w powtórkach) i to ona karmi wagi.
      const wszystkieMylone = Object.keys(stan.bledy).filter((k) => stan.bledy[k] > 0);
      const opisz = (k) => {
        const [tryb, zestaw, id] = k.split('|');
        const w = stan.odpowiedzi[k] || { poprawne: 0, wszystkie: 0 };
        return {
          tryb, zestaw, id,
          bledy: stan.bledy[k] || 0,
          proby: w.wszystkie,
          bledyPierwsze: w.wszystkie - w.poprawne,
        };
      };

      const najczestszeBledy = wszystkieMylone
        .map(opisz)
        .sort((a, b) => (b.bledyPierwsze - a.bledyPierwsze) || (b.bledy - a.bledy))
        .slice(0, 10);

      // "Zawsze mylone": pozycje, w których dziecko NIE trafiło ANI RAZU przy
      // co najmniej dwóch próbach. Lista sortowana po liczbie pomyłek gubi je
      // (2 błędy z 2 prób przegrywa z 4 z 20), a to dokładnie są rzeczy, których
      // syn nie umie.
      const zawszeMylone = Object.keys(stan.odpowiedzi)
        .filter((k) => stan.odpowiedzi[k].wszystkie >= 2 && stan.odpowiedzi[k].poprawne === 0)
        .map(opisz)
        .sort((a, b) => (b.proby - a.proby) || (b.bledy - a.bledy))
        .slice(0, 10);

      return {
        tryby,
        najczestszeBledy,
        mylonePozycje: wszystkieMylone.length,
        zawszeMylone,
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
