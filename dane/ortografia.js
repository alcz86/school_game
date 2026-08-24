(function () {
  const ZESTAWY = [
    {
      id: 'o-u',
      nazwa: 'ó czy u',
      warianty: ['ó', 'u'],
      wyrazy: [
        { wyraz: 'wóz',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: wóz — wozy' },
        { wyraz: 'sól',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: sól — solić, solny' },
        { wyraz: 'stół',     luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na o: stół — stoły' },
        { wyraz: 'nóż',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: nóż — noże' },
        { wyraz: 'lód',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: lód — lodowy' },
        { wyraz: 'mróz',     luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na o: mróz — mrozy' },
        { wyraz: 'pióro',    luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na e: pióro — pierze' },
        { wyraz: 'chłód',    luka: 3, poprawny: 'ó', zasada: 'ó wymienia się na o: chłód — chłodny' },
        { wyraz: 'król',     luka: 2, poprawny: 'ó', zasada: 'ó się tu nie wymienia — trzeba zapamiętać: król, królowa, królewski' },
        { wyraz: 'góra',     luka: 1, poprawny: 'ó', zasada: 'ó się tu nie wymienia — trzeba zapamiętać: góra, górka, górski' },
        { wyraz: 'ogórek',   luka: 2, poprawny: 'ó', zasada: 'ó się tu nie wymienia — trzeba zapamiętać: ogórek, ogórki' },
        { wyraz: 'wróbel',   luka: 2, poprawny: 'ó', zasada: 'ó się tu nie wymienia — trzeba zapamiętać: wróbel, wróbelek' },
        { wyraz: 'córka',    luka: 1, poprawny: 'ó', zasada: 'ó się tu nie wymienia — trzeba zapamiętać: córka, córeczka' },
        { wyraz: 'kubek',    luka: 1, poprawny: 'u', zasada: 'u się nie wymienia — trzeba zapamiętać' },
        { wyraz: 'butelka',  luka: 1, poprawny: 'u', zasada: 'u się nie wymienia — trzeba zapamiętać' },
        { wyraz: 'ulica',    luka: 0, poprawny: 'u', zasada: 'na początku wyrazu piszemy u (poza: ósemka, ósmy)' },
        { wyraz: 'uczeń',    luka: 0, poprawny: 'u', zasada: 'na początku wyrazu piszemy u (poza: ósemka, ósmy)' },
        { wyraz: 'rysunek',  luka: 3, poprawny: 'u', zasada: 'końcówka -unek zawsze przez u: rysunek, ratunek' },
        { wyraz: 'ratunek',  luka: 3, poprawny: 'u', zasada: 'końcówka -unek zawsze przez u: rysunek, ratunek' },
        { wyraz: 'babunia',  luka: 3, poprawny: 'u', zasada: 'końcówka -unia zawsze przez u: babunia, mamunia' },
        { wyraz: 'maluje',   luka: 3, poprawny: 'u', zasada: 'końcówka -uje zawsze przez u: maluje, rysuje, pracuje' },
      ],
    },
    {
      id: 'rz-z',
      nazwa: 'rz czy ż',
      warianty: ['rz', 'ż'],
      wyrazy: [
        { wyraz: 'morze',     luka: 2, poprawny: 'rz', zasada: 'rz wymienia się na r: morze — morski' },
        { wyraz: 'marzec',    luka: 2, poprawny: 'rz', zasada: 'rz wymienia się na r: marzec — marca' },
        { wyraz: 'dobrze',    luka: 3, poprawny: 'rz', zasada: 'rz wymienia się na r: dobrze — dobry' },
        { wyraz: 'malarz',    luka: 4, poprawny: 'rz', zasada: 'rz wymienia się na r: malarz — malarski' },
        { wyraz: 'piekarz',   luka: 5, poprawny: 'rz', zasada: 'rz wymienia się na r: piekarz — piekarnia' },
        { wyraz: 'lekarz',    luka: 4, poprawny: 'rz', zasada: 'nazwy zawodów mają końcówkę -arz: lekarz, malarz, piekarz' },
        { wyraz: 'talerz',    luka: 4, poprawny: 'rz', zasada: 'końcówka -erz: talerz, kołnierz, żołnierz' },
        { wyraz: 'drzewo',    luka: 1, poprawny: 'rz', zasada: 'po spółgłosce d piszemy rz: drzewo, drzwi' },
        { wyraz: 'trzy',      luka: 1, poprawny: 'rz', zasada: 'po spółgłosce t piszemy rz: trzy, trzeba' },
        { wyraz: 'przerwa',   luka: 1, poprawny: 'rz', zasada: 'po spółgłosce p piszemy rz: przerwa, przyjaciel' },
        { wyraz: 'brzeg',     luka: 1, poprawny: 'rz', zasada: 'po spółgłosce b piszemy rz: brzeg, brzuch' },
        { wyraz: 'krzesło',   luka: 1, poprawny: 'rz', zasada: 'po spółgłosce k piszemy rz: krzesło, krzak' },
        { wyraz: 'grzyb',     luka: 1, poprawny: 'rz', zasada: 'po spółgłosce g piszemy rz: grzyb, grzeczny' },
        { wyraz: 'chrząszcz', luka: 2, poprawny: 'rz', zasada: 'po ch piszemy rz: chrząszcz, chrzan' },
        { wyraz: 'może',      luka: 2, poprawny: 'ż',  zasada: 'ż wymienia się na g: może — mogę' },
        { wyraz: 'książka',   luka: 4, poprawny: 'ż',  zasada: 'ż wymienia się na g: książka — księga' },
        { wyraz: 'waży',      luka: 2, poprawny: 'ż',  zasada: 'ż wymienia się na g: waży — waga' },
        { wyraz: 'mrożone',   luka: 3, poprawny: 'ż',  zasada: 'ż wymienia się na z: mrożone — mrozić, mróz' },
        { wyraz: 'żaba',      luka: 0, poprawny: 'ż',  zasada: 'ż się tu nie wymienia — trzeba zapamiętać: żaba, żabka' },
        { wyraz: 'żyrafa',    luka: 0, poprawny: 'ż',  zasada: 'ż się tu nie wymienia — trzeba zapamiętać: żyrafa, żyrafka' },
        { wyraz: 'żółty',     luka: 0, poprawny: 'ż',  zasada: 'ż się tu nie wymienia — trzeba zapamiętać: żółty, żółtko' },
        { wyraz: 'każdy',     luka: 2, poprawny: 'ż',  zasada: 'ż się tu nie wymienia — trzeba zapamiętać: każdy, każda' },
      ],
    },
    {
      id: 'ch-h',
      nazwa: 'ch czy h',
      warianty: ['ch', 'h'],
      wyrazy: [
        { wyraz: 'dach',     luka: 2, poprawny: 'ch', zasada: 'na końcu wyrazu piszemy ch: dach, groch, ruch' },
        { wyraz: 'groch',    luka: 3, poprawny: 'ch', zasada: 'na końcu wyrazu piszemy ch: dach, groch, ruch' },
        { wyraz: 'ruch',     luka: 2, poprawny: 'ch', zasada: 'na końcu wyrazu piszemy ch: dach, groch, ruch' },
        { wyraz: 'orzech',   luka: 4, poprawny: 'ch', zasada: 'na końcu wyrazu piszemy ch: orzech, brzuch' },
        { wyraz: 'mucha',    luka: 2, poprawny: 'ch', zasada: 'ch wymienia się na sz: mucha — muszka' },
        { wyraz: 'ucho',     luka: 1, poprawny: 'ch', zasada: 'ch wymienia się na sz: ucho — uszy' },
        { wyraz: 'suchy',    luka: 2, poprawny: 'ch', zasada: 'ch wymienia się na sz: suchy — susza' },
        { wyraz: 'strach',   luka: 4, poprawny: 'ch', zasada: 'ch wymienia się na sz: strach — straszny' },
        { wyraz: 'cicho',    luka: 2, poprawny: 'ch', zasada: 'ch wymienia się na sz: cicho — ciszej' },
        { wyraz: 'schody',   luka: 1, poprawny: 'ch', zasada: 'ch trzeba tu zapamiętać: schody, schować, schowek' },
        { wyraz: 'chleb',    luka: 0, poprawny: 'ch', zasada: 'ch trzeba tu zapamiętać: chleb, chlebek' },
        { wyraz: 'chmura',   luka: 0, poprawny: 'ch', zasada: 'ch trzeba tu zapamiętać: chmura, chmurka' },
        { wyraz: 'chata',    luka: 0, poprawny: 'ch', zasada: 'ch trzeba tu zapamiętać: chata, chatka' },
        { wyraz: 'herbata',  luka: 0, poprawny: 'h',  zasada: 'h trzeba zapamiętać — wyraz przyszedł do nas z innego języka' },
        { wyraz: 'hotel',    luka: 0, poprawny: 'h',  zasada: 'h trzeba zapamiętać — wyraz przyszedł do nas z innego języka' },
        { wyraz: 'hokej',    luka: 0, poprawny: 'h',  zasada: 'h trzeba zapamiętać — wyraz przyszedł do nas z innego języka' },
        { wyraz: 'hamulec',  luka: 0, poprawny: 'h',  zasada: 'h trzeba zapamiętać — hamulec, hamować' },
        { wyraz: 'hałas',    luka: 0, poprawny: 'h',  zasada: 'h trzeba zapamiętać — hałas, hałasować' },
        { wyraz: 'huśtawka', luka: 0, poprawny: 'h',  zasada: 'h trzeba zapamiętać — huśtawka, huśtać' },
        { wyraz: 'bohater',  luka: 2, poprawny: 'h',  zasada: 'h trzeba zapamiętać — bohater, bohaterski' },
      ],
    },
  ];

  function losowy(tab) { return tab[Math.floor(Math.random() * tab.length)]; }

  function naPytanie(zestaw, w) {
    return {
      id: zestaw.id + ':' + w.wyraz,
      tresc: w.wyraz.slice(0, w.luka) + '_' + w.wyraz.slice(w.luka + w.poprawny.length),
      odpowiedz: w.poprawny,
      wyjasnienie: w.wyraz + ' — ' + w.zasada,
      // kopia, nie referencja — mutacja w warstwie UI nie może skazić danych źródłowych
      warianty: zestaw.warianty.slice(),
    };
  }

  function przetasuj(tab) {
    const t = tab.slice();
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  }

  function generuj(idZestawu, ile, wagi) {
    const zestaw = ZESTAWY.find((z) => z.id === idZestawu);
    if (!zestaw) return [];

    // Losowanie MUSI obejmować cały zestaw.
    //
    // Poprzednia wersja robiła `pula.slice(0, ile)` i dopiero potem tasowała
    // wycinek. Ponieważ `wagi` z postępów to zwykle pusty obiekt (czyli wartość
    // prawdziwa, ale sortująca wszystko na zero — sort stabilny, kolejność danych
    // bez zmian), gra pokazywała stale PIERWSZE `ile` wyrazów listy. A dane są
    // pogrupowane: najpierw wszystkie "ó", potem wszystkie "u". Efekt: przez całą
    // rundę poprawną odpowiedzią było zawsze "ó" — tryb uczył klikania w jedną
    // stronę zamiast ortografii, dokładnie wbrew spec §3.2.
    //
    // Teraz: tasujemy CAŁĄ pulę, dopiero potem przesuwamy na przód wyrazy wcześniej
    // mylone (sort jest stabilny, więc reszta zostaje w losowej kolejności), i na
    // końcu tasujemy sam wybór, żeby mylone nie lądowały zawsze na początku rundy.
    const pula = przetasuj(zestaw.wyrazy);
    if (wagi) {
      pula.sort((a, b) => (wagi[zestaw.id + ':' + b.wyraz] || 0) - (wagi[zestaw.id + ':' + a.wyraz] || 0));
    }
    const wybor = przetasuj(pula.slice(0, Math.min(ile, pula.length)));

    const wybrane = [];
    for (let i = 0; i < ile; i++) {
      wybrane.push(naPytanie(zestaw, wybor[i % wybor.length] || losowy(pula)));
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
