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
