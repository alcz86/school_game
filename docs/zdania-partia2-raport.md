# Zdania z luką — partia 2 i poprawki po recenzji

Data: 2026-09-08. Punkt wyjścia: `4729ab5`, 148 testów zielonych.
Zakres: P1–P7 z recenzji commita `544fba7`.

---

## Summary & Actions

| Co | Wynik |
|---|---|
| Zdań w zestawie `zdania-klasa3` | **89** (było 46) |
| Odrzuconych przy własnej weryfikacji partii 2 | **0 z 45** |
| Testy | **172 zielone** (było 148; +24) |
| Weryfikacja mutacyjna testu zgodności | **8 / 8 mutacji złapanych** |
| Weryfikacja w przeglądarce | pełna, konsola czysta |

Arytmetyka zestawu, policzona i sprawdzona:

```
partia 1:  46 przepisanych − 2 (P3, Phonics Fun bez orzeczenia)   = 44
partia 2:  46 przepisanych − 1 („toothache", decyzja matki)        = 45
                                                            razem   89
```

Rozkład po unitach po zmianie: 1 → 9, 2 → 11, 3 → 12, 4 → 10, 5 → 11, 6 → 7, 7 → 12, 8 → 17.
Unit 1 stracił dwie pozycje z P3 i dostał sześć z partii 2, więc urósł z 5 do 9 — najsłabszy
rozdział zestawu przestał być najsłabszy.

**Do decyzji matki:** nic. Wszystkie decyzje z briefu zostały wykonane bez odstępstw.

---

## P1 — polskie znaki w wyjaśnieniach

Poprawiono **wszystkie 89 wyjaśnień** (46 z partii 1 + 45 z partii 2 przy wpisywaniu ich
do gry, minus pominięte). Zmieniony jest wyłącznie zapis — żadna reguła gramatyczna,
przykład ani sformułowanie nie zostały zmienione merytorycznie.

Typowe poprawki: `uzywamy → używamy`, `wiec → więc` (14 wystąpień), `mowimy → mówimy`,
`koncowke → końcówkę`, `lezy → leży`, `Spedzam sobote z rodzina → Spędzam sobotę z rodziną`,
`z kims → z kimś`, `zadne → żadne`, `goly → goły`, `moge → mogę`, `z tata → z tatą`,
`gorach → górach`, `sie → się`, `sa → są`, `maja → mają`, `byc → być`.

Test blokujący: `tests/zdania-polskie-znaki.test.js`.

**Dlaczego test wygląda tak, a nie inaczej** (jest to opisane też w komentarzu w pliku):

- *Odrzucone:* „zabroń znaków spoza ASCII i polskich" — nic nie daje, bo okaleczone słowo
  („wiec") składa się z samych liter ASCII.
- *Odrzucone:* „wymagaj diakrytyku w każdym wyjaśnieniu" — fałszywe alarmy. „Dwie osoby =
  have got." jest poprawną polszczyzną bez ani jednego ogonka, a test kazałby psuć poprawny tekst.
- *Wybrane:* **jawna lista 27 konkretnych okaleczeń**, dobrana z tego, co faktycznie było
  w tym pliku. Lista jest dosłowna i wąska — nie zgaduje polskiej morfologii, więc nie generuje
  fałszywych alarmów, a łapie dokładnie ten nawyk pisania bez ogonków. Rozszerza się ją przy
  nowym okaleczeniu, zamiast robić z niej heurystykę.
- Świadomie **nie** wpisano na listę słów-pułapek: `czasownik`, `rzeczownik`, `osoba`,
  `liczba`, `mnoga` — to poprawne formy bez diakrytyków i wpisanie ich zamieniłoby test
  w generator fałszywych alarmów.
- Dwa strażniki samego testu: jeden sprawdza, że każdy wzorzec faktycznie trafia i **nie**
  łapie poprawnej formy tego samego słowa; drugi, że w danych nadal jest ≥ 60 wyjaśnień
  z polskimi znakami — inaczej „naprawa kodowania" przez zesłanie do ASCII przeszłaby
  niezauważona dla słów spoza listy.

---

## P2 — test wiążący dane z zatwierdzonym dokumentem

`tests/zdania-zgodnosc-z-dokumentem.test.js` parsuje **oba** dokumenty źródłowe
i porównuje z `dane/zdania.js` pole po polu: `zdanie`, `odpowiedz`, komplet `dystraktory`,
`wyjasnienie`, `unit`. Komunikat błędu wskazuje konkretne zdanie, plik, **numer linii**
i które pole się rozjechało, np.:

```
pole "unit" rozjechało się z dokumentem w "Ice hockey is very popular ____ the USA."
(zdania-klasa3-partia2-do-zatwierdzenia.md:381): w grze 3, w dokumencie 7
```

Decyzje projektowe:

- **Wyjaśnienia porównywane DOSŁOWNIE, nie „po treści".** Brief dopuszczał obie drogi.
  Wybrano poprawienie diakrytyków także w dokumentach (64 linie `wyjasnienie:` zsynchronizowane
  skryptowo z danymi), bo daje to jedno źródło prawdy i łapie także literówkę, której luźne
  dopasowanie „po treści" by nie zauważyło. Dokumenty nie były przepisywane ręcznie — zmieniona
  jest wyłącznie linia `wyjasnienie:`, reszta bloków (w tym kolumna `sprawdzenie`) nietknięta.
- **Dystraktory porównywane jako zbiór, nie lista** — kolejność w grze i tak jest tasowana
  przy budowie pytania, więc wiążący jest skład.
- **Kierunek odwrotny też jest testowany**: żadne zdanie w grze nie może być spoza dokumentów.
  Bez tego dałoby się dopisać do gry materiał, którego matka nigdy nie widziała.
- **Jawna lista `SWIADOMIE_POMINIETE`** (3 pozycje, każda z powodem) to jedyne dopuszczalne
  rozjechanie dokumentu z danymi. Osobny test pilnuje, że te pozycje faktycznie w grze nie są.
- **Strażnik samego testu**: gdyby format bloku w dokumencie się zmienił, parser wyciągnąłby
  0 pozycji i cały plik świeciłby na zielono, nie sprawdzając niczego. Test wymaga ≥ 90 sparsowanych
  bloków i kompletu pól w każdym.

### Weryfikacja mutacyjna — na kopii, nie przez `git checkout`

Projekt skopiowano przez `rsync` do katalogu tymczasowego; mutacje wykonywano wyłącznie na kopii,
plik przywracany z pamięci po każdej próbie. **W repozytorium roboczym nie wykonano żadnej
operacji przywracającej** — historia tego projektu zna już utratę pracy tą drogą.

| # | Mutacja | Wynik |
|---|---|---|
| 1 | podmiana treści zdania (`black` → `blue`) | ZŁAPANA (testy 148, 149) |
| 2 | poprawna odpowiedź zmieniona na niebędącą dystraktorem (`is` → `was`) | ZŁAPANA (151) |
| 3 | dystraktor zamieniony w drugą poprawną odpowiedź (`to sit` → `sitting`) | ZŁAPANA (151, 159, 161) |
| 4 | nieprawdziwa reguła w wyjaśnieniu (`we are` → `we is`) | ZŁAPANA (151) |
| 5 | przenumerowanie unitu (7 → 3) | ZŁAPANA (151) |
| 6 | ciche dopisanie zdania spoza dokumentu | ZŁAPANA (149, 152, 153) |
| 7 | powrót okaleczonej polszczyzny (`więc` → `wiec`) | ZŁAPANA (144, 151) |
| 8 | powrót usuniętego Phonics Fun | ZŁAPANA (150, 152, 153) |

**8 / 8.** Wszystkie pięć klas błędu wskazanych przez recenzenta jest teraz wykrywanych.

---

## P3 — dwie pozycje usunięte z unitu 1

Usunięto `An unhappy uncle ____ an umbrella.` i `A happy man with a map ____ his lap.`
Powód zgodny z recenzją: to fragmenty rymowanki Phonics Fun bez orzeczenia — żadna z czterech
opcji nie tworzy pełnego zdania, a wyjaśnienia dopowiadały czasownik, którego w zdaniu nie widać
(„Stoi pod parasolem", „Mapa leży na kolanach"). Dziecko miało uzasadnić wybór z czegoś,
czego nie przeczyta.

Powrót blokują dwa niezależne testy (`zdania.test.js` i lista `SWIADOMIE_POMINIETE`
w teście zgodności) — mutacja nr 8 to potwierdza.

---

## P4 — druga partia: własna weryfikacja dystraktorów

**Przeszedłem niezależnie wszystkie 45 pozycji tym samym sitem, którym recenzent przeszedł
partię 1**: każdy z trzech dystraktorów wstawiony do luki i oceniony, czy nie powstaje
poprawne angielskie zdanie o sensownym znaczeniu. To 135 podstawień.

**Odrzuconych: 0.** Deklaracja autora partii 2 się potwierdziła — dobór dystraktorów jest
konsekwentny: prawie wszystkie zestawy to formy fleksyjne tego samego czasownika
(`sell / selling / to sell`) albo formy `be`/`have` niepasujące do podmiotu, czyli konstrukcje
z definicji niegramatyczne, a nie alternatywne znaczenia. Odrzucenie 10 pozycji na etapie
przepisywania zdjęło z listy właśnie te ryzykowne (wymienne `can't`/`don't`, wymienne przysłówki
częstotliwości, `from`/`in Aberdeen`) — dlatego to, co zostało, przechodzi sito czysto.

Pozycje, które oglądałem najdłużej, i dlaczego mimo to zostają:

| Zdanie | Wątpliwość | Rozstrzygnięcie |
|---|---|---|
| `You can walk there and ____ at the room.` (look) | samo „look at the room" to niezgrabna angielszczyzna | zdanie jest z podręcznika; dystraktory `looks / looking / to look` po „can" są jednoznacznie niegramatyczne — pytanie ma jedną odpowiedź |
| `He's got a runny nose. Give ____ some tissues.` (him) | `his` bywa poprawne przed rzeczownikiem | ale nie tu: „Give his some tissues" jest niegramatyczne, bo po `his` nie ma rzeczownika |
| `____ smartwatch is very old.` (His) | ten sam wzorzec od drugiej strony | `He / Him / He's smartwatch` — wszystkie niegramatyczne |
| `You ____ have some juice.` (can) | dystraktor `are` | „You are have some juice" niegramatyczne |
| `Luke is a police officer. He ____ criminals.` (catches) | podobne do `She can ____ criminals` (catch) z partii 1 | inne zdanie, inna forma, inny unit — nie duplikat, a kontrast `can catch` / `he catches` jest tu dydaktycznie użyteczny |

Zdanie ze strony 15 (`It has got a ____` → `toothache`) **nie weszło**, zgodnie z decyzją matki:
w podręczniku jest tam kolorowy prostokąt zamiast słowa, więc było to rekonstrukcją, nie przepisaniem.

---

## P5 — przełącznik trybu pamięta wybór

Zapis w `localStorage` pod **osobnym kluczem** `gra-szkolna-tryb-odpowiedzi`, obsługiwany przez
`js/postepy.js` (`trybOdpowiedzi` / `zapiszTrybOdpowiedzi`). Kształt: `{ "<id zestawu>": "wybor" }`.

Decyzje:

- **Osobny klucz, nie stan postępów** — „🗑️ Wyczyść postępy" ma kasować wyniki dziecka,
  a nie ustawienie sterowania. Osobny test to blokuje.
- **Per zestaw, nie globalnie** — domyślny tryb zależy od klasy zestawu, więc jedna wspólna
  wartość narzucałaby powtórce z klasy 2 ustawienie zrobione przy zdaniach klasy 3.
- **Obrona na uszkodzone dane nie jest omijana**: uszkodzony JSON, tablica, `null`, obcy kształt
  i wartość spoza listy trybów dają `null` = „brak wyboru", czyli fallback na domyślny wg klasy.
  Kolejność źródeł: wybór z tej sesji → zapamiętany → domyślny.

Argument recenzenta (reset był bezpieczniejszy, bo dziecko nie zostaje na stałe w łatwiejszym
trybie bez wiedzy matki) został wykonany jako **przeciwwaga, nie jako weto**: na ekranie wyboru
rozdziału jest teraz stała, wyróżniona linijka **„Teraz grasz: Wpisywanie / Wybór z czterech"**,
widoczna bez klikania w przełącznik.

---

## P6 — odznaka i komunikat

- `ODZNAKI` było kluczowane trybem, a tryb „angielski" ma dwa rodzaje materiału — po rundzie zdań
  dziecko dostawało „🏅 Mistrz słówek", czyli nagrodę za coś, czego w tej rundzie nie robiło.
  Odznakę wybiera teraz `odznakaDla(tryb, idPoziomu)`; zestaw zdań dostaje **„🏅 Mistrz zdań"**.
- `BRAK_MATERIALU` mówiło „Ten rozdział nie ma jeszcze słówek" także na zestawie zdań.
  Treść zależy teraz od modułu (`brakMaterialu(idZestawu)`), tak jak wcześniej zrobiono
  z nagłówkiem ekranu. Stan dziś nieosiągalny — lista rozdziałów powstaje z danych — ale
  to był zapalnik na pierwszy zestaw z rozdziałem opisanym ręcznie.

---

## P7 — brakujące testy

`tests/tryb-odpowiedzi.test.js` (14 przypadków) domyka trzy mutacje, które przeżyły recenzję:

- `ustawTrybOdpowiedzi` — przyjmuje oba znane tryby, odrzuca 11 kształtów śmieci
  (`'WYBOR'`, `'wybór'`, `''`, `null`, `0`, `{}`, `'wpisywanie '` z ogonem spacji…);
- **„🔁 Jeszcze raz" powtarza rundę w TYM SAMYM trybie** — testowane przez tę samą ścieżkę,
  którą woła handler (`rozpocznijWalke → pytaniaDla`), w obie strony, plus wariant „stary kontekst
  bez trybu spada na domyślny wg klasy, a nie na pustą rundę";
- **śmieciowa wartość trybu w pamięci** — 9 realnych kształtów uszkodzenia.

Plus testy P5 (zapamiętanie przeżywa ponowne utworzenie modułu, rozdzielność per zestaw,
odporność `reset()`, brak magazynu) i P6 (odznaka, komunikat).

---

## Czego NIE zmieniono

**Czas informacji zwrotnej został nietknięty** (`CZAS_FEEDBACK_Z_TEKSTEM = 3200`).
Pomiar recenzenta jest w mocy także po dopisaniu 45 zdań: podczas informacji zwrotnej treść
zdania znika z ekranu, więc dziecko czyta tylko tytuł i wyjaśnienie. Sprawdzone na nowym
komplecie 89 wyjaśnień — najdłuższy taki tekst ma **89 znaków**, średnia **68**; przy bardzo
wolnych 45 znakach na sekundę to **2,0 s przy budżecie 3,2 s**, czyli dokładnie tyle samo,
ile wyliczył recenzent przed dopisaniem partii 2. Zapas zostaje.
Zmiana byłaby pogorszeniem bez powodu.

---

## Weryfikacja w przeglądarce

Lokalny serwer HTTP (`python3 -m http.server`), nie plik z dysku.

| Sprawdzone | Wynik |
|---|---|
| Licznik zdań na ekranie wyboru poziomu | „Zdania z lukami — **89 zdań**" |
| Nagłówek ekranu rozdziałów | „Które zdania ćwiczymy?" |
| Wyjaśnienie po odpowiedzi, z polskimi znakami | „Przeczenie przy "I" w tym czasie to "don't"." — diakrytyki renderują się poprawnie |
| Zapamiętany tryb po przeładowaniu strony | ustawiono „Wybór z czterech" → `localStorage` = `{"zdania-klasa3":"wybor"}` → po `reload` przełącznik i linijka „Teraz grasz" nadal na „Wybór z czterech" |
| Śmieciowa wartość w pamięci (`"quiz"`) | gra wstaje, spada na domyślne wpisywanie, konsola czysta |
| Odznaka po wygranej rundzie zdań | **„🏅 Mistrz zdań"** |
| Pełna runda w trybie „wybór z czterech" | wygrana, 6 trafień, lista „Do powtórki" z wyjaśnieniem |
| Pełna runda w trybie „wpisywanie" | wygrana, pole tekstowe + OK działa |
| „🔁 Jeszcze raz" | wraca w tym samym trybie (4 opcje po rundzie „wybór") |
| Ekran rodzica | osobny wiersz „Klasa 3 — zdania 11 / 12 92%", pomylone zdanie opisane treścią + poprawną odpowiedzią |
| 320 px | brak poziomego scrolla (`scrollWidth === clientWidth === 320`), przełącznik zawija się w dwa wiersze, „Teraz grasz" na pełnej szerokości |
| Konsola | **czysta** — zero logów i zero błędów przez całą sesję |

---

## Wątpliwości do zgłoszenia matce

1. **„Teraz grasz: …" a decyzja o pamiętaniu.** Wykonana zgodnie z prośbą, ale warto po tygodniu
   sprawdzić w praktyce, czy syn nie osiadł na stałe w „wyborze z czterech". Ekran rodzica tego
   nie pokazuje — widać tylko skuteczność, a ta w łatwiejszym trybie z natury jest wyższa.
   Gdyby to okazało się problemem, najtańsza poprawka to dopisanie trybu do wiersza na ekranie rodzica.
2. **Punkty „DO POTWIERDZENIA" z dokumentu partii 2 zostają otwarte** — przypisanie unitów dla stron
   11, 13, 53, 59, 61, 69, 71, 79, 81 wyprowadzono z treści i rytmu numeracji, nie z widocznego
   nagłówka unitu. Wpływa to wyłącznie na to, w którym rozdziale zdanie się pojawi, nie na jego
   poprawność. Jeśli matka zajrzy do podręcznika, korekta unitu to zmiana jednej liczby
   w dwóch miejscach (dane + dokument) — test zgodności przypilnuje, żeby nie zmienić tylko jednego.
