(function () {
  // Zestaw powtórkowy przepisany ze słowniczka obrazkowego (Picture dictionary,
  // s. 91-95) podręcznika z klasy 2. Lista zatwierdzona przez Aleksandrę 2026-08-24.
  //
  // Pole `unit` to numer rozdziału Z PODRĘCZNIKA — dziecko szukające "Unit 3"
  // ma dostać Unit 3 z książki. `unit: 0` oznacza sekcję "Hello": materiał
  // przekrojowy spoza rozdziałów (liczby 1-20, przyimki, meble klasowe).
  // W zakresie kumulacyjnym `{ do: N }` unit 0 liczy się jako materiał
  // wcześniejszy niż rozdział 1, więc `{ do: 3 }` obejmuje unity 0, 1, 2 i 3.
  const ZESTAWY = [
    {
      id: 'klasa2-powtorka',
      nazwa: 'Klasa 2 — powtórka',
      klasa: 2,
      slowa: [
        // unit 0 — "Hello" (s. 91): liczby, przyimki, meble
        { pl: 'jeden', en: 'one', unit: 0 },
        { pl: 'dwa', en: 'two', unit: 0 },
        { pl: 'trzy', en: 'three', unit: 0 },
        { pl: 'cztery', en: 'four', unit: 0 },
        { pl: 'pięć', en: 'five', unit: 0 },
        { pl: 'sześć', en: 'six', unit: 0 },
        { pl: 'siedem', en: 'seven', unit: 0 },
        { pl: 'osiem', en: 'eight', unit: 0 },
        { pl: 'dziewięć', en: 'nine', unit: 0 },
        { pl: 'dziesięć', en: 'ten', unit: 0 },
        { pl: 'jedenaście', en: 'eleven', unit: 0 },
        { pl: 'dwanaście', en: 'twelve', unit: 0 },
        { pl: 'trzynaście', en: 'thirteen', unit: 0 },
        { pl: 'czternaście', en: 'fourteen', unit: 0 },
        { pl: 'piętnaście', en: 'fifteen', unit: 0 },
        { pl: 'szesnaście', en: 'sixteen', unit: 0 },
        { pl: 'siedemnaście', en: 'seventeen', unit: 0 },
        { pl: 'osiemnaście', en: 'eighteen', unit: 0 },
        { pl: 'dziewiętnaście', en: 'nineteen', unit: 0 },
        { pl: 'dwadzieścia', en: 'twenty', unit: 0 },
        { pl: 'w (w środku)', en: 'in', unit: 0 },
        { pl: 'na', en: 'on', unit: 0 },
        { pl: 'pod', en: 'under', unit: 0 },
        { pl: 'za', en: 'behind', unit: 0 },
        { pl: 'pudełko', en: 'box', unit: 0 },
        { pl: 'biurko', en: 'desk', unit: 0 },
        { pl: 'krzesło', en: 'chair', unit: 0 },
        { pl: 'drzwi', en: 'door', unit: 0 },

        // unit 1 — dom (s. 92)
        { pl: 'dom', en: 'house', unit: 1 },
        { pl: 'sypialnia', en: 'bedroom', unit: 1 },
        { pl: 'łazienka', en: 'bathroom', unit: 1 },
        { pl: 'kuchnia', en: 'kitchen', unit: 1 },
        { pl: 'jadalnia', en: 'dining room', unit: 1 },
        { pl: 'salon', en: 'living room', unit: 1 },
        { pl: 'strych', en: 'attic', unit: 1 },
        { pl: 'garaż', en: 'garage', unit: 1 },
        { pl: 'łóżko', en: 'bed', unit: 1 },
        { pl: 'wanna', en: 'bath', unit: 1 },
        { pl: 'lodówka', en: 'fridge', unit: 1 },
        { pl: 'stół', en: 'table', unit: 1 },
        { pl: 'skrzynia', en: 'chest', unit: 1 },
        { pl: 'motor', en: 'motorbike', unit: 1 },

        // unit 2 — miasto i zajęcia (s. 92)
        { pl: 'szkoła', en: 'school', unit: 2 },
        { pl: 'kino', en: 'cinema', unit: 2 },
        { pl: 'muzeum', en: 'museum', unit: 2 },
        { pl: 'park', en: 'park', unit: 2 },
        { pl: 'basen', en: 'swimming pool', unit: 2 },
        { pl: 'supermarket', en: 'supermarket', unit: 2 },
        { pl: 'sklep z zabawkami', en: 'toy shop', unit: 2 },
        { pl: 'zoo', en: 'zoo', unit: 2 },
        { pl: 'uczyć się angielskiego', en: 'learn English', unit: 2 },
        { pl: 'oglądać zwierzęta', en: 'watch animals', unit: 2 },
        { pl: 'oglądać obrazy', en: 'look at paintings', unit: 2 },
        { pl: 'wyprowadzać psa', en: 'walk the dog', unit: 2 },
        { pl: 'chodzić na basen', en: 'go swimming', unit: 2 },
        { pl: 'chodzić na zakupy', en: 'go shopping', unit: 2 },

        // unit 3 — szkoła (s. 93)
        { pl: 'klasa', en: 'classroom', unit: 3 },
        { pl: 'sala gimnastyczna', en: 'gym', unit: 3 },
        { pl: 'biblioteka', en: 'library', unit: 3 },
        { pl: 'stołówka', en: 'canteen', unit: 3 },
        { pl: 'sala komputerowa', en: 'computer room', unit: 3 },
        { pl: 'korytarz', en: 'corridor', unit: 3 },
        { pl: 'plac zabaw', en: 'playground', unit: 3 },
        { pl: 'toaleta', en: 'toilet', unit: 3 },
        { pl: 'ćwiczyć', en: 'exercise', unit: 3 },
        { pl: 'czytać książki', en: 'read books', unit: 3 },
        { pl: 'jeść obiad', en: 'have lunch', unit: 3 },
        { pl: 'grać w gry komputerowe', en: 'play computer games', unit: 3 },
        { pl: 'mieć przerwę', en: 'have a break', unit: 3 },
        { pl: 'grać w chowanego', en: 'play hide and seek', unit: 3 },

        // unit 4 — czas wolny i dni tygodnia (s. 93)
        { pl: 'spotykać się z kolegami', en: 'meet friends', unit: 4 },
        { pl: 'śpiewać piosenki', en: 'sing songs', unit: 4 },
        { pl: 'malować obrazki', en: 'paint pictures', unit: 4 },
        { pl: 'grać na gitarze', en: 'play the guitar', unit: 4 },
        { pl: 'oglądać filmy', en: 'watch films', unit: 4 },
        { pl: 'trenować karate', en: 'do karate', unit: 4 },
        { pl: 'grać w piłkę nożną', en: 'play football', unit: 4 },
        { pl: 'słuchać muzyki', en: 'listen to music', unit: 4 },
        { pl: 'poniedziałek', en: 'Monday', unit: 4 },
        { pl: 'wtorek', en: 'Tuesday', unit: 4 },
        { pl: 'środa', en: 'Wednesday', unit: 4 },
        { pl: 'czwartek', en: 'Thursday', unit: 4 },
        { pl: 'piątek', en: 'Friday', unit: 4 },
        { pl: 'sobota', en: 'Saturday', unit: 4 },
        { pl: 'niedziela', en: 'Sunday', unit: 4 },

        // unit 5 — jedzenie (s. 94)
        { pl: 'ser', en: 'cheese', unit: 5 },
        { pl: 'szynka', en: 'ham', unit: 5 },
        { pl: 'sos pomidorowy', en: 'tomato sauce', unit: 5 },
        { pl: 'tuńczyk', en: 'tuna', unit: 5 },
        { pl: 'makaron', en: 'pasta', unit: 5 },
        { pl: 'sałatka owocowa', en: 'fruit salad', unit: 5 },
        { pl: 'szpinak', en: 'spinach', unit: 5 },
        { pl: 'łosoś', en: 'salmon', unit: 5 },
        { pl: 'nabiał', en: 'dairy', unit: 5 },
        { pl: 'mięso', en: 'meat', unit: 5 },
        { pl: 'ryby', en: 'fish', unit: 5 },
        { pl: 'produkty zbożowe', en: 'cereal', unit: 5 },
        { pl: 'owoce', en: 'fruit', unit: 5 },
        { pl: 'warzywa', en: 'vegetables', unit: 5 },

        // unit 6 — ubrania i pogoda (s. 94)
        { pl: 'piżama', en: 'pyjamas', unit: 6 },
        { pl: 'bluza z kapturem', en: 'hoodie', unit: 6 },
        { pl: 'sweter', en: 'jumper', unit: 6 },
        { pl: 'kurtka zimowa', en: 'coat', unit: 6 },
        { pl: 'rękawiczki', en: 'gloves', unit: 6 },
        { pl: 'nauszniki', en: 'earmuffs', unit: 6 },
        { pl: 'szalik', en: 'scarf', unit: 6 },
        { pl: 'buty zimowe', en: 'boots', unit: 6 },
        { pl: 'słonecznie', en: 'sunny', unit: 6 },
        { pl: 'deszczowo', en: 'rainy', unit: 6 },
        { pl: 'burzowo', en: 'stormy', unit: 6 },
        { pl: 'śnieżnie', en: 'snowy', unit: 6 },
        { pl: 'ciepło', en: 'warm', unit: 6 },
        { pl: 'chłodno', en: 'cool', unit: 6 },

        // unit 7 — zoo i czynności zwierząt (s. 95)
        { pl: 'tygrysy', en: 'tigers', unit: 7 },
        { pl: 'węże', en: 'snakes', unit: 7 },
        { pl: 'nosorożce', en: 'rhinos', unit: 7 },
        { pl: 'papugi', en: 'parrots', unit: 7 },
        { pl: 'krokodyle', en: 'crocodiles', unit: 7 },
        { pl: 'pingwiny', en: 'penguins', unit: 7 },
        { pl: 'nietoperze', en: 'bats', unit: 7 },
        { pl: 'żyrafy', en: 'giraffes', unit: 7 },
        { pl: 'tupać', en: 'stamp', unit: 7 },
        { pl: 'chodzić kaczym krokiem', en: 'waddle', unit: 7 },
        { pl: 'pełzać', en: 'slide', unit: 7 },
        { pl: 'mówić', en: 'talk', unit: 7 },
        { pl: 'gryźć', en: 'bite', unit: 7 },
        { pl: 'jeść', en: 'eat', unit: 7 },

        // unit 8 — biwak (s. 95)
        { pl: 'namiot', en: 'tent', unit: 8 },
        { pl: 'śpiwór', en: 'sleeping bag', unit: 8 },
        { pl: 'aparat', en: 'camera', unit: 8 },
        { pl: 'kiełbaski', en: 'sausages', unit: 8 },
        { pl: 'ognisko', en: 'campfire', unit: 8 },
        { pl: 'frisbee', en: 'frisbee', unit: 8 },
        { pl: 'domek na drzewie', en: 'treehouse', unit: 8 },
        { pl: 'latarka', en: 'torch', unit: 8 },
        { pl: 'rozbić namiot', en: 'put up a tent', unit: 8 },
        { pl: 'spać w śpiworze', en: 'sleep in a sleeping bag', unit: 8 },
        { pl: 'robić zdjęcia', en: 'take pictures', unit: 8 },
        { pl: 'zbudować domek na drzewie', en: 'build a treehouse', unit: 8 },
        { pl: 'rozpalić ognisko', en: 'make a campfire', unit: 8 },
        { pl: 'grać w frisbee', en: 'play frisbee', unit: 8 },
      ],
    },
    // Klasa 3 — materiał ze słowniczka obrazkowego (Picture dictionary, s. 92-95),
    // unity 1-8, po 14 pozycji. Lista zatwierdzona przez matkę 2026-09-06
    // (docs/slowka-klasa3-do-zatwierdzenia.md).
    //
    // ŚWIADOME DECYZJE — NIE COFAJ ICH BEZ PYTANIA:
    // 1. Unit 0 ("Hello", s. 3-4) POMINIĘTY W CAŁOŚCI — 18 z 23 pozycji to dokładna
    //    powtórka z `klasa2-powtorka`. Przy okazji znika jedyna realna kolizja
    //    polskich haseł: `take photos` (kl. 3) vs `take pictures` (kl. 8 z kl. 2),
    //    oba "robić zdjęcia" — w trybie wpisywania dziecko odpowiadałoby dobrze
    //    i traciło serce.
    // 2. `tea` = "podwieczorek", NIE "herbata" — na obrazku brytyjskie afternoon tea
    //    (patera z ciastkami), czyli posiłek, nie napój.
    // 3. `dinner` = "kolacja", NIE "obiad" — żeby nie mylił się z `have lunch`
    //    = "jeść obiad" z klasy 2.
    //
    // Cały materiał unitowy jest JEDNYM zestawem, nie ośmioma. Zakres kumulacyjny
    // `{ do: N }` działa tylko w obrębie jednego zestawu — osiem osobnych zestawów
    // zabiłoby powtórkę narastającą.
    {
      id: 'klasa3',
      nazwa: 'Klasa 3',
      klasa: 3,
      slowa: [
        // unit 1 — Look at me! (wygląd i uczucia, s. 92)
        { pl: 'elegancki', en: 'elegant', unit: 1 },
        { pl: 'niechlujny', en: 'messy', unit: 1 },
        { pl: 'młody', en: 'young', unit: 1 },
        { pl: 'starszy', en: 'elderly', unit: 1 },
        { pl: 'wysoki', en: 'tall', unit: 1 },
        { pl: 'niski', en: 'short', unit: 1 },
        { pl: 'szczupły', en: 'thin', unit: 1 },
        { pl: 'pulchny', en: 'plump', unit: 1 },
        { pl: 'podekscytowany', en: 'excited', unit: 1 },
        { pl: 'znudzony', en: 'bored', unit: 1 },
        { pl: 'odważny', en: 'brave', unit: 1 },
        { pl: 'przestraszony', en: 'scared', unit: 1 },
        { pl: 'spokojny', en: 'calm', unit: 1 },
        { pl: 'zły', en: 'angry', unit: 1 },

        // unit 2 — zdrowie: dolegliwości i leki (s. 92)
        { pl: 'katar', en: 'runny nose', unit: 2 },
        { pl: 'kaszel', en: 'cough', unit: 2 },
        { pl: 'ból głowy', en: 'headache', unit: 2 },
        { pl: 'ból zęba', en: 'toothache', unit: 2 },
        { pl: 'zadrapanie', en: 'scratch', unit: 2 },
        { pl: 'skaleczenie', en: 'cut', unit: 2 },
        { pl: 'ból brzucha', en: 'stomach ache', unit: 2 },
        { pl: 'gorączka', en: 'fever', unit: 2 },
        { pl: 'chusteczki', en: 'tissues', unit: 2 },
        { pl: 'plaster', en: 'sticking plaster', unit: 2 },
        { pl: 'bandaż', en: 'bandage', unit: 2 },
        { pl: 'syrop', en: 'syrup', unit: 2 },
        { pl: 'termometr', en: 'thermometer', unit: 2 },
        { pl: 'tabletki', en: 'pills', unit: 2 },

        // unit 3 — technologia i przymiotniki (s. 93)
        { pl: 'smartfon', en: 'smartphone', unit: 3 },
        { pl: 'tablet', en: 'tablet', unit: 3 },
        { pl: 'mikrofon', en: 'microphone', unit: 3 },
        { pl: 'konsola do gier', en: 'game console', unit: 3 },
        { pl: 'laptop', en: 'laptop', unit: 3 },
        { pl: 'smartwatch', en: 'smartwatch', unit: 3 },
        { pl: 'myszka', en: 'mouse', unit: 3 },
        { pl: 'klawiatura', en: 'keyboard', unit: 3 },
        { pl: 'tani', en: 'cheap', unit: 3 },
        { pl: 'drogi', en: 'expensive', unit: 3 },
        { pl: 'błyszczący', en: 'shiny', unit: 3 },
        { pl: 'matowy', en: 'matt', unit: 3 },
        { pl: 'ciężki', en: 'heavy', unit: 3 },
        { pl: 'lekki', en: 'light', unit: 3 },

        // unit 4 — jedzenie i posiłki (s. 93)
        { pl: 'ryż', en: 'rice', unit: 4 },
        { pl: 'marchewki', en: 'carrots', unit: 4 },
        { pl: 'jajka', en: 'eggs', unit: 4 },
        { pl: 'jabłka', en: 'apples', unit: 4 },
        { pl: 'ziemniaki', en: 'potatoes', unit: 4 },
        { pl: 'kurczak', en: 'chicken', unit: 4 },
        { pl: 'krewetki', en: 'shrimps', unit: 4 },
        { pl: 'mleko', en: 'milk', unit: 4 },
        { pl: 'przekąska', en: 'snack', unit: 4 },
        { pl: 'podwieczorek', en: 'tea', unit: 4 },
        { pl: 'kolacja', en: 'dinner', unit: 4 },
        { pl: 'zawsze', en: 'always', unit: 4 },
        { pl: 'czasami', en: 'sometimes', unit: 4 },
        { pl: 'nigdy', en: 'never', unit: 4 },

        // unit 5 — zawody i czynności zawodowe (s. 94)
        { pl: 'budowlaniec', en: 'builder', unit: 5 },
        { pl: 'sprzedawca', en: 'shop assistant', unit: 5 },
        { pl: 'strażak', en: 'firefighter', unit: 5 },
        { pl: 'artysta', en: 'artist', unit: 5 },
        { pl: 'budować domy', en: 'build houses', unit: 5 },
        { pl: 'sprzedawać jedzenie', en: 'sell food', unit: 5 },
        { pl: 'pomagać ludziom', en: 'help people', unit: 5 },
        { pl: 'robić rzeźby', en: 'make sculptures', unit: 5 },
        { pl: 'kucharz', en: 'chef', unit: 5 },
        { pl: 'nauczyciel', en: 'teacher', unit: 5 },
        { pl: 'policjant', en: 'police officer', unit: 5 },
        { pl: 'gotować posiłki', en: 'cook meals', unit: 5 },
        { pl: 'uczyć dzieci', en: 'teach children', unit: 5 },
        { pl: 'łapać przestępców', en: 'catch criminals', unit: 5 },

        // unit 6 — miasto, sklepy, przyimki miejsca (s. 94)
        { pl: 'poczta', en: 'post office', unit: 6 },
        { pl: 'remiza strażacka', en: 'fire station', unit: 6 },
        { pl: 'restauracja', en: 'restaurant', unit: 6 },
        { pl: 'komisariat policji', en: 'police station', unit: 6 },
        { pl: 'piekarnia', en: 'bakery', unit: 6 },
        { pl: 'teatr', en: 'theatre', unit: 6 },
        { pl: 'dworzec autobusowy', en: 'bus station', unit: 6 },
        { pl: 'warzywniak', en: "greengrocer's", unit: 6 },
        { pl: 'ulica', en: 'street', unit: 6 },
        { pl: 'przejście dla pieszych', en: 'zebra crossing', unit: 6 },
        { pl: 'światła', en: 'traffic lights', unit: 6 },
        { pl: 'obok', en: 'next to', unit: 6 },
        { pl: 'pomiędzy', en: 'between', unit: 6 },
        { pl: 'naprzeciwko', en: 'opposite', unit: 6 },

        // unit 7 — sport i sprzęt sportowy (s. 95)
        { pl: 'uprawiać gimnastykę', en: 'do gymnastics', unit: 7 },
        { pl: 'grać w koszykówkę', en: 'play basketball', unit: 7 },
        { pl: 'jeździć na łyżwach', en: 'skate', unit: 7 },
        { pl: 'jeździć na nartach', en: 'ski', unit: 7 },
        { pl: 'jeździć na rowerze', en: 'cycle', unit: 7 },
        { pl: 'grać w siatkówkę', en: 'play volleyball', unit: 7 },
        { pl: 'grać w tenisa', en: 'play tennis', unit: 7 },
        { pl: 'jeździć konno', en: 'ride a horse', unit: 7 },
        { pl: 'łyżwy', en: 'ice skates', unit: 7 },
        { pl: 'narty', en: 'skis', unit: 7 },
        { pl: 'gogle', en: 'goggles', unit: 7 },
        { pl: 'wstążka gimnastyczna', en: 'ribbon', unit: 7 },
        { pl: 'rakieta', en: 'racket', unit: 7 },
        { pl: 'kask', en: 'helmet', unit: 7 },

        // unit 8 — przyroda i wypoczynek (s. 95)
        { pl: 'wzgórza', en: 'hills', unit: 8 },
        { pl: 'strumień', en: 'stream', unit: 8 },
        { pl: 'staw', en: 'pond', unit: 8 },
        { pl: 'morze', en: 'sea', unit: 8 },
        { pl: 'wędrować', en: 'hike', unit: 8 },
        { pl: 'pływać kajakiem', en: 'kayak', unit: 8 },
        { pl: 'łowić ryby', en: 'fish', unit: 8 },
        { pl: 'nurkować', en: 'dive', unit: 8 },
        { pl: 'łąka', en: 'meadow', unit: 8 },
        { pl: 'zbierać grzyby', en: 'pick mushrooms', unit: 8 },
        { pl: 'wieś', en: 'countryside', unit: 8 },
        { pl: 'urządzić piknik', en: 'have a picnic', unit: 8 },
        { pl: 'plaża', en: 'beach', unit: 8 },
        { pl: 'zbierać kamyki', en: 'collect pebbles', unit: 8 },
      ],
    },
    // Sekcje sezonowe z podręcznika klasy 3 (Christmas s. 85, Maths Day s. 87,
    // Saint Patrick's Day s. 89). OSOBNY zestaw celowo: nie należą do progresji
    // rozdziałów, więc nie mogą wpadać do rundy "od początku do rozdziału 5".
    // Numery `unit` są nasze, po jednym na okazję — książka ich nie nadaje.
    {
      id: 'klasa3-swieta',
      nazwa: 'Klasa 3 — święta i okazje',
      klasa: 3,
      slowa: [
        // unit 1 — Christmas (s. 85)
        { pl: 'upiec świąteczne ciasto', en: 'bake a Christmas cake', unit: 1 },
        { pl: 'robić ozdoby', en: 'make ornaments', unit: 1 },
        { pl: 'pakować prezenty', en: 'wrap presents', unit: 1 },
        { pl: 'wieszać skarpety świąteczne', en: 'hang stockings', unit: 1 },
        { pl: 'wysyłać kartki świąteczne', en: 'send Christmas cards', unit: 1 },
        { pl: 'śpiewać kolędy', en: 'sing carols', unit: 1 },

        // unit 2 — Maths Day (s. 87): liczby 30-100
        { pl: 'trzydzieści', en: 'thirty', unit: 2 },
        { pl: 'czterdzieści', en: 'forty', unit: 2 },
        { pl: 'pięćdziesiąt', en: 'fifty', unit: 2 },
        { pl: 'sześćdziesiąt', en: 'sixty', unit: 2 },
        { pl: 'siedemdziesiąt', en: 'seventy', unit: 2 },
        { pl: 'osiemdziesiąt', en: 'eighty', unit: 2 },
        { pl: 'dziewięćdziesiąt', en: 'ninety', unit: 2 },
        { pl: 'sto', en: 'one hundred', unit: 2 },
        { pl: 'dwadzieścia dwa', en: 'twenty-two', unit: 2 },
        { pl: 'pięćdziesiąt osiem', en: 'fifty-eight', unit: 2 },

        // unit 3 — Saint Patrick's Day (s. 89)
        { pl: 'irlandzka flaga', en: 'Irish flag', unit: 3 },
        { pl: 'parada', en: 'parade', unit: 3 },
        { pl: 'peklowana wołowina z kapustą', en: 'corned beef and cabbage', unit: 3 },
        { pl: 'leprechaun (irlandzki skrzat)', en: 'Leprechaun', unit: 3 },
        { pl: 'koniczynka', en: 'shamrock', unit: 3 },
        { pl: 'garniec złota', en: 'pot of gold', unit: 3 },
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
    return Array.from(new Set(zestaw.slowa.map((w) => w.unit))).sort((a, b) => a - b);
  }

  // Numer rozdziału podany z zewnątrz — albo liczba, albo null gdy to nie jest numer.
  //
  // KOERCJA JEST TU POTRZEBNA, NIE UPRASZCZAJ JEJ. Ekran wyboru rozdziału czyta
  // wartość z DOM, a `<select>.value` i `dataset.*` są w HTML ZAWSZE stringami.
  // Bez `Number()` zakres `{ do: '3' }` przeleciałby przez `Number.isInteger`
  // jako "brak zakresu" i gra po cichu dałaby dziecku cały materiał zamiast
  // rozdziałów 0-3 — bez błędu, bez sygnału, że wybór został zignorowany.
  //
  // Uwaga na pułapkę: `Number(null)`, `Number('')` i `Number(false)` dają 0,
  // a 0 to u nas PRAWIDŁOWY rozdział (sekcja "Hello"). Dlatego typ jest
  // sprawdzany PRZED koercją — inaczej `{ tylko: null }` udawałoby `{ tylko: 0 }`.
  function numerRozdzialu(wartosc) {
    if (typeof wartosc === 'number') return Number.isInteger(wartosc) ? wartosc : null;
    if (typeof wartosc === 'string' && wartosc.trim() !== '') {
      const n = Number(wartosc);
      return Number.isInteger(n) ? n : null;
    }
    return null;
  }

  // `zakres`: { tylko: N } — sam rozdział N; { do: N } — kumulacyjnie wszystko do N
  // włącznie (a więc także unit 0); null / brak / wartość nieliczbowa — cały zestaw.
  // Świadomie BEZ dolnego odcięcia na 1 — materiał przekrojowy (unit 0) ma wchodzić
  // w każdy zakres kumulacyjny.
  function wZakresie(slowa, zakres) {
    if (!zakres) return slowa.slice();
    const tylko = numerRozdzialu(zakres.tylko);
    if (tylko !== null) return slowa.filter((w) => w.unit === tylko);
    const doN = numerRozdzialu(zakres.do);
    if (doN !== null) return slowa.filter((w) => w.unit <= doN);
    return slowa.slice();
  }

  function wylosujWazone(pozycje) {
    const suma = pozycje.reduce((s, p) => s + p.waga, 0);
    let los = Math.random() * suma;
    for (const p of pozycje) {
      los -= p.waga;
      if (los < 0) return p.slowo;
    }
    return pozycje[pozycje.length - 1].slowo;
  }

  function zbudujPytanie(idZestawu, tryb, material, w) {
    let warianty = null;
    if (tryb === 'wybor') {
      // Gdy zakres ma mniej niż 4 słowa, zwracamy tyle wariantów, ile się da.
      // Poprawna odpowiedź jest wśród nich zawsze. Brak pętli while — przy
      // ubogim zakresie zapętliłaby się i zawiesiła grę.
      const inne = przetasuj(material.filter((x) => x.en.toLowerCase() !== w.en.toLowerCase()));
      warianty = przetasuj([w.en].concat(inne.slice(0, 3).map((x) => x.en)));
    }
    return {
      id: idZestawu + ':' + w.en,
      tresc: w.pl,
      odpowiedz: w.en,
      wyjasnienie: w.pl + ' — ' + w.en,
      warianty,
    };
  }

  function generuj(idZestawu, ile, tryb, wagi, zakres) {
    const zestaw = ZESTAWY.find((z) => z.id === idZestawu);
    if (!zestaw) return [];

    // Materiał to jedyne źródło zarówno pytań, JAK I dystraktorów. Dystraktor
    // spoza zakresu pozwalałby dziecku odgadywać przez eliminację słowa, którego
    // jeszcze nie zna — czyli zgadywać zamiast wiedzieć.
    const material = wZakresie(zestaw.slowa, zakres);
    if (!material.length) return [];

    const pula = przetasuj(material.slice());

    // Pula wcześniej mylonych — TYLKO z bieżącego zakresu (spec: słówko z rozdziału 8
    // nie może wpaść do rundy "tylko rozdział 3" tylko dlatego, że jest często mylone).
    const pulaMylonych = [];
    if (wagi) {
      for (const w of material) {
        const waga = wagi[idZestawu + ':' + w.en];
        if (waga > 0) pulaMylonych.push({ waga, slowo: w });
      }
    }

    const pytania = [];
    for (let i = 0; i < ile; i++) {
      // co trzecie pytanie ciągniemy z puli wcześniej mylonych (ważone wg liczby błędów), jeśli jakaś jest
      const w = (pulaMylonych.length && i % 3 === 1) ? wylosujWazone(pulaMylonych) : pula[i % pula.length];
      pytania.push(zbudujPytanie(idZestawu, tryb, material, w));
    }
    return pytania;
  }

  const api = { ZESTAWY, rozdzialy, generuj };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.slowka = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
