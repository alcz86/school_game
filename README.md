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
        { wyraz: 'morze', luka: 2, poprawny: 'rz', zasada: 'rz wymienia się na r: morze — morski' },
```

**`luka` to indeks liczony od zera** — pozycja, na której zaczyna się ukrywana litera.
Litera 0 to pierwsza litera wyrazu.

**`rz` i `ch` mają długość 2** — gra wycina ze słowa tyle znaków, ile ma `poprawny`,
zaczynając od `luka`. Dlatego dla `morze` przy `luka: 2` znika `rz` i dziecko widzi
`mo_e`. Gdyby `poprawny` było `'ż'` (długość 1), przy tym samym `luka` zniknęłaby
jedna litera i wyszłoby `mo_ze` — bez sensu.

Jak sprawdzić, że trafiłaś: policz litery od zera do miejsca, gdzie zaczyna się
`ó` / `rz` / `ch`. `m-o-r-z-e` → `m`=0, `o`=1, `r`=2, więc `luka: 2`.
Po dopisaniu wejdź do gry i zobacz, czy wyraz wyświetla się z jedną luką w dobrym miejscu.

**`zasada` musi być prawdziwa.** To jedyna rzecz, którą dziecko czyta po odpowiedzi —
i czyta ją także wtedy, gdy odpowie dobrze. Zasada, która nie tłumaczy tego wyrazu,
uczy zgadywania.

- Dobra zasada: `'ó wymienia się na o: mróz — mrozy'` — pokazuje wymianę, którą można
  sprawdzić na innym wyrazie.
- Zła zasada: `'bo tak się pisze'` albo `'ó wymienia się na o'` przy wyrazie `król`,
  gdzie żadnej wymiany nie ma. Przy takich wyrazach napisz wprost, że trzeba je
  zapamiętać: `'ó się tu nie wymienia — trzeba zapamiętać: król, królowa, królewski'`.

Uważaj też, żeby dwa różne wyrazy nie dawały tego samego obrazka z luką —
np. `morze` i `może` oba dają `mo_e` i wtedy nie da się odpowiedzieć poprawnie
(patrz „Znane usterki" niżej).

---

## Jak uruchomić testy

W terminalu, w katalogu gry:

```
node --test
```

Bez żadnych argumentów. Powinno wypisać `# pass 94` i `# fail 0`.
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

## Znane usterki

- **`morze` i `może` dają ten sam obrazek `mo_e`** (zestaw `rz czy ż` w
  `dane/ortografia.js`). Dziecko nie ma jak odgadnąć, o który wyraz chodzi, więc
  w połowie przypadków traci serce bez własnej winy. Do naprawy: usunąć jeden z tych
  wyrazów albo dodać do pytania kontekst.
