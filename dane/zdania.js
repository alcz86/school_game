(function () {
  // Zdania z luką — angielski klasa 3. Materiał przepisany z podręcznika
  // (docs/zdania-klasa3-do-zatwierdzenia.md — partia 1,
  //  docs/zdania-klasa3-partia2-do-zatwierdzenia.md — partia 2)
  // i zatwierdzony przez matkę 2026-09-07.
  //
  // ZAWARTOŚĆ TEGO PLIKU JEST WIĄZANA TESTEM Z OBOMA DOKUMENTAMI —
  // tests/zdania-zgodnosc-z-dokumentem.test.js parsuje je i porównuje pole po polu.
  // Każda zmiana zdania, odpowiedzi, dystraktora, wyjaśnienia albo numeru unitu
  // musi wejść JEDNOCZEŚNIE tutaj i w dokumencie źródłowym, inaczej test padnie.
  // To celowe: dokument jest tym, co zatwierdził człowiek, a plik tylko go wykonuje.
  //
  // Wyjaśnienia są pisane POPRAWNĄ POLSZCZYZNĄ Z DIAKRYTYKAMI. Ta sama gra uczy
  // w drugim trybie ortografii — pokazywanie dziecku „wiec" i „mowimy" po każdej
  // odpowiedzi podważałoby tamten tryb. Pilnuje tego osobny test.
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
        // ---------------------------------------------------------------
        // PARTIA 1 — docs/zdania-klasa3-do-zatwierdzenia.md
        // Dwie pozycje Phonics Fun z unitu 1 („An unhappy uncle ____ an umbrella.",
        // „A happy man with a map ____ his lap.") NIE są tu przenoszone: to fragmenty
        // rymowanki bez orzeczenia, więc żadna z czterech opcji nie tworzy pełnego
        // zdania, a wyjaśnienie dopowiadało czasownik, którego dziecko nie widzi.
        // Unit 1 dostaje materiał z partii 2. Nie dopisuj ich z powrotem.
        // ---------------------------------------------------------------

        // unit 1 — Look at me! (s. 9)
        { zdanie: 'Mark is ten years old. He ____ elderly.', odpowiedz: "isn't",
          dystraktory: ["aren't", 'am not', "haven't"],
          wyjasnienie: 'Przy "he" używamy "is", a przeczenie to "isn\'t".', unit: 1 },
        { zdanie: 'My sister and I ____ scared.', odpowiedz: "aren't",
          dystraktory: ["isn't", 'am not', "hasn't"],
          wyjasnienie: '"My sister and I" to "we" - liczba mnoga, więc "are" / "aren\'t".', unit: 1 },
        { zdanie: 'My grandma and grandpa ____ in the museum.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'be'],
          wyjasnienie: 'Dwie osoby = liczba mnoga, więc "are".', unit: 1 },

        // unit 2 — zdrowie (s. 17)
        { zdanie: 'Tom ____ got a fever.', odpowiedz: 'has',
          dystraktory: ['have', 'is', 'are'],
          wyjasnienie: 'Przy he/she/it (Tom) mówimy "has got", nie "have got".', unit: 2 },
        { zdanie: 'Anna and Charlie ____ got a stomach ache.', odpowiedz: 'have',
          dystraktory: ['has', 'is', 'was'],
          wyjasnienie: 'Dwie osoby = "have got".', unit: 2 },
        { zdanie: 'I love Saturdays ____ my family and friends.', odpowiedz: 'with',
          dystraktory: ['to', 'at', 'of'],
          wyjasnienie: '"with" = z (kimś). Spędzam sobotę z rodziną.', unit: 2 },

        // unit 3 — technologia (s. 33)
        { zdanie: 'This ____ my laptop.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: '"This" to jedna rzecz - czasownik "is".', unit: 3 },
        { zdanie: 'I ____ play computer games.', odpowiedz: 'can',
          dystraktory: ['cans', 'to can', 'am'],
          wyjasnienie: '"can" = umiem/mogę, i nigdy nie dostaje końcówki -s.', unit: 3 },
        { zdanie: 'It ____ expensive but it is cool.', odpowiedz: "isn't",
          dystraktory: ["aren't", 'am not', "doesn't"],
          wyjasnienie: 'Przy "it" przeczenie od "is" to "isn\'t".', unit: 3 },
        { zdanie: 'Kate ____ got a laptop.', odpowiedz: 'has',
          dystraktory: ['have', 'is', 'are'],
          wyjasnienie: 'Kate = she, więc "has got".', unit: 3 },
        { zdanie: 'Ben can play games ____ his dad.', odpowiedz: 'with',
          dystraktory: ['to', 'at', 'of'],
          wyjasnienie: '"with" = z. Gra razem z tatą.', unit: 3 },
        { zdanie: 'Kate can listen ____ music.', odpowiedz: 'to',
          dystraktory: ['at', 'on', 'for'],
          wyjasnienie: 'Po "listen" zawsze idzie "to": listen to music.', unit: 3 },

        // unit 4 — jedzenie i nawyki (s. 42)
        { zdanie: 'My aunt ____ rice for dinner.', odpowiedz: 'likes',
          dystraktory: ['like', 'liking', 'to like'],
          wyjasnienie: 'Przy he/she/it (my aunt) czasownik dostaje końcówkę -s: likes.', unit: 4 },
        { zdanie: 'I always ____ my dog in the morning.', odpowiedz: 'walk',
          dystraktory: ['walks', 'walking', 'to walk'],
          wyjasnienie: 'Przy "I" czasownik jest bez końcówki: I walk.', unit: 4 },
        { zdanie: 'My grandpa ____ milk for breakfast.', odpowiedz: 'likes',
          dystraktory: ['like', 'liking', 'to like'],
          wyjasnienie: '"My grandpa" = he, więc "likes" z końcówką -s.', unit: 4 },
        { zdanie: 'I sometimes play football ____ my friends.', odpowiedz: 'with',
          dystraktory: ['to', 'at', 'of'],
          wyjasnienie: '"with" = z kimś. Gram z kolegami.', unit: 4 },
        { zdanie: 'We ____ got shrimps.', odpowiedz: 'have',
          dystraktory: ['has', 'is', 'was'],
          wyjasnienie: 'Przy "we" mówimy "have got".', unit: 4 },

        // unit 5 — zawody (s. 50)
        { zdanie: 'He can ____ people.', odpowiedz: 'help',
          dystraktory: ['helps', 'helping', 'to help'],
          wyjasnienie: 'Po "can" czasownik jest w formie podstawowej, bez -s i bez "to".', unit: 5 },
        { zdanie: 'She can ____ criminals.', odpowiedz: 'catch',
          dystraktory: ['catches', 'catching', 'to catch'],
          wyjasnienie: 'Po "can" idzie goły czasownik: can catch.', unit: 5 },
        { zdanie: 'She ____ trousers and a shirt.', odpowiedz: 'wears',
          dystraktory: ['wear', 'wearing', 'to wear'],
          wyjasnienie: 'Przy "she" czasownik dostaje końcówkę -s: she wears.', unit: 5 },
        { zdanie: 'He ____ got heavy boots.', odpowiedz: 'has',
          dystraktory: ['have', 'is', 'are'],
          wyjasnienie: 'Przy "he" mówimy "has got".', unit: 5 },
        { zdanie: 'These ____ his boots.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'was'],
          wyjasnienie: '"These" = te (więcej niż jedna rzecz), więc "are".', unit: 5 },

        // unit 6 — miasto, there is / there are (s. 57)
        { zdanie: 'There ____ a bus station.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: 'Jedna rzecz (a bus station) - mówimy "There is".', unit: 6 },
        { zdanie: 'There ____ healthy sandwiches at the bakery.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'was'],
          wyjasnienie: 'Wiele rzeczy (sandwiches) - mówimy "There are".', unit: 6 },
        { zdanie: "Let's go home ____ bus.", odpowiedz: 'by',
          dystraktory: ['in', 'on', 'with'],
          wyjasnienie: 'O środkach transportu mówimy "by": by bus, by car.', unit: 6 },
        { zdanie: 'What ____ your favourite place in town?', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'does'],
          wyjasnienie: '"your favourite place" to jedno miejsce, więc "is".', unit: 6 },

        // unit 7 — sport, Present Continuous (s. 65 i 67)
        { zdanie: 'What ____ you doing?', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'do'],
          wyjasnienie: 'Przy "you" zawsze "are": What are you doing?', unit: 7 },
        { zdanie: 'Lucy ____ playing tennis.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: 'Lucy to jedna osoba (she), więc "is playing".', unit: 7 },
        { zdanie: 'She is ____ tennis now.', odpowiedz: 'playing',
          dystraktory: ['play', 'plays', 'to play'],
          wyjasnienie: 'Po "is" czasownik ma końcówkę -ing: is playing.', unit: 7 },
        { zdanie: 'Anna is ____ gymnastics.', odpowiedz: 'doing',
          dystraktory: ['do', 'does', 'to do'],
          wyjasnienie: 'Po "is" dajemy formę z -ing: is doing.', unit: 7 },
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
          wyjasnienie: 'Po "can" czasownik bez końcówki i bez "to".', unit: 7 },

        // unit 8 — Summer Camp (s. 75 i 83)
        { zdanie: "He's hiking ____ the hills.", odpowiedz: 'in',
          dystraktory: ['at', 'under', 'of'],
          wyjasnienie: 'O wędrówce w górach mówimy "in the hills".', unit: 8 },
        { zdanie: "She's ____ in the pond.", odpowiedz: 'fishing',
          dystraktory: ['fish', 'fishes', 'to fish'],
          wyjasnienie: 'Po "is/\'s" czasownik ma końcówkę -ing: she\'s fishing.', unit: 8 },
        { zdanie: 'He ____ kayaking.', odpowiedz: "isn't",
          dystraktory: ["aren't", 'am not', "doesn't"],
          wyjasnienie: 'Przeczenie przy "he" w tym czasie to "isn\'t" + -ing.', unit: 8 },
        { zdanie: "She isn't ____ in the sea.", odpowiedz: 'diving',
          dystraktory: ['dive', 'dives', 'to dive'],
          wyjasnienie: 'Po "isn\'t" czasownik ma końcówkę -ing.', unit: 8 },
        { zdanie: '____ he hiking? Yes, he is.', odpowiedz: 'Is',
          dystraktory: ['Are', 'Am', 'Does'],
          wyjasnienie: 'Pytanie o "he" zaczynamy od "Is": Is he hiking?', unit: 8 },
        { zdanie: 'My grandma is ____ photos.', odpowiedz: 'taking',
          dystraktory: ['take', 'takes', 'to take'],
          wyjasnienie: 'Po "is" czasownik z końcówką -ing: is taking.', unit: 8 },
        { zdanie: 'My dad is ____ cheese sandwiches.', odpowiedz: 'eating',
          dystraktory: ['eat', 'eats', 'to eat'],
          wyjasnienie: 'Po "is" dajemy formę z -ing: is eating.', unit: 8 },
        { zdanie: 'I ____ looking at starfish.', odpowiedz: 'am',
          dystraktory: ['is', 'are', 'be'],
          wyjasnienie: 'Do "I" pasuje tylko "am": I am looking.', unit: 8 },
        { zdanie: 'We ____ on the beach.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'was'],
          wyjasnienie: 'Przy "we" używamy "are".', unit: 8 },
        { zdanie: 'My family is ____ a picnic.', odpowiedz: 'having',
          dystraktory: ['have', 'has', 'to have'],
          wyjasnienie: 'Po "is" czasownik ma końcówkę -ing: is having.', unit: 8 },

        // ---------------------------------------------------------------
        // PARTIA 2 — docs/zdania-klasa3-partia2-do-zatwierdzenia.md
        // 46 pozycji w dokumencie, 45 w grze. „It has got a ____" (toothache,
        // s. 15) NIE wchodzi: w podręczniku stoi tam kolorowy prostokąt zamiast
        // słowa, więc rzeczownik był rekonstrukcją, a nie przepisaniem. Matka
        // zatwierdziła resztę z tym jednym wyjątkiem. Nie dopisuj go.
        // ---------------------------------------------------------------

        // unit 1 (s. 11 i 13)
        { zdanie: 'We ____ the Taylors, a family from the UK.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'be'],
          wyjasnienie: 'Przy "we" zawsze "are": we are.', unit: 1 },
        { zdanie: 'Kevin is not an adult, but he ____ tall.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: 'Do "he" pasuje tylko "is".', unit: 1 },
        { zdanie: '____ Kevin an adult?', odpowiedz: 'Is',
          dystraktory: ['Are', 'Am', 'Does'],
          wyjasnienie: 'Pytanie o jedną osobę (he) zaczynamy od "Is".', unit: 1 },
        { zdanie: 'She is ____ a white blouse and a pink jumper.', odpowiedz: 'wearing',
          dystraktory: ['wear', 'wears', 'to wear'],
          wyjasnienie: 'Po "is" czasownik ma końcówkę -ing: is wearing.', unit: 1 },
        { zdanie: 'My eyes ____ black.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'be'],
          wyjasnienie: '"eyes" to liczba mnoga, więc "are".', unit: 1 },
        { zdanie: 'My hair ____ brown.', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'be'],
          wyjasnienie: '"hair" traktujemy jak jedną rzecz, więc "is".', unit: 1 },

        // unit 2 (s. 15, 19 i 21)
        { zdanie: 'They ____ got a fever.', odpowiedz: 'have',
          dystraktory: ['has', 'is', 'was'],
          wyjasnienie: 'Przy "they" mówimy "have got".', unit: 2 },
        { zdanie: 'I ____ chocolate every day.', odpowiedz: 'eat',
          dystraktory: ['eats', 'eating', 'to eat'],
          wyjasnienie: 'Przy "I" czasownik jest bez końcówki: I eat.', unit: 2 },
        { zdanie: 'I ____ eat meat, please give me peas.', odpowiedz: "don't",
          dystraktory: ["doesn't", "isn't", "aren't"],
          wyjasnienie: 'Przeczenie przy "I" w tym czasie to "don\'t".', unit: 2 },
        { zdanie: "He's got a runny nose. Give ____ some tissues.", odpowiedz: 'him',
          dystraktory: ['he', 'his', "he's"],
          wyjasnienie: 'Po czasowniku "give" używamy formy "him", nie "he".', unit: 2 },
        { zdanie: 'My name is Chara and I live ____ India.', odpowiedz: 'in',
          dystraktory: ['on', 'at', 'to'],
          wyjasnienie: 'O mieszkaniu w kraju mówimy "live in": live in India.', unit: 2 },
        { zdanie: '____ they play computer games to relax?', odpowiedz: 'Do',
          dystraktory: ['Does', 'Is', 'Are'],
          wyjasnienie: 'Pytanie o "they" zaczynamy od "Do".', unit: 2 },
        { zdanie: 'We ____ friends in the zoo.', odpowiedz: 'meet',
          dystraktory: ['meets', 'meeting', 'to meet'],
          wyjasnienie: 'Przy "we" czasownik jest bez końcówki: we meet.', unit: 2 },
        { zdanie: 'It is not easy ____ drink lots of water.', odpowiedz: 'to',
          dystraktory: ['for', 'of', 'at'],
          wyjasnienie: 'Po "It is not easy" idzie bezokolicznik z "to": easy to drink.', unit: 2 },

        // unit 3 (s. 27 i 31)
        { zdanie: 'Mum, what ____ you got?', odpowiedz: 'have',
          dystraktory: ['has', 'is', 'are'],
          wyjasnienie: 'Przy "you" mówimy "have got": what have you got?', unit: 3 },
        { zdanie: 'Tom and Lucy ____ a red mouse.', odpowiedz: 'want',
          dystraktory: ['wants', 'wanting', 'to want'],
          wyjasnienie: 'Dwie osoby = liczba mnoga, czasownik bez końcówki -s.', unit: 3 },
        { zdanie: '____ smartwatch is very old.', odpowiedz: 'His',
          dystraktory: ['He', 'Him', "He's"],
          wyjasnienie: '"His" znaczy "jego" i stoi przed rzeczownikiem.', unit: 3 },
        { zdanie: 'There ____ any old gadgets in this museum.', odpowiedz: "aren't",
          dystraktory: ["isn't", 'am not', "hasn't"],
          wyjasnienie: '"gadgets" to liczba mnoga, więc "There aren\'t".', unit: 3 },
        { zdanie: 'Children can ____ films at the museum.', odpowiedz: 'watch',
          dystraktory: ['watches', 'watching', 'to watch'],
          wyjasnienie: 'Po "can" czasownik jest w formie podstawowej.', unit: 3 },
        { zdanie: 'You can walk there and ____ at the room.', odpowiedz: 'look',
          dystraktory: ['looks', 'looking', 'to look'],
          wyjasnienie: 'Po "can" oba czasowniki są w formie podstawowej: walk and look.', unit: 3 },

        // unit 4 (s. 37 i 39)
        { zdanie: 'You ____ have some juice.', odpowiedz: 'can',
          dystraktory: ['cans', 'to can', 'are'],
          wyjasnienie: '"can" nigdy nie zmienia formy i nie ma przy nim "to".', unit: 4 },
        { zdanie: 'This lunch is too big ____ you.', odpowiedz: 'for',
          dystraktory: ['to', 'at', 'of'],
          wyjasnienie: '"too big for somebody" - dla kogoś mówimy "for".', unit: 4 },
        { zdanie: 'Oh, I ____ it very much.', odpowiedz: 'like',
          dystraktory: ['likes', 'liking', 'to like'],
          wyjasnienie: 'Przy "I" czasownik jest bez końcówki -s.', unit: 4 },
        { zdanie: 'Tobias and Mia ____ meat.', odpowiedz: 'hate',
          dystraktory: ['hates', 'hating', 'to hate'],
          wyjasnienie: 'Dwie osoby = liczba mnoga, czasownik bez końcówki -s.', unit: 4 },
        { zdanie: 'Philip likes vegetables. He always ____ carrots for dinner.', odpowiedz: 'has',
          dystraktory: ['have', 'haves', 'having'],
          wyjasnienie: 'Przy "he" czasownik "have" zmienia się w "has".', unit: 4 },

        // unit 5 (s. 48 i 53)
        { zdanie: 'I want ____ be a firefighter.', odpowiedz: 'to',
          dystraktory: ['for', 'of', 'at'],
          wyjasnienie: 'Po "want" idzie bezokolicznik z "to": want to be.', unit: 5 },
        { zdanie: 'Mia is a teacher. She ____ children.', odpowiedz: 'teaches',
          dystraktory: ['teach', 'teaching', 'to teach'],
          wyjasnienie: 'Przy "she" czasownik "teach" dostaje końcówkę -es.', unit: 5 },
        { zdanie: 'Luke is a police officer. He ____ criminals.', odpowiedz: 'catches',
          dystraktory: ['catch', 'catching', 'to catch'],
          wyjasnienie: 'Przy "he" czasownik "catch" dostaje końcówkę -es.', unit: 5 },
        { zdanie: 'A shop assistant ____ food in the supermarket.', odpowiedz: 'sells',
          dystraktory: ['sell', 'selling', 'to sell'],
          wyjasnienie: 'Podmiot w 3. osobie (a shop assistant) - czasownik z końcówką -s.', unit: 5 },
        { zdanie: 'This chef ____ yummy meals.', odpowiedz: 'cooks',
          dystraktory: ['cook', 'cooking', 'to cook'],
          wyjasnienie: '"This chef" = he, więc czasownik z końcówką -s.', unit: 5 },
        { zdanie: 'He can ____ yummy salads.', odpowiedz: 'make',
          dystraktory: ['makes', 'making', 'to make'],
          wyjasnienie: 'Po "can" czasownik jest w formie podstawowej.', unit: 5 },

        // unit 6 (s. 59 i 61)
        { zdanie: 'She can ____ a shoe shop and a fish shop.', odpowiedz: 'see',
          dystraktory: ['sees', 'seeing', 'to see'],
          wyjasnienie: 'Po "can" czasownik jest w formie podstawowej: can see.', unit: 6 },
        { zdanie: "I'm from Aberdeen, but sometimes I ____ London.", odpowiedz: 'visit',
          dystraktory: ['visits', 'visiting', 'to visit'],
          wyjasnienie: 'Przy "I" czasownik jest bez końcówki -s.', unit: 6 },
        { zdanie: 'You can ____ outside and watch films there.', odpowiedz: 'stay',
          dystraktory: ['stays', 'staying', 'to stay'],
          wyjasnienie: 'Po "can" czasownik jest w formie podstawowej: can stay.', unit: 6 },

        // unit 7 (s. 69 i 71)
        { zdanie: 'I ____ got a helmet on my head.', odpowiedz: "haven't",
          dystraktory: ["hasn't", "isn't", "aren't"],
          wyjasnienie: 'Przeczenie od "I have got" to "I haven\'t got".', unit: 7 },
        { zdanie: 'In this photo, I am ____ a horse.', odpowiedz: 'riding',
          dystraktory: ['ride', 'rides', 'to ride'],
          wyjasnienie: 'Po "I am" czasownik ma końcówkę -ing: am riding.', unit: 7 },
        { zdanie: 'I am ____ and playing ice hockey with my friends.', odpowiedz: 'skating',
          dystraktory: ['skate', 'skates', 'to skate'],
          wyjasnienie: 'Po "am" oba czasowniki mają -ing: skating and playing.', unit: 7 },
        { zdanie: 'Ice hockey is very popular ____ the USA.', odpowiedz: 'in',
          dystraktory: ['on', 'at', 'of'],
          wyjasnienie: 'O kraju mówimy "in": in the USA.', unit: 7 },

        // unit 8 (s. 79 i 81)
        { zdanie: "It's Monday. I am ____ my friends in the countryside.", odpowiedz: 'meeting',
          dystraktory: ['meet', 'meets', 'to meet'],
          wyjasnienie: 'Po "I am" czasownik ma końcówkę -ing: am meeting.', unit: 8 },
        { zdanie: 'Three thin thieves ____ thinking.', odpowiedz: 'are',
          dystraktory: ['is', 'am', 'be'],
          wyjasnienie: '"Three thieves" to liczba mnoga, więc "are thinking".', unit: 8 },
        { zdanie: 'I am ____ holiday in Tatra National Park.', odpowiedz: 'on',
          dystraktory: ['in', 'at', 'to'],
          wyjasnienie: '"być na wakacjach" to "be on holiday".', unit: 8 },
        { zdanie: 'My dad is ____ on a big stone.', odpowiedz: 'standing',
          dystraktory: ['stand', 'stands', 'to stand'],
          wyjasnienie: 'Po "is" czasownik ma końcówkę -ing: is standing.', unit: 8 },
        { zdanie: "I'm not ____ shoes because I'm sitting in the sand.", odpowiedz: 'wearing',
          dystraktory: ['wear', 'wears', 'to wear'],
          wyjasnienie: 'Po "am not" czasownik ma końcówkę -ing.', unit: 8 },
        { zdanie: "I'm ____ in the sand.", odpowiedz: 'sitting',
          dystraktory: ['sit', 'sits', 'to sit'],
          wyjasnienie: 'Po "I\'m" (= I am) czasownik ma końcówkę -ing.', unit: 8 },
        { zdanie: 'Why ____ Andrea wearing summer clothes?', odpowiedz: 'is',
          dystraktory: ['are', 'am', 'does'],
          wyjasnienie: 'Andrea to jedna osoba (she), więc "is wearing".', unit: 8 },
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
