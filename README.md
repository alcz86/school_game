# Pojedynek z Potworem

Gra do ćwiczenia tabliczki mnożenia, ortografii i angielskich słówek.
Zwykła strona HTML — bez instalacji, bez internetu, bez konta.

## Jak uruchomić

Kliknij dwukrotnie `index.html`. Otworzy się w przeglądarce i to wszystko.

Działa też z telefonu (szerokość od 320 px w górę), jeśli skopiujesz cały katalog.
Kopiuj **cały katalog**, nie sam `index.html` — gra ładuje pliki z `js/` i `dane/`.

---

## Jak dopisać nowe słówka angielskie

Edytujesz **tylko** plik `dane/slowka.js`. Nic więcej nie trzeba ruszać —
nowy zestaw sam pojawi się na liście poziomów, dostanie swój wybór rozdziałów
i swój wiersz na ekranie postępów.

W pliku, mniej więcej w połowie, jest lista `ZESTAWY` i w niej komentarz:

```js
    // Kolejne zestawy dopisujemy w trakcie roku szkolnego:
    // { id: 'klasa3-unit1', nazwa: 'Klasa 3 — Unit 1', klasa: 3, slowa: [...] },
```

W to miejsce wklej gotowy blok (i zmień w nim treść):

```js
    {
      id: 'klasa3-unit1',
      nazwa: 'Klasa 3 — Unit 1',
      klasa: 3,
      slowa: [
        { pl: 'ołówek',  en: 'pencil',   unit: 1 },
        { pl: 'gumka',   en: 'rubber',   unit: 1 },
        { pl: 'linijka', en: 'ruler',    unit: 1 },
        { pl: 'plecak',  en: 'backpack', unit: 1 },
        { pl: 'zeszyt',  en: 'notebook', unit: 1 },
      ],
    },
```

Pola:

| Pole | Co to jest |
|---|---|
| `id` | techniczny klucz zestawu, bez spacji i bez znaku `\|`. Musi być unikalny. Pod tym kluczem zapisują się postępy — **nie zmieniaj go później**, bo statystyki zaczną się liczyć od zera. |
| `nazwa` | to, co widzi dziecko na przycisku wyboru poziomu. |
| `klasa` | decyduje o formie pytania: **`2` → wybór z czterech odpowiedzi**, **`3` i wyżej → wpisywanie z klawiatury**. Nowy materiał dawaj jako `klasa: 3`, powtórki starego jako `klasa: 2`. |
| `slowa` | lista słówek. `pl` — polskie (to jest pytanie), `en` — angielskie (to jest odpowiedź). |
| `unit` | numer rozdziału **z podręcznika**. Steruje ekranem „Które słówka ćwiczymy?": każdy numer dostaje przycisk „Tylko rozdział N" i „Od początku do N". `unit: 0` to materiał przekrojowy (sekcja „Hello") — wchodzi do każdego zakresu kumulacyjnego. |

Uwagi praktyczne:

- Jeden zestaw może mieć kilka rozdziałów — dopisujesz kolejne słowa z `unit: 2`,
  `unit: 3` itd. do tej samej listy `slowa`. Nowy rozdział pojawi się sam.
- Przy wpisywaniu (klasa 3+) wielkość liter i spacje na brzegach nie mają znaczenia —
  `  NOTEBOOK ` zalicza się tak samo jak `notebook`. Ale literówka w środku już nie,
  więc `en` musi być zapisane dokładnie tak, jak dziecko ma to napisać.
- Jeśli słowo ma dwa znaczenia (*rubber* = gumka czy guma?), zapisz `pl` tak,
  żeby nie było wątpliwości — dziecko widzi tylko polską stronę.
- Pilnuj przecinków i nawiasów. Jeśli po zapisaniu gra nie startuje, to prawie zawsze
  brakujący przecinek albo nawias w tym pliku. Otwórz konsolę przeglądarki
  (F12 → Console) — pokaże numer linii.

---

## Jak dopisać wyrazy ortograficzne

Edytujesz `dane/ortografia.js`. Struktura jest podobna — trzy zestawy (`o-u`, `rz-z`,
`ch-h`), a w każdym lista `wyrazy`. Jeden wpis wygląda tak:

```js
        { wyraz: 'dworzec', luka: 3, poprawny: 'rz', zasada: 'rz wymienia się na r: dworzec — dworca' },
```

**`luka` to indeks liczony od zera** — pozycja, na której zaczyna się ukrywana litera.
Litera 0 to pierwsza litera wyrazu.

**`rz` i `ch` mają długość 2** — gra wycina ze słowa tyle znaków, ile ma `poprawny`,
zaczynając od `luka`. Dlatego dla `dworzec` przy `luka: 3` znika `rz` i dziecko widzi
`dwo_ec`. Gdyby `poprawny` było `'ż'` (długość 1), przy tym samym `luka` zniknęłaby
jedna litera i wyszłoby `dwo_zec` — bez sensu.

Jak sprawdzić, że trafiłaś: policz litery od zera do miejsca, gdzie zaczyna się
`ó` / `rz` / `ch`. `d-w-o-r-z-e-c` → `d`=0, `w`=1, `o`=2, `r`=3, więc `luka: 3`.
Po dopisaniu wejdź do gry i zobacz, czy wyraz wyświetla się z jedną luką w dobrym miejscu.

**`zasada` musi być prawdziwa.** To jedyna rzecz, którą dziecko czyta po odpowiedzi —
i czyta ją także wtedy, gdy odpowie dobrze. Zasada, która nie tłumaczy tego wyrazu,
uczy zgadywania.

- Dobra zasada: `'ó wymienia się na o: mróz — mrozy'` — pokazuje wymianę, którą można
  sprawdzić na innym wyrazie.
- Zła zasada: `'bo tak się pisze'` albo `'ó wymienia się na o'` przy wyrazie `król`,
  gdzie żadnej wymiany nie ma. Przy takich wyrazach napisz wprost, że trzeba je
  zapamiętać: `'ó się tu nie wymienia — trzeba zapamiętać: król, królowa, królewski'`.

Dwie pułapki, o których warto wiedzieć:

1. **Dwa wyrazy z tym samym obrazkiem.** `morze` i `może` oba dają `mo_e` — dziecko
   nie ma jak zgadnąć, o który chodzi. **Tego pilnuje test**: `node --test` przechodzi
   cały plik i wywala się z nazwą obu kolidujących wyrazów. Nie musisz tego sprawdzać
   ręcznie — wystarczy uruchomić testy po dopisaniu.
2. **Zły wariant, który też jest polskim słowem.** `morze` z podmienionym `rz` na `ż`
   daje `może` — słowo, które dziewięciolatek zna lepiej niż wymianę „morze — morski",
   więc odpowiada rozsądnie i traci serce. Tego test nie wyłapie sam (nie ma tu
   słownika), więc po dopisaniu wyrazu wstaw w lukę **zły** wariant i sprawdź, czy
   nie wyszło ci prawdziwe słowo. Jeśli wyszło — wybierz inny wyraz na tę zasadę.

---

## Jak uruchomić testy

W terminalu, w katalogu gry:

```
node --test
```

Bez żadnych argumentów (`node --test tests/` nie działa na Node 22).

Patrz na linijkę **`# fail 0`** — to jedyna liczba, która coś znaczy. `# pass` rośnie
z każdym dopisanym testem, więc nie ma sensu porównywać go z niczym zapisanym tutaj.
Potrzebny jest tylko Node.js — żadnych `npm install`.

---

## Gdzie leżą postępy i jak je wyczyścić

Postępy siedzą w `localStorage` przeglądarki, pod kluczem `gra-szkolna-postepy`.
To znaczy: **na tym urządzeniu i w tej przeglądarce**. Nic nie jest nigdzie wysyłane,
nie ma konta ani serwera. Na drugim laptopie gra zacznie od zera — to nie błąd.

Podgląd: ikona 📊 w prawym dolnym rogu ekranu startowego.

Czyszczenie: na ekranie postępów przycisk **🗑️ Wyczyść postępy** (pyta o potwierdzenie,
nie da się cofnąć).

Postępy przepadną też same, jeśli wyczyścisz dane strony w przeglądarce
albo otworzysz grę w trybie prywatnym.

⚠️ **Otwieraj grę zawsze tak samo.** Przeglądarka trzyma postępy osobno dla każdego
adresu: dwuklik w `index.html` (adres `file://…`) i uruchomienie przez lokalny serwer
(`http://localhost:…`) to dla niej dwa różne miejsca, więc dostaniesz **dwa niezależne
komplety statystyk** — i nic na ekranie nie podpowie, dlaczego wyniki nagle „zniknęły".

---

## Mapa plików

```
index.html          szkielet strony — sześć pustych ekranów i lista skryptów
css/style.css       wygląd
dane/               TU SIĘ DOPISUJE MATERIAŁ
  matematyka.js     poziomy tabliczki (działania są generowane, nie listowane)
  ortografia.js     wyrazy z lukami + zasady
  slowka.js         zestawy słówek angielskich
js/                 LOGIKA GRY — normalnie nie ruszasz
  walka.js          serca, życie bossa, combo, powtórka błędu
  postepy.js        zapis i odczyt localStorage
  app.js            ekrany, kliknięcia, rysowanie
tests/              testy (node --test)
docs/               specyfikacja
```

Zasada podziału: **`dane/` to materiał, `js/` to mechanika.** Dopisanie nowego unitu
ze słówek albo nowych wyrazów ortograficznych nigdy nie wymaga wejścia do `js/`.
Jeśli zaczynasz edytować `js/`, żeby dodać materiał — coś poszło nie tak.

---

## Czego jeszcze nie ma

Gra jest skończona i grywalna, ale w dwóch miejscach jest skromniejsza niż
specyfikacja w `docs/`. Lepiej, żebyś wiedziała to od nas niż od syna:

- **Trzy zestawy ortograficzne zamiast pięciu.** Są `ó/u`, `rz/ż`, `ch/h`.
  Nie ma `ą/ę` ani `wielkiej litery`. Da się je dopisać bez ruszania `js/` —
  patrz „Jak dopisać wyrazy ortograficzne" wyżej.
- **Poziomy nie odblokowują się po kolei i odznaki nigdzie się nie zbierają.**
  Specyfikacja przewidywała, że pokonanie bossa otwiera następny poziom. W grze
  wszystkie poziomy są dostępne od początku, a odznaka pojawia się tylko na ekranie
  wyniku po wygranej i nie jest nigdzie zapisywana. Na ekranie postępów jej nie
  szukaj — nie ma tam takiej sekcji.

---

## Znane usterki

**Przed pierwszym użyciem kliknij raz „Wyczyść postępy" na ekranie 📊.** Sposób liczenia
skuteczności zmienił się przy ostatniej poprawce: wcześniej powtórzone pytanie (to, na które
dziecko już zobaczyło odpowiedź) liczyło się jak zwykła odpowiedź i zawyżało wynik nawet
o 15 punktów procentowych. Statystyki zapisane wcześniej są więc zawyżone i wymieszają się
z nowymi — porównanie „w zeszłym tygodniu 65%, dziś 40%" wyglądałoby jak regres syna,
a byłoby tylko zmianą metody pomiaru.

Drobiazg: w rundzie matematyki to samo działanie potrafi wypaść dwa razy. Drugie wystąpienie
jest traktowane jak powtórka, więc czasem na liście mylonych pojawi się wiersz „0 błędów
z 1 próby". Nieszkodliwe, ale wygląda dziwnie.

Usterka opisana tu wcześniej — `morze` i `może` renderowane oba jako
`mo_e` — została naprawiona: wyraz `morze` zastąpiono wyrazem `dworzec` (ta sama
wymiana `rz` → `r`, a `dwożec` nie jest żadnym słowem), a `może` nie ma w danych.

Ta klasa błędu ma teraz siatkę bezpieczeństwa: **`node --test` sam wyłapuje dwa
wyrazy renderujące się identycznie** i wskazuje oba po nazwie. Uruchom testy po
każdej zmianie w `dane/ortografia.js`.

Czego test nie sprawdzi za ciebie: czy zły wariant wstawiony w lukę nie tworzy innego
prawdziwego polskiego słowa (szczegóły w sekcji o wyrazach ortograficznych).
W obecnych danych zdarza się to raz — `nóż` z `u` daje `nuż` — i zostawiliśmy to
świadomie: `nuż` żyje właściwie tylko w potocznym „a nuż", a `nóż` jest za dobrym
przykładem wymiany `ó` → `o`, żeby go wyrzucać.
