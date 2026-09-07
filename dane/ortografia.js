(function () {
  const ZESTAWY = [
    {
      id: 'o-u',
      nazwa: 'ó czy u',
      opis: 'wymiana ó na o, e — i wyjątki do zapamiętania',
      warianty: ['ó', 'u'],
      wyrazy: [
        { wyraz: 'wóz',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: wóz — wozy' },
        { wyraz: 'sól',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: sól — solić, solny' },
        { wyraz: 'stół',     luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na o: stół — stoły' },
        { wyraz: 'nóż',      luka: 1, poprawny: 'ó', zasada: 'ó wymienia się na o: nóż — noże' },
        { wyraz: 'miód',     luka: 2, poprawny: 'ó', zasada: 'ó wymienia się na o: miód — miodowy' },
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
      opis: 'rz po spółgłosce i w wymianie na r; ż osobno',
      warianty: ['rz', 'ż'],
      wyrazy: [
        // Uwaga: NIE wracać tu do wyrazu `morze`. Renderuje się jako `mo_e`, a zły
        // wariant daje `może` — bardzo częste polskie słowo, które dziewięciolatek
        // zna lepiej niż wymianę „morze — morski". Dziecko odpowiada sensownie,
        // dostaje „Prawie!" i zasadę do wyrazu, o który nie było pytane.
        // `dworzec` ma tę samą wymianę rz→r, a `dwożec` nie jest żadnym słowem.
        { wyraz: 'dworzec',   luka: 3, poprawny: 'rz', zasada: 'rz wymienia się na r: dworzec — dworca' },
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
        { wyraz: 'książka',   luka: 4, poprawny: 'ż',  zasada: 'ż wymienia się na g: książka — księga' },
        { wyraz: 'ważny',     luka: 2, poprawny: 'ż',  zasada: 'ż wymienia się na g: ważny — waga' },
        { wyraz: 'bliżej',    luka: 3, poprawny: 'ż',  zasada: 'ż wymienia się na s: bliżej — blisko' },
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
      opis: 'ch na końcu wyrazu i w wymianie na sz; h w zapożyczeniach',
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
    // ------------------------------------------------------------------
    // ZMIĘKCZENIA — zasada POZYCYJNA, nie pamięciowa.
    //
    // Dziecko nie uczy się listy wyrazów, tylko patrzy na literę ZARAZ ZA luką:
    //   • samogłoska (a ą e ę o ó u)  → forma dwuznakowa: si / ci / ni / zi / dzi
    //   • spółgłoska albo koniec wyrazu → forma z kreską: ś / ć / ń / ź / dź
    //
    // PUŁAPKA (test `zmiękczenia: zasada pozycyjna` pilnuje jej automatycznie):
    // wyrazy typu `zima`, `nic`, `cisza`, `siła`, `dzik`, `godzina`, `chodzić`
    // wyglądają jak zmiękczenia, ale `i` jest w nich PEŁNĄ SAMOGŁOSKĄ, nie znakiem
    // miękkości. Nie mają konkurencyjnej pisowni (`źma`, `ńc`, `ćsza` nie istnieją),
    // więc niczego nie uczą — a przy okazji łamią zasadę pozycyjną, bo po `zi`
    // stoi w nich spółgłoska. NIE DOPISYWAĆ TAKICH WYRAZÓW.
    //
    // Druga pułapka: `ś`/`ć`/`ń`/`ź`/`dź` na końcu wyrazu bardzo często zamienia się
    // przy złym wariancie w prawdziwą formę liczby mnogiej — `gęś→gęsi`, `koń→koni`,
    // `liść→liści`, `chodź→chodzi`, `śledź→śledzi`, `gwóźdź→gwóździ`, `nić→nici`.
    // Te wyrazy są świadomie odrzucone: dziecko odpowiadałoby sensownie i traciło
    // serce. Zostawione są tylko takie zakończenia, gdzie zły wariant nie jest
    // żadnym polskim słowem (`być→byci`, `weź→wezi`, `idź→idzi`).
    // ------------------------------------------------------------------
    //
    // WSZYSTKIE PIĘĆ PAR ŻYJE W JEDNYM ZESTAWIE (decyzja 2026-09-07).
    // Powód: to jedna reguła, nie pięć. Mieszanie par w obrębie rundy ćwiczy
    // patrzenie na literę za luką lepiej niż pięć osobnych przebiegów, a ekran
    // wyboru poziomu jest dla dziecka prostszy (4 kafle zamiast 8).
    //
    // KONSEKWENCJA: `warianty` NIE MOGĄ być polem zestawu — przy `ciocia`
    // przyciski mają pokazać ć/ci, a przy `ślad` ś/si. Dlatego każdy wyraz niesie
    // WŁASNE `warianty`, a `naPytanie` bierze `w.warianty` przed `zestaw.warianty`.
    // Test `kazdy wyraz zmiekczen ma wlasne warianty` pilnuje tego automatycznie.
    {
      id: 'zmiekczenia',
      nazwa: 'Zmiękczenia',
      opis: 'ś/si · ć/ci · ń/ni · ź/zi · dź/dzi',
      wyrazy: [
        // --- ś / si ---
        { wyraz: 'siostra',   luka: 0, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + o — siostra' },
        { wyraz: 'siano',     luka: 0, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + a — siano' },
        { wyraz: 'siedem',    luka: 0, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + e — siedem' },
        { wyraz: 'siatka',    luka: 0, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + a — siatka' },
        { wyraz: 'sierpień',  luka: 0, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + e — sierpień' },
        { wyraz: 'osiem',     luka: 1, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + e — osiem' },
        { wyraz: 'jesień',    luka: 2, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + e — jesień' },
        { wyraz: 'prosię',    luka: 3, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + ę — prosię' },
        { wyraz: 'gąsienica', luka: 2, poprawny: 'si', warianty: ['ś', 'si'], zasada: 'przed samogłoską piszemy si: si + e — gąsienica' },
        { wyraz: 'ślad',      luka: 0, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + l — ślad' },
        { wyraz: 'śnieg',     luka: 0, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + n — śnieg' },
        { wyraz: 'świeca',    luka: 0, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + w — świeca' },
        { wyraz: 'świat',     luka: 0, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + w — świat' },
        { wyraz: 'ślimak',    luka: 0, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + l — ślimak' },
        { wyraz: 'śmiech',    luka: 0, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + m — śmiech' },
        { wyraz: 'środa',     luka: 0, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + r — środa' },
        { wyraz: 'myśl',      luka: 2, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + l — myśl' },
        { wyraz: 'wiśnia',    luka: 2, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'przed spółgłoską piszemy ś: ś + n — wiśnia' },
        { wyraz: 'coś',       luka: 2, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'na końcu wyrazu piszemy ś: coś' },
        { wyraz: 'ktoś',      luka: 3, poprawny: 'ś', warianty: ['ś', 'si'],  zasada: 'na końcu wyrazu piszemy ś: ktoś' },
        // --- ć / ci ---
        { wyraz: 'ciocia',   luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + o — ciocia' },
        { wyraz: 'ciepło',   luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + e — ciepło' },
        { wyraz: 'ciasto',   luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + a — ciasto' },
        { wyraz: 'ciało',    luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + a — ciało' },
        { wyraz: 'ciemno',   luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + e — ciemno' },
        { wyraz: 'ciężko',   luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + ę — ciężko' },
        { wyraz: 'ciekawy',  luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + e — ciekawy' },
        { wyraz: 'cieszyć',  luka: 0, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + e — cieszyć' },
        { wyraz: 'babcia',   luka: 3, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + a — babcia' },
        { wyraz: 'kwiecień', luka: 4, poprawny: 'ci', warianty: ['ć', 'ci'], zasada: 'przed samogłoską piszemy ci: ci + e — kwiecień' },
        { wyraz: 'ćma',      luka: 0, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'przed spółgłoską piszemy ć: ć + m — ćma' },
        { wyraz: 'ćwiczyć',  luka: 0, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'przed spółgłoską piszemy ć: ć + w — ćwiczyć' },
        { wyraz: 'być',      luka: 2, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'na końcu wyrazu piszemy ć: być' },
        { wyraz: 'pić',      luka: 2, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'na końcu wyrazu piszemy ć: pić' },
        { wyraz: 'jeść',     luka: 3, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'na końcu wyrazu piszemy ć: jeść' },
        { wyraz: 'grać',     luka: 3, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'na końcu wyrazu piszemy ć: grać' },
        { wyraz: 'czytać',   luka: 5, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'na końcu wyrazu piszemy ć: czytać' },
        { wyraz: 'płacić',   luka: 5, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'na końcu wyrazu piszemy ć: płacić' },
        { wyraz: 'śpiewać',  luka: 6, poprawny: 'ć', warianty: ['ć', 'ci'],  zasada: 'na końcu wyrazu piszemy ć: śpiewać' },
        // --- ń / ni ---
        { wyraz: 'niebo',      luka: 0, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + e — niebo' },
        { wyraz: 'niebieski',  luka: 0, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + e — niebieski' },
        { wyraz: 'niania',     luka: 0, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + a — niania' },
        { wyraz: 'jaskinia',   luka: 5, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + a — jaskinia' },
        { wyraz: 'nietoperz',  luka: 0, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + e — nietoperz' },
        { wyraz: 'koniec',     luka: 2, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + e — koniec' },
        { wyraz: 'konie',      luka: 2, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + e — konie' },
        { wyraz: 'zdanie',     luka: 3, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + e — zdanie' },
        { wyraz: 'kuchnia',    luka: 4, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + a — kuchnia' },
        { wyraz: 'śniadanie',  luka: 1, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + a — śniadanie' },
        { wyraz: 'pieniądze',  luka: 3, poprawny: 'ni', warianty: ['ń', 'ni'], zasada: 'przed samogłoską piszemy ni: ni + ą — pieniądze' },
        { wyraz: 'bańka',      luka: 2, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'przed spółgłoską piszemy ń: ń + k — bańka' },
        { wyraz: 'słońce',     luka: 3, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'przed spółgłoską piszemy ń: ń + c — słońce' },
        { wyraz: 'tańczyć',    luka: 2, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'przed spółgłoską piszemy ń: ń + c — tańczyć' },
        { wyraz: 'łańcuch',    luka: 2, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'przed spółgłoską piszemy ń: ń + c — łańcuch' },
        { wyraz: 'skończyć',   luka: 3, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'przed spółgłoską piszemy ń: ń + c — skończyć' },
        { wyraz: 'końcówka',   luka: 2, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'przed spółgłoską piszemy ń: ń + c — końcówka' },
        { wyraz: 'grudzień',   luka: 7, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'na końcu wyrazu piszemy ń: grudzień' },
        { wyraz: 'ogień',      luka: 4, poprawny: 'ń', warianty: ['ń', 'ni'],  zasada: 'na końcu wyrazu piszemy ń: ogień' },
        // --- ź / zi ---
        { wyraz: 'ziemia',   luka: 0, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + e — ziemia' },
        { wyraz: 'zielony',  luka: 0, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + e — zielony' },
        { wyraz: 'zieleń',   luka: 0, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + e — zieleń' },
        { wyraz: 'ziewać',   luka: 0, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + e — ziewać' },
        { wyraz: 'ziarno',   luka: 0, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + a — ziarno' },
        { wyraz: 'ziemniak', luka: 0, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + e — ziemniak' },
        { wyraz: 'koziołek', luka: 2, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + o — koziołek' },
        { wyraz: 'poziomka', luka: 2, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + o — poziomka' },
        { wyraz: 'gałęzie',  luka: 4, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + e — gałęzie' },
        { wyraz: 'buzia',    luka: 2, poprawny: 'zi', warianty: ['ź', 'zi'], zasada: 'przed samogłoską piszemy zi: zi + a — buzia' },
        { wyraz: 'źle',      luka: 0, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + l — źle' },
        { wyraz: 'źrebak',   luka: 0, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + r — źrebak' },
        { wyraz: 'źródło',   luka: 0, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + r — źródło' },
        { wyraz: 'późno',    luka: 2, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + n — późno' },
        { wyraz: 'groźny',   luka: 3, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + n — groźny' },
        { wyraz: 'mroźny',   luka: 3, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + n — mroźny' },
        { wyraz: 'bliźniak', luka: 3, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + n — bliźniak' },
        { wyraz: 'wyraźnie', luka: 4, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'przed spółgłoską piszemy ź: ź + n — wyraźnie' },
        { wyraz: 'weź',      luka: 2, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'na końcu wyrazu piszemy ź: weź' },
        { wyraz: 'gałąź',    luka: 4, poprawny: 'ź', warianty: ['ź', 'zi'],  zasada: 'na końcu wyrazu piszemy ź: gałąź' },
        // --- dź / dzi ---
        { wyraz: 'dziadek',      luka: 0, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + a — dziadek' },
        { wyraz: 'dziecko',      luka: 0, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — dziecko' },
        { wyraz: 'dziewczyna',   luka: 0, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — dziewczyna' },
        { wyraz: 'dziura',       luka: 0, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + u — dziura' },
        { wyraz: 'dzień',        luka: 0, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — dzień' },
        { wyraz: 'dziesięć',     luka: 0, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — dziesięć' },
        { wyraz: 'dziewięć',     luka: 0, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — dziewięć' },
        { wyraz: 'niedziela',    luka: 3, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — niedziela' },
        { wyraz: 'poniedziałek', luka: 5, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + a — poniedziałek' },
        { wyraz: 'widzieć',      luka: 2, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — widzieć' },
        { wyraz: 'bardziej',     luka: 3, poprawny: 'dzi', warianty: ['dź', 'dzi'], zasada: 'przed samogłoską piszemy dzi: dzi + e — bardziej' },
        { wyraz: 'dźwig',        luka: 0, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'przed spółgłoską piszemy dź: dź + w — dźwig' },
        { wyraz: 'dźwięk',       luka: 0, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'przed spółgłoską piszemy dź: dź + w — dźwięk' },
        { wyraz: 'dźwigać',      luka: 0, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'przed spółgłoską piszemy dź: dź + w — dźwigać' },
        // ŚWIADOMIE ZOSTAWIONE, mimo słabszej dydaktyki. `niedźwiedź` ma DWA `dź`,
        // więc przy każdej pozycji luki drugie `dź` zostaje widoczne i dziecko może
        // je przepisać, zamiast zastosować regułę. Przeniesienie luki na końcowe `dź`
        // (`niedźwie_`) odtwarza dokładnie tę samą podpowiedź z drugiej strony.
        // Wymiana wyrazu też nie wychodzi: `śledź` → zły wariant daje `śledzi`,
        // `łabędź` → `łabędzi` — oba to prawdziwe polskie słowa, czyli usterka
        // gorsza od obecnej. Pytanie NIE jest błędne (`dź` jest poprawne, `zasada`
        // nazywa regułę po odpowiedzi), a regułę „przed spółgłoską" niosą bez
        // podpowiedzi jeszcze `dźwig`, `dźwięk`, `dźwigać` i `wiedźma`.
        { wyraz: 'niedźwiedź',   luka: 3, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'przed spółgłoską piszemy dź: dź + w — niedźwiedź' },
        { wyraz: 'wiedźma',      luka: 3, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'przed spółgłoską piszemy dź: dź + m — wiedźma' },
        { wyraz: 'idź',          luka: 1, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'na końcu wyrazu piszemy dź: idź' },
        { wyraz: 'jedź',         luka: 2, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'na końcu wyrazu piszemy dź: jedź' },
        { wyraz: 'wejdź',        luka: 3, poprawny: 'dź', warianty: ['dź', 'dzi'],  zasada: 'na końcu wyrazu piszemy dź: wejdź' },
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
      // Para przycisków jest własnością WYRAZU, gdy ją ma (zestaw `zmiekczenia`
      // miesza pięć par w jednej rundzie), a dopiero w drugiej kolejności zestawu
      // (o-u, rz-z, ch-h — tam para jest stała dla całego poziomu).
      // Zawsze KOPIA, nie referencja — mutacja w warstwie UI (tasowanie przycisków)
      // nie może skazić danych źródłowych. To była już raz usterka w tym pliku.
      warianty: (w.warianty || zestaw.warianty).slice(),
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
