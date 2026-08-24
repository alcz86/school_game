(function () {
  const POZIOMY = [
    { id: 'latwe',     nazwa: 'Rozgrzewka',   opis: 'mnożenie przez 2, 5 i 10' },
    { id: 'srednie',   nazwa: 'Rozpęd',       opis: 'mnożenie przez 3 i 4' },
    { id: 'trudne',    nazwa: 'Trudne',       opis: 'mnożenie przez 6, 7, 8 i 9' },
    { id: 'dzielenie', nazwa: 'Dzielenie',    opis: 'dzielenie w zakresie 100' },
    { id: 'mieszane',  nazwa: 'Wszystko',     opis: 'mnożenie i dzielenie wymieszane' },
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

  function nalezyDoPoziomu(pytanie, idPoziomu) {
    const [aStr, znak, bStr] = pytanie.tresc.split(' ');
    const a = Number(aStr);
    const b = Number(bStr);
    if (idPoziomu === 'dzielenie') {
      return znak === ':' && a <= 100 && b !== 0 && a % b === 0;
    }
    if (idPoziomu === 'mieszane') {
      if (znak === ':') return a <= 100 && b !== 0 && a % b === 0;
      return znak === '×' && MNOZNIKI.trudne.includes(a);
    }
    const mnozniki = MNOZNIKI[idPoziomu] || MNOZNIKI.trudne;
    return znak === '×' && mnozniki.includes(a);
  }

  function wylosujWazone(pozycje) {
    const suma = pozycje.reduce((s, p) => s + p.waga, 0);
    let los = Math.random() * suma;
    for (const p of pozycje) {
      los -= p.waga;
      if (los < 0) return p.pytanie;
    }
    return pozycje[pozycje.length - 1].pytanie;
  }

  function generuj(idPoziomu, ile, wagi) {
    const pytania = [];
    const pulaMylonych = [];
    if (wagi) {
      for (const id of Object.keys(wagi)) {
        const waga = wagi[id];
        if (waga <= 0) continue;
        const pytanie = zId(id);
        if (pytanie && nalezyDoPoziomu(pytanie, idPoziomu)) {
          pulaMylonych.push({ waga, pytanie });
        }
      }
    }
    for (let i = 0; i < ile; i++) {
      // co trzecie pytanie ciągniemy z puli wcześniej mylonych (ważone wg liczby błędów), jeśli jakaś jest
      if (pulaMylonych.length && i % 3 === 1) {
        pytania.push(wylosujWazone(pulaMylonych));
        continue;
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
