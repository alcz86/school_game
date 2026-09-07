(function () {
  // Zdania z luką — angielski klasa 3. Materiał przepisany z podręcznika
  // (docs/zdania-klasa3-do-zatwierdzenia.md) i zatwierdzony przez matkę 2026-09-07.
  //
  // Konwencja jest CELOWO taka sama jak w dane/slowka.js (ZESTAWY / rozdzialy /
  // generuj o identycznej sygnaturze), bo app.js traktuje oba moduły jednolicie:
  // ten sam ekran wyboru rozdziału, ten sam przełącznik trybu, te same wagi.
  //
  // RÓŻNICA WOBEC SŁÓWEK — I JEST ONA ŚWIADOMA: dystraktory NIE są losowane
  // z materiału, tylko wpisane ręcznie przy każdym zdaniu. W słówkach dystraktor
  // z tego samego zakresu zawsze jest złą odpowiedzią; tutaj losowy wyraz
  // z innego zdania bywałby gramatycznie poprawny w luce ("He ___ hiking"
  // przyjmuje zarówno "is", jak i "isn't"), czyli pytanie miałoby dwie poprawne
  // odpowiedzi. Każdy zestaw dystraktorów przeszedł ręczne sprawdzenie —
  // kolumna `sprawdzenie` w dokumencie źródłowym.
  //
  // Zdanie o płaszczu ("I am ___ a coat in winter") NIE JEST tu dodane — nie ma
  // go w podręczniku, matka to potwierdziła. Nie dopisuj go.
  //
  // Miejsce luki to ZAWSZE dokładnie jedno `____` (cztery podkreślniki).
  const ZESTAWY = [
    {
      id: 'zdania-klasa3',
      nazwa: 'Zdania z lukami',
      klasa: 3,
      zdania: [
        // unit 1 — Look at me! (s. 9)
        { zdanie: 'Mark is ten years old. He ____ elderly.', odpowiedz: "isn't",
          dystraktory: ["aren't", 'am not', "haven't"],
          wyjasnienie: 'Przy "he" uzywamy "is", a przeczenie to "isn\'t".', unit: 1 },
        { zdanie: 'My sister and I ____ scared.', odpowiedz: "aren't",
          dystraktory: ["isn't", 'am not', "hasn't"],
          wyjasnienie: '"My sister and I" to "we" - liczba mnoga, wiec "are" / "aren\'t".', unit: 1 },
        { zdanie: 'My grandma and grandpa ____ in the museum.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'be'],
          wyjasnienie: 'Dwie osoby = liczba mnoga, wiec "are".', unit: 1 },
        { zdanie: 'An unhappy uncle ____ an umbrella.', odpowiedz: 'under',
          dystraktory: ['on', 'in', 'at'],
          wyjasnienie: '"under" = pod. Stoi pod parasolem.', unit: 1 },
        { zdanie: 'A happy man with a map ____ his lap.', odpowiedz: 'on',
          dystraktory: ['under', 'at', 'of'],
          wyjasnienie: '"on" = na. Mapa lezy na kolanach.', unit: 1 },

        // unit 2 — zdrowie (s. 17)
        { zdanie: 'Tom ____ got a fever.', odpowiedz: 'has',
          dystraktory: ['have', 'is', 'are'],
          wyjasnienie: 'Przy he/she/it (Tom) mowimy "has got", nie "have got".', unit: 2 },
        { zdanie: 'Anna and Charlie ____ got a stomach ache.', odpowiedz: 'have',
          dystraktory: ['has', 'is', 'was'],
          wyjasnienie: 'Dwie osoby = "have got".', unit: 2 },
        { zdanie: 'I love Saturdays ____ my family and friends.', odpowiedz: 'with',
          dystraktory: ['to', 'at', 'of'],
          wyjasnienie: '"with" = z (kims). Spedzam sobote z rodzina.', unit: 2 },

        // unit 3 — technologia (s. 33)
        { zdanie: 'This ____ my laptop.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: '"This" to jedna rzecz - czasownik "is".', unit: 3 },
        { zdanie: 'I ____ play computer games.', odpowiedz: 'can',
          dystraktory: ['cans', 'to can', 'am'],
          wyjasnienie: '"can" = umiem/moge, i nigdy nie dostaje koncowki -s.', unit: 3 },
        { zdanie: 'It ____ expensive but it is cool.', odpowiedz: "isn't",
          dystraktory: ["aren't", 'am not', "doesn't"],
          wyjasnienie: 'Przy "it" przeczenie od "is" to "isn\'t".', unit: 3 },
        { zdanie: 'Kate ____ got a laptop.', odpowiedz: 'has',
          dystraktory: ['have', 'is', 'are'],
          wyjasnienie: 'Kate = she, wiec "has got".', unit: 3 },
        { zdanie: 'Ben can play games ____ his dad.', odpowiedz: 'with',
          dystraktory: ['to', 'at', 'of'],
          wyjasnienie: '"with" = z. Gra razem z tata.', unit: 3 },
        { zdanie: 'Kate can listen ____ music.', odpowiedz: 'to',
          dystraktory: ['at', 'on', 'for'],
          wyjasnienie: 'Po "listen" zawsze idzie "to": listen to music.', unit: 3 },

        // unit 4 — jedzenie i nawyki (s. 42)
        { zdanie: 'My aunt ____ rice for dinner.', odpowiedz: 'likes',
          dystraktory: ['like', 'liking', 'to like'],
          wyjasnienie: 'Przy he/she/it (my aunt) czasownik dostaje koncowke -s: likes.', unit: 4 },
        { zdanie: 'I always ____ my dog in the morning.', odpowiedz: 'walk',
          dystraktory: ['walks', 'walking', 'to walk'],
          wyjasnienie: 'Przy "I" czasownik jest bez koncowki: I walk.', unit: 4 },
        { zdanie: 'My grandpa ____ milk for breakfast.', odpowiedz: 'likes',
          dystraktory: ['like', 'liking', 'to like'],
          wyjasnienie: '"My grandpa" = he, wiec "likes" z koncowka -s.', unit: 4 },
        { zdanie: 'I sometimes play football ____ my friends.', odpowiedz: 'with',
          dystraktory: ['to', 'at', 'of'],
          wyjasnienie: '"with" = z kims. Gram z kolegami.', unit: 4 },
        { zdanie: 'We ____ got shrimps.', odpowiedz: 'have',
          dystraktory: ['has', 'is', 'was'],
          wyjasnienie: 'Przy "we" mowimy "have got".', unit: 4 },

        // unit 5 — zawody (s. 50)
        { zdanie: 'He can ____ people.', odpowiedz: 'help',
          dystraktory: ['helps', 'helping', 'to help'],
          wyjasnienie: 'Po "can" czasownik jest w formie podstawowej, bez -s i bez "to".', unit: 5 },
        { zdanie: 'She can ____ criminals.', odpowiedz: 'catch',
          dystraktory: ['catches', 'catching', 'to catch'],
          wyjasnienie: 'Po "can" idzie goly czasownik: can catch.', unit: 5 },
        { zdanie: 'She ____ trousers and a shirt.', odpowiedz: 'wears',
          dystraktory: ['wear', 'wearing', 'to wear'],
          wyjasnienie: 'Przy "she" czasownik dostaje koncowke -s: she wears.', unit: 5 },
        { zdanie: 'He ____ got heavy boots.', odpowiedz: 'has',
          dystraktory: ['have', 'is', 'are'],
          wyjasnienie: 'Przy "he" mowimy "has got".', unit: 5 },
        { zdanie: 'These ____ his boots.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'was'],
          wyjasnienie: '"These" = te (wiecej niz jedna rzecz), wiec "are".', unit: 5 },

        // unit 6 — miasto, there is / there are (s. 57)
        { zdanie: 'There ____ a bus station.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: 'Jedna rzecz (a bus station) - mowimy "There is".', unit: 6 },
        { zdanie: 'There ____ healthy sandwiches at the bakery.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'was'],
          wyjasnienie: 'Wiele rzeczy (sandwiches) - mowimy "There are".', unit: 6 },
        { zdanie: "Let's go home ____ bus.", odpowiedz: 'by',
          dystraktory: ['in', 'on', 'with'],
          wyjasnienie: 'O srodkach transportu mowimy "by": by bus, by car.', unit: 6 },
        { zdanie: 'What ____ your favourite place in town?', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'does'],
          wyjasnienie: '"your favourite place" to jedno miejsce, wiec "is".', unit: 6 },

        // unit 7 — sport, Present Continuous (s. 65 i 67)
        { zdanie: 'What ____ you doing?', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'do'],
          wyjasnienie: 'Przy "you" zawsze "are": What are you doing?', unit: 7 },
        { zdanie: 'Lucy ____ playing tennis.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: 'Lucy to jedna osoba (she), wiec "is playing".', unit: 7 },
        { zdanie: 'She is ____ tennis now.', odpowiedz: 'playing',
          dystraktory: ['play', 'plays', 'to play'],
          wyjasnienie: 'Po "is" czasownik ma koncowke -ing: is playing.', unit: 7 },
        { zdanie: 'Anna is ____ gymnastics.', odpowiedz: 'doing',
          dystraktory: ['do', 'does', 'to do'],
          wyjasnienie: 'Po "is" dajemy forme z -ing: is doing.', unit: 7 },
        { zdanie: 'Are you playing tennis? No, I ____ not.', odpowiedz: 'am',
          dystraktory: ['is', 'are', 'be'],
          wyjasnienie: 'Do "I" pasuje tylko "am": I am not.', unit: 7 },
        { zdanie: "I can't ____ gymnastics.", odpowiedz: 'do',
          dystraktory: ['does', 'doing', 'to do'],
          wyjasnienie: 'Po "can\'t" czasownik jest w formie podstawowej.', unit: 7 },
        { zdanie: 'Look ____ Lucy, she is playing tennis.', odpowiedz: 'at',
          dystraktory: ['in', 'on', 'to'],
          wyjasnienie: 'Po "look" w znaczeniu "popatrz na" idzie "at": look at.', unit: 7 },
        { zdanie: 'I can ____ you how to play tennis.', odpowiedz: 'teach',
          dystraktory: ['teaches', 'teaching', 'to teach'],
          wyjasnienie: 'Po "can" czasownik bez koncowki i bez "to".', unit: 7 },

        // unit 8 — Summer Camp (s. 75 i 83)
        { zdanie: "He's hiking ____ the hills.", odpowiedz: 'in',
          dystraktory: ['at', 'under', 'of'],
          wyjasnienie: 'O wedrowce w gorach mowimy "in the hills".', unit: 8 },
        { zdanie: "She's ____ in the pond.", odpowiedz: 'fishing',
          dystraktory: ['fish', 'fishes', 'to fish'],
          wyjasnienie: 'Po "is/\'s" czasownik ma koncowke -ing: she\'s fishing.', unit: 8 },
        { zdanie: 'He ____ kayaking.', odpowiedz: "isn't",
          dystraktory: ["aren't", 'am not', "doesn't"],
          wyjasnienie: 'Przeczenie przy "he" w tym czasie to "isn\'t" + -ing.', unit: 8 },
        { zdanie: "She isn't ____ in the sea.", odpowiedz: 'diving',
          dystraktory: ['dive', 'dives', 'to dive'],
          wyjasnienie: 'Po "isn\'t" czasownik ma koncowke -ing.', unit: 8 },
        { zdanie: '____ he hiking? Yes, he is.', odpowiedz: 'Is',
          dystraktory: ['Are', 'Am', 'Does'],
          wyjasnienie: 'Pytanie o "he" zaczynamy od "Is": Is he hiking?', unit: 8 },
        { zdanie: 'My grandma is ____ photos.', odpowiedz: 'taking',
          dystraktory: ['take', 'takes', 'to take'],
          wyjasnienie: 'Po "is" czasownik z koncowka -ing: is taking.', unit: 8 },
        { zdanie: 'My dad is ____ cheese sandwiches.', odpowiedz: 'eating',
          dystraktory: ['eat', 'eats', 'to eat'],
          wyjasnienie: 'Po "is" dajemy forme z -ing: is eating.', unit: 8 },
        { zdanie: 'I ____ looking at starfish.', odpowiedz: 'am',
          dystraktory: ['is', 'are', 'be'],
          wyjasnienie: 'Do "I" pasuje tylko "am": I am looking.', unit: 8 },
        { zdanie: 'We ____ on the beach.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'was'],
          wyjasnienie: 'Przy "we" uzywamy "are".', unit: 8 },
        { zdanie: 'My family is ____ a picnic.', odpowiedz: 'having',
          dystraktory: ['have', 'has', 'to have'],
          wyjasnienie: 'Po "is" czasownik ma koncowke -ing: is having.', unit: 8 },
      ],
    },
  ];

  function przetasuj(tab) {
    for (let i = tab.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tab[i], tab[j]] = [tab[j], tab[i]];
    }
    return tab;
  }

  // Numery rozdziałów obecne w zestawie, rosnąco, bez duplikatów.
  function rozdzialy(idZestawu) {
    const zestaw = ZESTAWY.find((z) => z.id === idZestawu);
    if (!zestaw) return [];
    return Array.from(new Set(zestaw.zdania.map((w) => w.unit))).sort((a, b) => a - b);
  }

  // Ta sama koercja co w dane/slowka.js — NIE UPRASZCZAJ. Ekran wyboru rozdziału
  // czyta numer z `dataset.*`, a to w HTML ZAWSZE string; bez `Number()` zakres
  // { do: '3' } przeleciałby jako "brak zakresu" i gra po cichu dałaby cały materiał.
  // Pułapka odwrotna: Number(null) / Number('') / Number(false) dają 0, a 0 bywa
  // prawidłowym numerem rozdziału — dlatego typ sprawdzamy PRZED koercją.
  function numerRozdzialu(wartosc) {
    if (typeof wartosc === 'number') return Number.isInteger(wartosc) ? wartosc : null;
    if (typeof wartosc === 'string' && wartosc.trim() !== '') {
      const n = Number(wartosc);
      return Number.isInteger(n) ? n : null;
    }
    return null;
  }

  function wZakresie(zdania, zakres) {
    if (!zakres) return zdania.slice();
    const tylko = numerRozdzialu(zakres.tylko);
    if (tylko !== null) return zdania.filter((w) => w.unit === tylko);
    const doN = numerRozdzialu(zakres.do);
    if (doN !== null) return zdania.filter((w) => w.unit <= doN);
    return zdania.slice();
  }

  function wylosujWazone(pozycje) {
    const suma = pozycje.reduce((s, p) => s + p.waga, 0);
    let los = Math.random() * suma;
    for (const p of pozycje) {
      los -= p.waga;
      if (los < 0) return p.pozycja;
    }
    return pozycje[pozycje.length - 1].pozycja;
  }

  // Identyfikator pytania = id zestawu + treść zdania. Treść jest unikalna
  // (pilnuje tego test) i NIE ZALEŻY OD ZAKRESU — to samo zdanie ma ten sam klucz
  // w rundzie "tylko rozdział 8" i w "od początku do 8", więc statystyki się sumują.
  function idPytania(idZestawu, z) {
    return idZestawu + ':' + z.zdanie;
  }

  function zbudujPytanie(idZestawu, tryb, z) {
    // Dystraktory są wpisane przy zdaniu, nie losowane z materiału — patrz komentarz
    // na górze pliku. Tasujemy TUTAJ, bo inaczej poprawna odpowiedź stałaby zawsze
    // na tym samym przycisku i dziecko wygrywałoby bez czytania zdania.
    const warianty = tryb === 'wybor'
      ? przetasuj([z.odpowiedz].concat(z.dystraktory))
      : null;
    return {
      id: idPytania(idZestawu, z),
      tresc: z.zdanie,
      odpowiedz: z.odpowiedz,
      wyjasnienie: z.wyjasnienie,
      warianty,
    };
  }

  function generuj(idZestawu, ile, tryb, wagi, zakres) {
    const zestaw = ZESTAWY.find((z) => z.id === idZestawu);
    if (!zestaw) return [];

    const material = wZakresie(zestaw.zdania, zakres);
    if (!material.length) return [];

    const pula = przetasuj(material.slice());

    // Pula wcześniej mylonych — TYLKO z bieżącego zakresu. Zdanie z rozdziału 8
    // nie może wpaść do rundy "tylko rozdział 3" dlatego, że jest często mylone.
    const pulaMylonych = [];
    if (wagi) {
      for (const z of material) {
        const waga = wagi[idPytania(idZestawu, z)];
        if (waga > 0) pulaMylonych.push({ waga, pozycja: z });
      }
    }

    const pytania = [];
    for (let i = 0; i < ile; i++) {
      const z = (pulaMylonych.length && i % 3 === 1) ? wylosujWazone(pulaMylonych) : pula[i % pula.length];
      pytania.push(zbudujPytanie(idZestawu, tryb, z));
    }
    return pytania;
  }

  const api = { ZESTAWY, rozdzialy, generuj };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.zdania = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
