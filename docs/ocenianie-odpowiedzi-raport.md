# Ocenianie odpowiedzi w trybie wpisywania — raport

Data: 2026-09-08
Podstawa: zgłoszenie z prawdziwej gry (matka grała z 9-latkiem; gra odrzuciła poprawną odpowiedź).

---

## Podsumowanie

Dwie niezależne usterki w trybie wpisywania. Obie kończyły się tak samo:
dziecko wpisywało coś poprawnego, gra odbierała serce i pokazywała „Prawie!",
a wyjaśnienie sugerowało, że dziecko miało rację. To najgorszy możliwy rodzaj
błędu w grze do nauki — uczy, że poprawna odpowiedź jest zła.

| # | Usterka | Naprawa |
|---|---------|---------|
| 1 | `normalizuj` robiło tylko `trim().toLowerCase()`, więc apostrof z tabletu i forma rozwinięta były odrzucane | `js/walka.js` — ujednolicenie apostrofów, rozwinięcie skrótów, zwijanie spacji |
| 2 | 20 zdań ma w trybie wpisywania dwie poprawne odpowiedzi, a gra przyjmowała tylko jedną | nowe pole `takze_poprawne` w `dane/zdania.js` + funkcja `pasuje` w `js/walka.js` |

Testy: **191 zielonych** (172 wcześniejsze + 19 nowych), `node --test`.

---

## Usterka 1 — apostrof i forma rozwinięta

### Co było

```
"aren't"  -> ZALICZONE
"aren’t"  -> ODRZUCONE     <- to wpisuje iPad i Android
"are not" -> ODRZUCONE
```

iOS i Android **domyślnie** zamieniają prosty apostrof U+0027 na typograficzny
U+2019. Siedem zdań w materiale ma apostrof w poprawnej odpowiedzi
(`isn't`, `aren't`, `don't`, `haven't`). Na tablecie dziecko nie miało szans ich
zaliczyć i nie mogło zrozumieć dlaczego — na ekranie oba znaki wyglądają tak samo.

### Co jest teraz

`normalizuj` w `js/walka.js` sprowadza obie strony porównania do jednej postaci:

1. **Apostrofy** — `'` (U+0027), `’` (U+2019), `‘` (U+2018), `` ` `` (U+0060),
   `´` (U+00B4), `ʼ` (U+02BC), `‛` (U+201B) znaczą to samo.
2. **Białe znaki** — `are  not` = `are not` (zwijanie do jednej spacji).
3. **Formy rozwinięte** — obie strony idą do formy rozwiniętej:
   `aren't`↔`are not`, `isn't`↔`is not`, `don't`↔`do not`, `doesn't`↔`does not`,
   `haven't`↔`have not`, `hasn't`↔`has not`, `can't`↔`can not`↔`cannot`.

Lista skrótów jest **zamknięta i wypisana ręcznie**, nie ogólnym regexem po `n't` —
celowo obejmuje tylko czasowniki posiłkowe i modalne występujące w materiale klasy 3.

### Czego naprawa NIE zepsuła (sprawdzone testami)

- **Porównanie liczbowe** dla klawiatury numerycznej (`07` = `7`) działa dalej.
  Warunek `/^\d+$/` na obu stronach pozostaje **niezmieniony i wąski** — puste
  wejście przy oczekiwanym `0`, `0x10` przy `16`, `-7`, `7.0` nadal są odrzucane.
  Powód wąskości opisuje komentarz nad `rowne`; nie został ruszony.
- **Odpowiedzi jednowyrazowe** (słówka, ortografia) — bez zmian.
- Formy, które **nie są** zamiennikami, dalej się nie sklejają:
  `am not` ≠ `isn't`, `is not` ≠ `are not`, `don't` ≠ `doesn't`, `have` ≠ `haven't`.

---

## Usterka 2 — zdania z dwiema poprawnymi odpowiedziami

### Zgłoszony przypadek

`My sister and I ____ scared.` — w danych poprawna jest `aren't`, matka wpisała
`are`, gra odrzuciła. **`My sister and I are scared` to całkowicie poprawne zdanie.**
Bez obrazka z podręcznika nic w tym zdaniu nie wskazuje, czy chodzi o twierdzenie,
czy przeczenie. Wyjaśnienie mówiło „liczba mnoga, więc *are* / *aren't*" — czyli
czytało się jak potwierdzenie, że dziecko miało rację.

### Dlaczego to przeszło przez cztery recenzje

Wszystkie sprawdzały, czy któryś z trzech **dystraktorów** nie jest drugą poprawną
odpowiedzią. W trybie wpisywania dystraktorów nie ma — dziecko wpisuje cokolwiek,
a cztery opcje przestają zawężać pole. Sprawdzano złą rzecz.

### Rozwiązanie

Nowe, **opcjonalne** pole przy zdaniu:

```js
{ zdanie: 'My sister and I ____ scared.', odpowiedz: "aren't",
  takze_poprawne: ['are'],
  dystraktory: ["isn't", 'am not', "hasn't"], ... }
```

- Używane **wyłącznie do oceniania** (`pasuje` w `js/walka.js`).
- **Nie wchodzi do listy czterech opcji** w trybie wyboru — tam dystraktory nadal
  zawężają pole i zdanie ma dokładnie jedną poprawną odpowiedź. Zweryfikowane
  w przeglądarce: `My sister and I ____ scared.` pokazuje `aren't · isn't · hasn't · am not`.

### Kryterium, według którego przeszedłem wszystkie 89 zdań

Sformułowanie matki: formy twierdzące i przeczące są zamiennikami **tylko tam,
gdzie zdanie nie rozstrzyga**, o którą chodzi. Dla każdego zdania z luką na
czasownik posiłkowy lub modalny pytanie brzmiało: *widząc WYŁĄCZNIE to zdanie tak,
jak wyświetla się na ekranie — bez obrazka, bez podręcznika, bez sąsiednich zdań —
czy da się rozstrzygnąć formę?*

Domyślna odpowiedź to **„zostaw bez zmian"**. Zbyt szerokie akceptowanie jest
gorsze niż zbyt wąskie: chwali błąd zamiast go poprawić.

Zdania, w których luka jest **czasownikiem głównym** (`likes`, `wearing`, `catch`)
albo **przyimkiem** (`with`, `to`, `by`, `in`), w ogóle nie wchodzą do tej analizy —
przeczenie wymagałoby tam przebudowy zdania, a nie podmiany jednego wyrazu.

---

## Lista 1 — zdania, którym DOPISAŁEM alternatywę (20)

| # | Zdanie | Unit | W danych | Dopisane | Dlaczego zdanie nie rozstrzyga |
|---|--------|------|----------|----------|-------------------------------|
| 1 | My sister and I ____ scared. | 1 | `aren't` | `are` | **Zgłoszone przez matkę.** Nic nie mówi, czy się boją, czy nie. |
| 2 | My grandma and grandpa ____ in the museum. | 1 | `are` | `aren't` | Zdanie tylko lokalizuje; brak przesłanki za twierdzeniem. |
| 3 | Tom ____ got a fever. | 2 | `has` | `hasn't` | Sama informacja o gorączce — obie formy poprawne. |
| 4 | Anna and Charlie ____ got a stomach ache. | 2 | `have` | `haven't` | jw. |
| 5 | This ____ my laptop. | 3 | `is` | `isn't` | Wskazanie przedmiotu; „to nie jest mój laptop" równie sensowne. |
| 6 | I ____ play computer games. | 3 | `can` | `can't` | Brak kontekstu o umiejętności. |
| 7 | It ____ expensive but it is cool. | 3 | `isn't` | `is` | „but" **sprzyja** twierdzeniu: drogie, ale fajne. Wersja z `is` jest naturalniejsza niż z `isn't`. |
| 8 | Kate ____ got a laptop. | 3 | `has` | `hasn't` | Posiadanie — obie formy. |
| 9 | We ____ got shrimps. | 4 | `have` | `haven't` | jw. |
| 10 | He ____ got heavy boots. | 5 | `has` | `hasn't` | jw. |
| 11 | These ____ his boots. | 5 | `are` | `aren't` | Identyfikacja; przeczenie równie poprawne. |
| 12 | There ____ a bus station. | 6 | `is` | `isn't` | „There isn't a bus station." jest w pełni naturalne. |
| 13 | Lucy ____ playing tennis. | 7 | `is` | `isn't` | Opis czynności bez rozstrzygnięcia. |
| 14 | He ____ kayaking. | 8 | `isn't` | `is` | jw., w drugą stronę. |
| 15 | We ____ on the beach. | 8 | `are` | `aren't` | Lokalizacja bez przesłanki. |
| 16 | My eyes ____ black. | 1 | `are` | `aren't` | Opis wyglądu; „nie są czarne" poprawne. |
| 17 | My hair ____ brown. | 1 | `is` | `isn't` | jw. |
| 18 | They ____ got a fever. | 2 | `have` | `haven't` | Posiadanie objawu. |
| 19 | I ____ got a helmet on my head. | 7 | `haven't` | `have` | Nic w zdaniu nie mówi, czy kask jest, czy go nie ma. |
| 20 | Three thin thieves ____ thinking. | 8 | `are` | `aren't` | Łamaniec fonetyczny; treść nic nie rozstrzyga. |

Żadna z dopisanych form **nie jest jednocześnie dystraktorem** tego samego zdania —
pilnuje tego test (`alternatywa nigdy nie jest jednym z dystraktorów tego samego zdania`).

---

## Lista 2 — zdania, przy których się wahałem i ZOSTAWIŁEM bez zmian

To są przypadki graniczne. Wypisuję je świadomie, żeby matka mogła podjąć inną
decyzję niż moja — każde z nich to jedna linijka `takze_poprawne` do dopisania.

| Zdanie | Unit | W danych | Rozważana forma | Dlaczego zostawiłem |
|--------|------|----------|-----------------|---------------------|
| There ____ healthy sandwiches at the bakery. | 6 | `are` | `aren't` | Naturalne przeczenie to „there **aren't any** healthy sandwiches". Bez „any" wersja przecząca brzmi nieskładnie, więc zdanie w praktyce wskazuje formę twierdzącą. |
| You ____ have some juice. | 4 | `can` | `can't` | To samo zjawisko: po przeczeniu angielski chce „any", nie „some". „You can't have **some** juice" jest niepoprawne stylistycznie. |
| We ____ the Taylors, a family from the UK. | 1 | `are` | `aren't` | Dopowiedzenie „a family from the UK" **identyfikuje** podmiot, więc przeczenie („nie jesteśmy Taylorami, rodziną z UK") jest niespójne. |
| I ____ looking at starfish. | 8 | `am` | `am not` | Przeczenie od „am" to dwa wyrazy, a luka `____` sugeruje jeden. Nie chciałem uczyć, że w jedną lukę wpisuje się dwa słowa. Dotyczy też innych zdań z „am". |
| Mark is ten years old. He ____ elderly. | 1 | `isn't` | `is` | Wiek 10 lat rozstrzyga sens — dziesięciolatek nie jest starszy. Przyjęcie „is" pochwaliłoby błąd rzeczowy. |
| Kevin is not an adult, but he ____ tall. | 1 | `is` | `isn't` | „but" po przeczeniu w pierwszej części wymusza twierdzenie w drugiej. |

Zdania z **jednoznacznie wymuszonym** kontekstem (nie było wahania, ale są objęte
osobnym testem kontrolnym): `There ____ any old gadgets in this museum.` („any"
wymusza przeczenie), `I ____ eat meat, please give me peas.` (druga część zdania),
`____ he hiking? Yes, he is.` i `Are you playing tennis? No, I ____ not.`
(odpowiedź stoi w samym zdaniu), oraz wszystkie pytania `Wh-` / `Is…?` / `Do…?`.

---

## Poprawione wyjaśnienia (4)

Poprawiłem te wyjaśnienia, które sugerowały, że przeczenie było **jedyną** opcją,
albo — jak w zgłoszonym przypadku — czytały się jak potwierdzenie, że dziecko
miało rację. Wyjaśnienie ma teraz uczyć tego, czego zdanie faktycznie uczy
(zgodności liczby / osoby), i mówić wprost, że obie formy pasują.

| Zdanie | Było | Jest |
|--------|------|------|
| My sister and I ____ scared. | „My sister and I" to „we" - liczba mnoga, więc „are" / „aren't". | „My sister and I" to „we" - liczba mnoga, więc „are". Przeczenie od „are" to „aren't" - tu pasują obie formy. |
| It ____ expensive but it is cool. | Przy „it" przeczenie od „is" to „isn't". | Przy „it" mówimy „is", a przeczenie to „isn't" - w tym zdaniu pasują obie formy. |
| He ____ kayaking. | Przeczenie przy „he" w tym czasie to „isn't" + -ing. | Przy „he" mówimy „is" + -ing, a przeczenie to „isn't" - tu pasują obie formy. |
| I ____ got a helmet on my head. | Przeczenie od „I have got" to „I haven't got". | Przy „I" mówimy „have got", a przeczenie to „haven't got" - tu pasują obie formy. |

Pozostałych 16 wyjaśnień nie ruszałem: uczą zgodności liczby lub osoby
(„Dwie osoby = liczba mnoga, więc «are»") i nie twierdzą, że druga forma jest zła.

**Wyjaśnienia są zsynchronizowane z dokumentami** `docs/zdania-klasa3-do-zatwierdzenia.md`
(3 zmiany) i `docs/zdania-klasa3-partia2-do-zatwierdzenia.md` (1 zmiana) — pilnuje
tego istniejący test zgodności, porównujący wyjaśnienia dosłownie.

---

## Relacja pola `takze_poprawne` do dokumentów źródłowych

Pole **NIE jest** dopisane do `docs/`. To decyzja, nie pominięcie:

- dokument opisuje **treść z podręcznika** — jedno zdanie, jedna poprawna
  odpowiedź, trzy dystraktory, wyjaśnienie, numer unitu;
- `takze_poprawne` to **decyzja o ocenianiu w trybie wpisywania**, podjęta poza
  podręcznikiem (matka, 2026-09-08).

Żeby to zwolnienie nie stało się dziurą w teście zgodności, dopisałem do
`tests/zdania-zgodnosc-z-dokumentem.test.js` dwa strażniki:

1. **Zamknięta lista pól.** Zdanie w grze może mieć wyłącznie pięć pól
   z dokumentu plus jawnie dozwolone `takze_poprawne`. Każde inne nowe pole
   wysadza test — czyli nie da się przemycić treści obok porównania z dokumentem.
2. **Kształt pola.** `takze_poprawne` musi być niepustą tablicą tekstów, nie może
   powtarzać `odpowiedz` ani pokrywać się z dystraktorami.

Wszystkie dotychczasowe kontrole (podmiana zdania, odpowiedzi, dystraktora,
wyjaśnienia, unitu; liczby 44 + 45 = 89) działają bez zmian.

---

## Testy

`node --test` (bez argumentu — forma `node --test tests/` nie działa na Node 22).

```
# tests 191
# pass 191
# fail 0
```

172 wcześniejsze testy zostały zielone. Nowe: 17 w `tests/ocenianie-wpisywania.test.js`
+ 2 w `tests/zdania-zgodnosc-z-dokumentem.test.js`.

### Weryfikacja mutacyjna

Na **kopii projektu** (`rsync`), nigdy przez `git checkout`. Sześć mutacji, sześć zabitych:

| Mutacja | Wynik |
|---------|-------|
| `normalizuj` z powrotem na `trim().toLowerCase()` | zabita |
| `pasuje` ignoruje `takze_poprawne` | zabita |
| alternatywa dopisana do zdania z wymuszonym kontekstem (`There ____ any old gadgets`) | zabita |
| alternatywa równa jednemu z dystraktorów | zabita |
| nowe pole w danych spoza dokumentu | zabita |
| rozluźnienie wąskiego warunku liczbowego na `!isNaN(Number(...))` | zabita |

---

## Weryfikacja w przeglądarce

Lokalny serwer HTTP (`python3 -m http.server`), tryb **wpisywania**, Zdania z lukami,
Tylko Rozdział 1. Kilka pełnych rund.

| Sprawdzenie | Wynik |
|---|---|
| `My sister and I ____ scared.` + `are` (zgłoszony przypadek) | **zaliczone** — „Dobrze! 💥" |
| `My sister and I ____ scared.` + `aren't` / `aren’t` / `are not` | zaliczone (przez moduły `window.GRA` na żywej stronie) |
| `My sister and I ____ scared.` + `isn't` | odrzucone (poprawnie) |
| `My grandma and grandpa ____` + `aren’t` (apostrof typograficzny) | zaliczone |
| `My hair ____ brown.` + `is  not` (rozwinięcie + podwójna spacja) | zaliczone |
| `Mark is ten years old. He ____ elderly.` + `is not` | zaliczone (`isn't`) |
| `Kevin is not an adult, but he ____ tall.` + `isn’t` | **odrzucone** — kontekst wymusza `is` |
| `Mark is ten years old. He ____ elderly.` + `is` | **odrzucone** — kontekst wymusza `isn't` |
| `There ____ any old gadgets in this museum.` + `are` | **odrzucone** |
| Tryb wyboru: lista opcji dla zgłoszonego zdania | 4 przyciski, bez `are` |
| Pełna runda do „Potwór pokonany! 🎉" + ekran powtórki | działa |
| Konsola przeglądarki | czysta (0 błędów, 0 ostrzeżeń) |
| Szerokość 320 px | `scrollWidth` = 320, brak przewijania poziomego |

Uwaga na marginesie: pierwsza próba na `localhost` pokazała starą, zakeszowaną
przez przeglądarkę wersję `index.html` (bez `dane/zdania.js`) i wyglądała jak błąd
w kodzie. To był wyłącznie cache przeglądarki — na `127.0.0.1` wszystko działało
od razu. Warto o tym pamiętać przy kolejnych weryfikacjach.
