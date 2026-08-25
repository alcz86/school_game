# SDD ledger — plan: docs/2026-08-24-gra-szkolna-plan.md

Spec: docs/2026-08-24-gra-szkolna-design.md (przeczytany, wiążący)
Branch: implementacja (odgałęziona od main @ 4e0aa1d)

## Pre-flight scan

### Pary tasków dzielące plik lub interfejs

| Taski | Co jedna produkuje / druga konsumuje | Wynik |
|---|---|---|
| T1 → T3,T4,T5,T6 | `index.html` — T1 tworzy, pozostałe dopisują `<script>` | OK, zmiany addytywne — ale kolejność ładowania krytyczna, patrz Ruling 1 |
| T1 → T7,T8,T9 | `js/app.js` — T1 tworzy, kolejne rozszerzają | OK, kolejność sekwencyjna |
| T1 → T7 | `tests/app.test.js` — T1 tworzy 3 testy, T7 dopisuje 3 | OK, dopisanie na końcu |
| T1 → T7,T8,T9 | `css/style.css` | OK, addytywne |
| T2 → T8 | `walka.nowaWalka(pytania, opcje)`, `walka.odpowiedz(stan, odp)` | OK, sygnatury zgodne |
| T3,T4,T5 → T2 | kształt pytania `{id, tresc, odpowiedz, wyjasnienie}` | OK; T4/T5 dokładają pole `warianty`, `walka` je ignoruje — bez kolizji |
| T3,T4,T5 → T7 | `generuj()` — **różna arność**: T3/T4 `(id, ile, wagi)`, T5 `(id, ile, tryb, wagi)` | Niespójne, ale `pytaniaDla` obsługuje każdy tryb osobną gałęzią — patrz Ruling 2 |
| T6 → T7 | `postepy.wagi(tryb, zestaw)` → `{ [id]: bledy }` | OK, zgodne z tym, czego oczekują generatory |
| T6 → T9 | `postepy.statystyki()` | OK |
| T5 → T7 | `slowka.ZESTAWY` niepuste — test T7 `poziomyDla('angielski')` | OK, T5 wykonywane przed T7 |
| T2 → T3 | T3 krok 5 dopisuje `<script src="js/walka.js">` | OK, T2 przed T3 |

### Spójność wewnętrzna tasków

| Task | Testy vs kod, pliki tworzone vs później modyfikowane | Wynik |
|---|---|---|
| T1 | 3 testy ↔ `EKRANY`, `pokazEkran` | spójne |
| T2 | 9 testów ↔ `mnoznikCombo`, `nowaWalka`, `odpowiedz` | spójne; test niemutowalności pokryty przez `Object.assign` + `slice()` |
| T3 | 6 testów ↔ generator; test „wagi" wymaga `zId` | spójne, `zId` wyeksportowane |
| T4 | 6 testów; dwa zestawy celowo do napisania, test ≥15 wyrazów to wymusza | spójne, zamierzone |
| T5 | 5 testów; test ≥40 słów blokuje do czasu zatwierdzenia listy | spójne, bramka zamierzona |
| T6 | 8 testów ↔ API `utworz`; magazyn wstrzykiwany | spójne |
| T7 | 3 testy ↔ `poziomyDla`, `pytaniaDla` | spójne po Ruling 3 |
| T8, T9 | weryfikacja ręczna, bez testów automatycznych | patrz Ruling 4 |
| T10 | weryfikacja kryteriów spec §6 | spójne |

### Rulings (przed startem)

**Ruling 1 — kolejność skryptów w `index.html`.** Plan każe kolejnym taskom dopisywać
`<script>`, ale `js/app.js` z T7 czyta `window.GRA.*` w momencie ładowania. Wszystkie pliki
`dane/*.js`, `js/walka.js` i `js/postepy.js` MUSZĄ być ładowane PRZED `js/app.js`. Wpisane
do briefów T3–T6 jako wymóg. Koszt pomyłki: gra nie startuje, `undefined is not an object` —
wychwycone natychmiast w kroku „sprawdź w przeglądarce".

**Ruling 2 — różna arność `generuj()`.** Zostawiam jak w planie zamiast ujednolicać.
`slowka.generuj` potrzebuje trybu pytania (wybór/wpisywanie), pozostałe nie; wymuszanie
wspólnej sygnatury dołożyłoby martwy parametr do dwóch modułów. `pytaniaDla` i tak rozgałęzia
się per tryb. Koszt pomyłki: drobne tarcie przy dopisywaniu czwartego trybu w przyszłości.

**Ruling 3 — most `modul()` w `app.js`.** Plan w T7 wprowadza funkcję `modul()` działającą
i w Node, i w przeglądarce. To jedyny mechanizm — nie ma alternatywnej ścieżki. Wymóg
`file://` ze spec wyklucza `import`/`export`. Koszt pomyłki: testy T7 nie ruszą w Node.

**Ruling 4 — T8 i T9 bez testów automatycznych.** Plan opiera je na weryfikacji ręcznej
w przeglądarce. Cała logika, którą da się sensownie testować (walka, postępy, generatory),
jest odseparowana i pokryta w T2–T6; T8/T9 to warstwa renderowania. Nie dokładam testów DOM,
bo wymagałyby zależności (jsdom), a spec zabrania zależności zewnętrznych. Koszt pomyłki:
regresja w UI nie zostanie wychwycona automatycznie — łagodzone listą kontrolną w T10.

**Ruling 5 — gałąź zamiast worktree.** Praca idzie na gałęzi `implementacja` w tym samym
katalogu, nie w osobnym worktree. Repo jest świeże, jednoosobowe, bez równoległej pracy —
worktree dodałby narzut bez korzyści. Nie pracuję na `main`. Koszt pomyłki: żaden przy
jednym wykonawcy.

## Postęp

Task 1: implementer DONE (commit 8667533) — 3/3 testów zielonych.

Task 1: Ruling 6 — weryfikacja `file://` niemożliwa narzędziami przeglądarki (pliki spoza
katalogu projektu renderują się jako statyczny snapshot, JS nie wykonuje się; implementer
sprawdził przez lokalny http.server). Zweryfikowałem mechanicznie realny tryb awarii:
zero `type="module"`, zero `import`/`export`, zero `fetch()` — czyli nic, co blokowałoby
`file://`. Pełne potwierdzenie podwójnego kliknięcia przechodzi do T10 / do Aleksandry.
Koszt pomyłki: gra nie odpaliłaby się z pliku — wykrywalne w sekundę przy pierwszym uruchomieniu.

Task 1: Ruling 7 — Aleksandra poprosiła w trakcie o zieloną paletę. Zmieniłem tokeny
`:root` w `css/style.css` (commit f50c548). Blok palety w planie (T1 krok 5) jest tym samym
nieaktualny — wiążąca jest wersja w repo, nie w planie. Instrukcja użytkownika ma
pierwszeństwo nad planem. Koszt pomyłki: żaden, zmiana czysto wizualna, 6 tokenów CSS.

Task 1: minor (deferred): brak `:focus-visible` na `.link-rodzic` (css/style.css:65) —
kafle mają, przycisk 📊 nie. Niespójność dostępności klawiaturowej. Do dorzucenia w T9,
który i tak dotyka tego ekranu.

Task 1: complete (commits 4e0aa1d..f50c548, spec ✅, jakość approved, 1 minor odłożony)

Task 2: implementer DONE_WITH_CONCERNS (commit fbbf856) — 8/9 testów. Zgłosił sprzeczność
wewnątrz briefu: test „combo ×2" oczekuje 3 poprawnych odpowiedzi przy 2 pytaniach, ale
implementacja referencyjna kończy walkę, gdy kolejka pytań się opróżni.

Task 2: Ruling 8 — defekt planu, nie wykonania. Wina po mojej stronie: implementacja
referencyjna traktowała wyczerpanie kolejki pytań jako WYGRANĄ, co jest sprzeczne ze spec §2
(walka kończy się zbiciem życia bossa albo utratą 3 serc — nigdy „skończyły się pytania").
Dziecko mogłoby pokonać bossa, nie zbijając mu życia. Rozstrzygam na korzyść spec: stan
walki trzyma pełną pulę pytań i uzupełnia z niej kolejkę, gdy się opróżni. Długość rundy
wyznacza życie bossa, a powtarzanie pytań jest tu zaletą dydaktyczną, nie wadą. Testy
z briefu zostają bez zmian — to implementacja była błędna. Dodatkowo wymagam nowego testu
wprost sprawdzającego, że wyczerpanie puli pytań NIE kończy walki.
Koszt pomyłki: rundy kończyłyby się przedwcześnie fałszywą wygraną — czyli gra nie robi
tego, po co powstała.

Task 2: fix round 1/5 (1 addressed, 0 open; commit f074a53) — 13/13 testów, w tym nowy
test na regułę z Ruling 8.

Task 2: recenzja — spec ✅, jakość approved, zero Critical/Important.

Task 2: minor (deferred): `nowaWalka([])` z pustą tablicą pytań daje stan zamrożony —
`aktualne` null, `skonczona` nigdy true, brak wyjścia. Brief nie wymagał walidacji.
Do dodania jako guard w T7 (`pytaniaDla` jest jedynym producentem pytań) — wpisane
do briefu T7 przy dispatchu.

Task 2: Ruling 9 — Global Constraint w planie podawał komendę testów `node --test tests/`,
która NIE działa na Node 22 w tym środowisku (traktuje katalog jak moduł, MODULE_NOT_FOUND).
Zweryfikowałem sam: `node --test` bez argumentu oraz `node --test tests/*.test.js` dają
13/13 zielonych. Poprawiłem Global Constraint w pliku planu. Wiążąca komenda to `node --test`.
Koszt pomyłki: żaden dla kodu — wada dotyczyła wyłącznie instrukcji weryfikacji; gdyby
przeszła niezauważona, T10 zgłosiłby fałszywą porażkę testów.

Task 2: complete (commits f50c548..f074a53, spec ✅, jakość approved, 1 minor odłożony)

Task 3: implementer DONE (commit 3998d6d) — 19/19. Kolejność skryptów w index.html zgodna
z Ruling 1 (zweryfikowałem sam).

Task 3: recenzja — spec ✅, jakość NOT APPROVED: 1 Critical + 1 Important + 1 Minor,
wszystkie potwierdzone empirycznie przez recenzenta.

Task 3: Ruling 10 — oba poważne znaleziska dotyczą kodu przepisanego wiernie z mojego
planu, czyli konflikt „znalezisko vs tekst planu". Rozstrzygam na korzyść specyfikacji:
(a) ważenie wciągało do rundy działania SPOZA bieżącego poziomu — dziecko w „Rozgrzewce"
(×2, ×5, ×10) dostawało `7×8` w ~33% pozycji; poziomy mają trzymać to, co obiecują.
(b) `wagi` były traktowane binarnie, więc wartość (liczba błędów) nie wpływała na częstość —
pozycja mylona 100 razy pojawiała się tak samo często jak mylona raz (1668 vs 1657 na 6000).
Spec §3.1 wymaga wprost, by mylone działania pojawiały się CZĘŚCIEJ, więc plan był
niezgodny ze spec. Wymagam też dwóch nowych testów — bez nich obie regresje wrócą.
Koszt pomyłki: funkcja „ucz się na błędach" nie działałaby wcale, a to główny mechanizm
dydaktyczny gry; dodatkowo poziomy trudności byłyby mylące.

Task 3: fix round 1/5 (3 addressed, 0 open; commit 39a4cee) — 21/21. Re-recenzja potwierdziła
empirycznie: wyciek spoza poziomu 0/6000 (było 33%), ważenie proporcjonalne 15.3x przy
wagach 100:1 (było 1.0x). Testy stabilne 50/50 przy powtórzeniach.

Task 3: complete (commits f074a53..39a4cee, spec ✅, jakość approved)

ZMIANA ZAKRESU (Aleksandra, w trakcie) — tryb angielskiego dostaje ZAWSZE widoczny wybór
zakresu: „tylko rozdział N" albo „od początku do rozdziału N" (kumulacyjnie). Zaktualizowałem
spec §3.3 oraz plan: interfejs T5 (`rozdzialy()`, piąty argument `zakres`, warianty losowane
tylko z zakresu), `pytaniaDla` w T7, nowy krok 0 w T8. Briefy T5/T7/T8 wygenerowane ponownie.
Commit dokumentacji: 490b6b8.

Task 4: implementer DONE (commit 12cf19f) — 30/30. Znalazł SZEŚĆ błędów merytorycznych
w zestawie `o-u` podanym w moim briefie: trzy złe indeksy luki (`pióro`, `rysunek`, `ratunek`)
i trzy fałszywe zasady (`nóż`, `góra`, `skrót`). Zweryfikowałem każdy — ma rację w każdym
punkcie. Słusznie też odrzucił parę `rzeka → rzeczny` z treści mojego zlecenia (oba wyrazy
mają rz, to nie jest wymiana).

Task 4: recenzja — spec ✅, jakość NOT APPROVED: 1 Critical, 1 Important, 5 Minor.

Task 4: Ruling 11 — Critical dotyczy wyrazu `król` z zasadą „ó wymienia się na o: królowa".
`królowa` ma ó, więc wymiana nie zachodzi. To ten sam błąd, który wykonawca sam wykrył przy
`góra` i `skrót`, i przeoczył w pierwszym wierszu zestawu — a przedtem przeoczyłem go ja,
pisząc plan. Rozstrzygam: naprawić, bo fałszywa zasada ortograficzna jest gorsza niż brak
gry — dziecko utrwali regułę tam, gdzie ona nie działa. Do naprawy także Important (`schody`
z pseudoregułą „po s piszemy ch" — nie ma takiej zasady w programie nauczania) oraz tanie
Minory. Poleciłem dodatkowo przejść CAŁĄ listę pod kątem tej jednej klasy błędu: ten typ
wystąpił już czterokrotnie w jednym pliku.
Koszt pomyłki: dziecko uczy się nieprawdziwej reguły ortograficznej i stosuje ją dalej.

Task 4: fix round 1/5 (5 addressed, 0 open; commit 84256e6) — 31/31. Re-recenzja potwierdziła
niezależnie audyt 22 par wymiany: 22/22 poprawne, formy pokrewne realne, litera na
odpowiadającej pozycji morfologicznej. Zero regresji w indeksach luk (63 wyrazy), id-ach,
duplikatach i mieszance wariantów.

Task 4: Ruling 12 — moja sugestia zastąpienia `wożę` wyrazem `łyżwy` była BŁĘDNA i wykonawca
słusznie ją odrzucił. `łyżwa`, `łyżew`, `łyżwiarz` mają ż — nie ma tam wymiany ż:z, więc
podpowiedziałem dokładnie tę klasę błędu, którą właśnie usuwaliśmy. Przyjmuję jego wybór
(`mrożone — mrozić, mróz`). Odnotowuję jako ósme wystąpienie tego samego typu błędu w tym
jednym pliku — tym razem po mojej stronie, w trakcie naprawiania go u kogoś innego.
Koszt pomyłki: żaden, bo wykonawca nie wykonał polecenia bezmyślnie.

Task 4: minor (deferred): sekcja §6 raportu task-4-report.md („PEŁNA LISTA WYRAZÓW") nie
została odświeżona po poprawkach — pokazuje stan sprzed rundy. Dokumentacja robocza,
nie kod; workspace i tak znika po zakończeniu planu.

Task 4: complete (commits 490b6b8..84256e6, spec ✅, jakość approved, 1 minor odłożony)

Task 5: kroki 1–3 DONE (bez commita — bramka). 141 słów przepisanych ze stron 91–95
Picture Dictionary, ZERO pozycji nieczytelnych, 10 do potwierdzenia. Wykonawca pobrał
strony w pełnej rozdzielczości zamiast zoomować w przeglądarce — stąd komplet.

Task 5: BRAMKA ZATWIERDZENIA — przedstawiłem Aleksandrze pełną listę (plik) plus 10 pozycji
wątpliwych w czacie. Zatwierdziła całość bez zmian.

Task 5: Ruling 13 — słowniczek ma 8 unitów, nie 7 jak zakładał mój plan; sekcja „Hello"
(liczby 1–20, przyimki, meble — 28 słów) nie jest rozdziałem w podręczniku. Wybrana
opcja A: `unit: 0` zostaje, a test zmienia się z `w.unit >= 1` na `w.unit >= 0`. Numeracja
pochodzi z książki i musi się z nią zgadzać — dziecko szukające „Unit 3" ma dostać Unit 3
z podręcznika. Test jest nasz, więc to test ustępuje. Aleksandra potwierdziła („jest ok"
przy rekomendacji A) — zaznaczyłem w czacie, że tak to interpretuję.
Koszt pomyłki: przy opcji B numeracja w grze rozjechałaby się z książką o jeden.

Task 5: kroki 5–7 DONE (commit a9dda19) — 40/40. Recenzja: spec ✅, jakość approved,
zero Critical. Weryfikacja empiryczna ~140 000 wywołań `generuj`: zero wycieków spoza
zakresu, także w wariantach; `id` niezależne od zakresu (statystyki się nie rozjadą);
brak współdzielonej referencji w `warianty` (błąd z T4 nie wrócił); 60/60 przy powtórzeniach.

Task 5: Ruling 14 — Important od recenzenta: `zakres` z wartością nieliczbową (`{do:'3'}`)
cicho degraduje do PEŁNEGO zestawu. Formalnie nie jest to naruszenie dzisiejszego interfejsu
(mówi „N" = liczba), więc mogłem to zostawić. Rozstrzygam: naprawiamy TERAZ, przed Taskiem 8.
Powód: ekran wyboru rozdziału poda tę wartość z DOM, a `<select>.value` i `dataset.*` są
zawsze stringami. Bez koercji wybór zakresu przestałby działać po cichu — gra nie wywala się,
tylko ignoruje wybór, a żaden test tego nie widzi. To najgorsza klasa usterki w tym projekcie.
Dorzucam też testy na przypadki brzegowe, których wykonawca celowo bronił kodem, ale których
nic nie blokuje przed „uproszczeniem" z powrotem do zapętlającej się pętli `while`.
Koszt pomyłki: syn wybiera rozdział 3, dostaje wszystkie 141 słów i nikt nie wie dlaczego.

Task 5: Ruling 15 — szkielet kodu w kroku 5 mojego planu był nieaktualny po dodaniu wyboru
zakresu (zaktualizowałem interfejsy i testy, nie szkielet). Wykonawca to wykrył i słusznie
od niego odszedł. Dopisałem do planu wyraźne ostrzeżenie zamiast przepisywać blok — plan
jest dokumentem historycznym, wiążące są interfejsy i testy.
Koszt pomyłki: kolejny wykonawca skopiowałby szkielet i dostał cztery czerwone testy.

Task 5: fix round 1/5 (3 addressed, 0 open; commit b61e286) — 44/44.

Task 5: Ruling 16 — moje polecenie w rundzie poprawek („skoercuj przez `Number(...)` przed
`Number.isInteger`") było BŁĘDNE i wykonawca słusznie odmówił dosłownego wykonania.
`Number(null)`, `Number('')` i `Number(false)` dają `0`, a `0` jest w tych danych PRAWIDŁOWYM
numerem rozdziału (sekcja „Hello"). Dosłowna implementacja zamieniłaby `{tylko: null}`
w `{tylko: 0}` — dziecko dostałoby same liczebniki zamiast całego materiału, czyli ta sama
klasa cichej usterki, którą właśnie naprawialiśmy, tylko odwrócona. Przyjmuję jego rozwiązanie
(sprawdzenie typu przed koercją). Re-recenzja potwierdziła niezależnie 16 wejść, w tym
`null`/`''`/`false` → brak zakresu, `'3'` → rozdział 3.
Koszt pomyłki: żaden, bo wykonawca nie wykonał polecenia bezmyślnie. Drugi raz w tym planie.

Task 5: re-recenzja — 3/3 ADDRESSED, weryfikacja mutacyjna dwóch testów potwierdzona
niezależnie, 108 000 sprawdzeń zakresu bez wycieku, zero nowych usterek.

Task 5: complete (commits 84256e6..751e06b, spec ✅, jakość approved)

Task 6: implementer DONE (commit 53e7646) — 52/52. Zgłosił własną wątpliwość: `dzisiaj()`
liczy datę w UTC.

Task 6: Ruling 17 — wątpliwość trafna, naprawiamy PRZED recenzją, bo dotyczy poprawności.
Gra działa w Polsce (UTC+1/+2), a `toISOString().slice(0,10)` zwraca dzień UTC — każda runda
zagrana między północą a 01:00–02:00 czasu lokalnego zapisze się jako dzień poprzedni.
Ekran dla rodzica ma pokazywać prawdę o tym, kiedy dziecko grało; data kalendarzowa jest
pojęciem lokalnym. Poleciłem złożenie `YYYY-MM-DD` z lokalnych komponentów, z jawnym zakazem
`toLocaleDateString()` (zależy od ustawień regionalnych, potrafi zwrócić `24.08.2026` i rozwalić
sortowanie ciągów oraz arytmetykę serii dni). Plus test blokujący i weryfikacja mutacyjna
pod `TZ=Pacific/Auckland`.
Koszt pomyłki: „dni z rzędu" pokazywałoby przerwy tam, gdzie ich nie było — jedyna metryka
motywacyjna na ekranie rodzica byłaby niewiarygodna.

Task 6: poprawka daty DONE (commit 7b01d16) — 53/53, test blokujący zweryfikowany mutacyjnie
pod TZ=Pacific/Auckland. Recenzent potwierdził niezależnie, w tym granice DST w Polsce
(29 marca i 25 października 2026) — `policzDniZRzedu` nie wymagało zmian.

Task 6: recenzja — spec ✅, jakość NOT APPROVED: 1 Critical, 1 Important, 2 Minor.

Task 6: Ruling 18 — Critical: `try/catch` w `wczytaj()` chroni tylko przed niepoprawnym
JSON-em, nie przed poprawnym JSON-em o obcej strukturze. Przy `{"dni":"nie-tablica"}`
`zapiszOdpowiedz` rzuca nieobsłużony TypeError — gra wywraca się dziecku w trakcie rundy.
Important: przy `{"odpowiedzi":"nie-obiekt"}` gra nie wywraca się, ale statystyki są po cichu
fałszowane, a odpowiedzi gubione bez sygnału. Rozstrzygam: naprawić oba, z walidacją kształtu
każdego pola osobno i testem na jedenaście różnych uszkodzeń. Brief miał na to JEDEN test.
Uzasadnienie realności scenariusza: przy `file://` originem jest plik, więc localStorage bywa
współdzielony z innymi lokalnymi stronami; dochodzą rozszerzenia przeglądarki i przyszłe
wersje samej gry o innym kształcie danych.
Koszt pomyłki: przy wariancie Critical gra przestaje działać i nikt nie wie dlaczego —
wyczyszczenie pamięci przeglądarki nie jest czymś, co Aleksandra ma diagnozować. Przy
wariancie Important ekran dla rodzica pokazuje wymyślone liczby, co jest gorsze niż brak
ekranu, bo prowadzi do złych decyzji o tym, co syn ma ćwiczyć.

Task 6: fix round 1/5 (3 addressed, 0 open; commit 595e0ed) — 64/64. Re-recenzja potwierdziła
empirycznie 15 kształtów uszkodzeń, każdy w dwóch wymiarach (nie wywraca się ORAZ nie gubi
danych po cichu), plus 5 testów zweryfikowanych mutacyjnie. Zero regresji.

Task 6: complete (commits 751e06b..595e0ed, spec ✅, jakość approved)

Task 7: implementer DONE (commit be923aa) — 68/68, weryfikacja w przeglądarce przez lokalny
serwer HTTP (nie snapshot).

Task 7: recenzja — spec ❌, jakość not approved: 1 Critical, 1 Important. Most `modul()`
potwierdzony empirycznie w OBU środowiskach (pliki uruchomione w `vm` z samym `window`,
bez `require`) — najgroźniejszy scenariusz tego taska jest czysty.

Task 7: Ruling 19 — Critical: `pytaniaDla` nie waliduje `idPoziomu`, tylko ufa generatorowi.
Ortografia i angielski zwracają `[]`, ale `matematyka.generuj` cicho fallbackuje na
`MNOZNIKI.trudne` i zwraca pełnowartościowo wyglądające pytania. To gorsze niż zamrożony
ekran, przed którym guard miał chronić: zamrożenie widać, a tu literówka po cichu uruchamia
rundę z niewłaściwym materiałem. Rozstrzygam: walidacja w `pytaniaDla` względem
`poziomyDla(tryb)`, czyli w jednym punkcie kontroli, zamiast łatania fallbacku w generatorze.
Koszt pomyłki: dziecko w „Rozgrzewce" dostaje mnożenie przez 6–9 i nikt się nie orientuje.

Task 7: Ruling 20 — Important: ważenie mylonych słówek w `dane/slowka.js` tylko SORTUJE pulę,
nie zwiększa częstości. Recenzent odtworzył: słówko z 5 błędami pojawia się 1 raz na 40 pytań,
identycznie jak każde inne. To mechanizm „pierwsze", nie „częściej" — czyli sedno gry
w trybie angielskim praktycznie nie działa. Ta sama klasa błędu została naprawiona w Tasku 3
dla matematyki i PRZESZŁA przez recenzję Tasku 5, bo tamten test sprawdzał tylko, czy wagi
nie łamią zakresu, a nie czy w ogóle działają. Rozstrzygam: naprawiamy tutaj, mimo że plik
jest spoza commita Tasku 7 — to nie kosmetyka, tylko główny mechanizm dydaktyczny, a ten task
jako pierwszy ćwiczy tę ścieżkę end-to-end i to on defekt odsłonił. Odkładanie na osobny task
znaczyłoby wydanie gry z martwą funkcją.
Koszt pomyłki: syn powtarza słówka, które już umie, zamiast tych, które myli.

Task 7: fix round 1/5 (2 addressed, 0 open; commit c98bba8) — 71/71. Re-recenzja zmierzyła
częstości zamiast czytać kod: mylone słówko 100/300 (było 2/300), proporcjonalność przy
wagach 100:1 daje stosunek 36.8 (nie binarne), ważone słówko z rozdziału 1 nie wchodzi
do rundy `{tylko:3}` (0/500). Most `modul()` ponownie potwierdzony w kontekście przeglądarki.
Oba findingi zweryfikowane mutacyjnie niezależnie.

Task 7: complete (commits 595e0ed..c98bba8, spec ✅, jakość approved)

Task 8: implementer DONE (commit 684e0ad) — 71/71, obszerna weryfikacja w przeglądarce.
Usunąłem nieśledzony duplikat `tests/app.test 2.js` (identyczny z oryginałem, potwierdzone
przez diff).

Task 8: recenzja — spec ❌, jakość not approved: 2 Critical, 1 Important, 4 Minor.
Najostrzejsza recenzja w projekcie, w całości oparta na pomiarach w działającej przeglądarce.

Task 8: Ruling 21 — Critical F2: w ortografii poprawna odpowiedź to ZAWSZE lewy przycisk,
320/320 pytań we wszystkich trzech zestawach. Dziewięciolatek odkryje to w jednej rundzie
i wygra każdą kolejną, klikając w lewo bez czytania wyrazu — czyli tryb uczy zgadywania
zamiast ortografii, dokładnie tak, jak ostrzega spec §3.2. Dwie niezależne przyczyny:
(a) `reszta = pula.slice(0, ile)` w `dane/ortografia.js` bierze zawsze PIERWSZE `ile` wyrazów,
więc gra pokazuje stale te same 8 z 21, a pierwsze pozycje w danych to same ó/rz/ch;
(b) `js/app.js` renderuje `warianty` w kolejności z danych, bez tasowania.
Rozstrzygam: naprawić obie. Tasowanie przycisków w warstwie UI, nie w danych — istniejące
testy sprawdzają dokładną wartość `warianty` i nie chcę ich osłabiać.
Koszt pomyłki: cała praca merytoryczna nad 63 wyrazami i ich zasadami byłaby bezużyteczna.

Task 8: Ruling 22 — Critical F1: powtórka pomylonego pytania nadal nie działa, a zmiana puli
z 12 na 8 jej nie naprawiła. Diagnoza wykonawcy była trafna, rozwiązanie nie. Recenzent
policzył: pomylone pytanie ląduje na KOŃCU kolejki, więc wraca jako odpowiedź p + N − 1,
a boss ginie najwcześniej po 6–8 odpowiedziach; przy N=8 powrót wypada na 8–13. W rundzie
z jednym błędem powtórka nie następuje NIGDY. Rozstrzygam: naprawa w `js/walka.js` przez
`kolejka.splice(2, 0, ...)` zamiast `push` — powrót po dwóch pytaniach, niezależnie od N
i od życia bossa. Odstęp dwóch pytań celowy: powrót natychmiastowy byłby przepisywaniem
odpowiedzi z ekranu, nie przypomnieniem. Pula wraca do 12, co usuwa skutek uboczny na F2.
Leczenie objawu przez stałą w `app.js` było w niewłaściwej warstwie.
Koszt pomyłki: „najważniejszy element dydaktyczny" ze spec §2 istnieje tylko w kodzie,
a kryterium ukończenia §6.3 jest niespełnione mimo zielonych testów.

Task 8: Ruling 23 — Important F3: powrót do menu w trakcie informacji zwrotnej wyrzuca
dziecko na ekran wyniku 1,2 s później, bo `timerFeedback` nie jest anulowany przy zmianie
ekranu. Poleciłem DWA zabezpieczenia (anulowanie timera + strażnik w callbacku), bo to klasa
błędu, która wraca przy każdej kolejnej ścieżce nawigacji dodanej w przyszłości.
Koszt pomyłki: ekran pojawiający się sam, bez akcji dziecka, dwa ekrany od miejsca, w którym
ono jest.

Task 8: fix round 1/5 (5 addressed, 0 open; commit bb76e25) — 81/81. Re-recenzja zmierzyła
w działającej przeglądarce: powtórka wraca 9/9 rund po dokładnie 3 krokach (porównywane po
`id`, nie po treści — duplikaty w puli mogłyby zmylić); ortografia lewy przycisk 50/54/52%
(było 100%); pokrycie wyrazów 21/21, 22/22, 20/20 (było pierwsze 8); wagi żyją (1000/1000
vs 582/1000). Weryfikacja mutacyjna potwierdzona niezależnie: przywrócenie `push` wywala
dokładnie dwa testy powtórki.

Task 8: minor (deferred): wygrana porzucona w trakcie ostatniej animacji nie zapisuje się
w `postepy.zapiszWalke` — strażnik widoczności ekranu omija też zapis. Statystyka walk dla
ekranu rodzica byłaby zaniżona. Przekazane do T9 w dispatchu.

Task 8: minor (deferred): tasowanie przycisków, `anulujFeedback` i `ekranWalkiWidoczny`
nie mają testów — oba Critical dają się cicho cofnąć bez czerwonego testu. Do triage
w recenzji końcowej.

Task 8: minor (deferred): „← Wróć" na ekranie rozdziałów wraca na sztywno do
`renderujWyborPoziomu('angielski')`. Dziś poprawne (tylko angielski ma rozdziały), ale to
ukryte założenie.

Task 8: complete (commits c98bba8..bb76e25, spec ✅, jakość approved, 3 minory odłożone)

Task 9: implementer DONE (commit f5298f9) — 94/94. Recenzja: spec ✅, jakość approved,
zero Critical/Important. Recenzent zmierzył zgodność liczb z realną grą: 25 odpowiedzi
w logu = 25 w tabeli, co do sztuki. Uszkodzone dane sprawdzone na 7 wariantach — zero wywrotek.

Task 9: Ruling 24 — moje polecenie naprawcze (b) było BŁĘDNE i wykonawca słusznie odmówił
dosłownego wykonania. Poleciłem przenieść `postepy.zapiszWalke` ponad strażnik widoczności
WEWNĄTRZ callbacku, ale `pokazEkran` woła `anulujFeedback()` → `clearTimeout`, więc callback
w ogóle nie startuje — poprawka byłaby pozorna przy zielonych testach, czyli najgorszy możliwy
wynik. Wykonawca zapisuje synchronicznie w `obsluzOdpowiedz`. Recenzent potwierdził niezależnie:
zapis następuje w każdej ścieżce zakończenia i dokładnie raz (5 rund = 5 wpisów; ucieczka
przy zerowym życiu bossa daje szósty). Trzeci raz w tym planie, gdy wykonawca poprawia moje
polecenie naprawcze.
Koszt pomyłki: żaden, bo nie wykonał go bezmyślnie.

Task 9: Ruling 25 — poprawiłem spec §4: przykład `słówko: bread` był zmyślony, w zestawie
powtórkowym z Picture Dictionary nie ma słowa *bread*. Zastąpiony przykładami z realnych
danych. Koszt pomyłki: kolejny czytelnik szukałby słowa, którego nie ma.

Task 9: minor (deferred): nagłówki tabel łamią się w środku słowa przy 320 px („Wyn/ik",
„Procen/t"). Wiersze danych czytelne. Kosmetyka.

Task 9: minor (deferred): nagłówek „Najczęściej mylone (N)" — N to liczba wyświetlonych
pozycji, uciętych do 10. Przy 30 mylonych pozycjach rodzic zobaczy „(10)" i może odczytać
to jako „10 rzeczy do poprawy" zamiast „10 najgorszych z większej listy". Na ekranie, którego
jedynym zadaniem jest mówić prawdę, to jedyna liczba mogąca wprowadzić w błąd.

Task 9: minor (deferred): `najczestszeBledy` sortuje po LICZBIE pomyłek, nie po odsetku —
pozycja 3/3 błędne ginie pod 4/20. Zgodne z własnym nagłówkiem („najczęściej"), ale odbiorca
pyta „czego syn nie umie", nie „co się powtarza". Zmiana w `postepy.statystyki()`, poza
zakresem T9. Kandydat na następną iterację.

Task 9: minor (deferred): tablica `walki` nie jest czytana przez `statystyki()` i rośnie
w localStorage bez limitu. Bez znaczenia przy jednym dziecku, ale odnotowane.

Task 9: complete (commits bb76e25..f5298f9, spec ✅, jakość approved, 4 minory odłożone)

Task 10: DONE (commit 40f84ea — README). 95/95. Kryteria spec §6: sześć SPEŁNIONE,
kryterium 1 częściowo (desktop i 320 px potwierdzone; `file://` NIEZWERYFIKOWANE).
Kryterium 7 sprawdzone realnie: dopisanie zestawu klasy 3 wyłącznie do `dane/slowka.js`
dało kafel, wybór rozdziałów, rundę w trybie WPISYWANIA (ścieżka dotąd niesprawdzona
na prawdziwych danych) i osobny wiersz na ekranie rodzica.

Task 10: Ruling 26 — usterka U1 znaleziona w prawdziwej rundzie: `morze` i `może` w zestawie
`rz-z` renderują się identycznie jako `mo_e`. Dziecko nie ma jak odgadnąć, o który wyraz
chodzi — w połowie przypadków traci serce bez winy i dostaje zasadę do wyrazu, o który nie
było pytane. Rozstrzygam: naprawić, mimo że to poza zakresem T10 i wymaga cofnięcia się
do Taska 4. Powód: to nie jest zwykły błąd, tylko podważenie zaufania do gry — dziecko
odpowiada dobrze i słyszy, że się myli. Wymagałem testu blokującego CAŁĄ klasę (żadne dwa
wyrazy w zestawie nie mogą renderować się tak samo), nie tylko tego przypadku.
Naprawione, commit 3eb2ac2, 95/95, test zweryfikowany mutacyjnie.

Task 10: Ruling 27 — przy okazji wyszła SŁABSZA klasa tego samego problemu, której nie
przewidziałem: wyrazy, gdzie BŁĘDNY wariant też daje prawdziwe polskie słowo. `l_d` →
`lód`, ale `lud` też istnieje i dziecko je zna; `wa_y` → `waży`, ale `warzy` też. Wykonawca
wykrył to systematycznie (wstawiał zły wariant i sprawdzał, czy powstaje wyraz), podmienił
na `miód` i `ważny`, a `nóż`/`nuż` zostawił świadomie (`nuż` żyje tylko w potocznym „a nuż").
Przyjmuję wszystkie trzy decyzje. Tej klasy NIE da się pokryć testem bez słownika polskiego,
a projekt ma mieć zero zależności — zostaje kontrolą ręczną przy dopisywaniu wyrazów.
Koszt pomyłki: dziecko dostaje pytanie z dwiema poprawnymi odpowiedziami i uczy się, że
nie rozumie zasady, choć rozumie.

Task 10: complete (commits f5298f9..3eb2ac2, kryteria §6 zweryfikowane, 1 niezweryfikowane)

RECENZJA KOŃCOWA CAŁEJ GAŁĘZI (23 commity) — werdykt „nie gotowe", 9 nowych znalezisk.
7000 losowych kliknięć: zero błędów JS, zero stanów bez wyjścia. Statystyki po 44 rundach
zgadzają się z niezależnym dziennikiem co do sztuki (296/296 odpowiedzi, 102/102 błędy).
Triage odłożonych drobiazgów: 2 do naprawy teraz, 5 może zostać, 1 nieaktualny.

Ruling 28 — najpoważniejsze znalezisko końcowe: procenty na ekranie rodzica zawyżone o +11
do +15 pp przy słabym dziecku. Powtórka pomylonego pytania — na które dziecko WŁAŚNIE
zobaczyło odpowiedź — liczyła się jak zwykła odpowiedź. Oba moduły (`walka.js`, `postepy.js`)
były poprawne osobno i oba przeszły recenzję; defekt powstał na ich styku. Błąd największy
dokładnie tam, gdzie ekran ma znaczenie: syn na 30% wyglądał na 44%. Rozstrzygam: naprawić
przed oddaniem, mimo że recenzent nie uznał tego za blokadę. Powód: jedynym zadaniem tego
ekranu jest mówić prawdę, a Aleksandra ma na jego podstawie decydować, czego uczyć syna.
Po naprawie zmierzone niezależnie na 3000 rund/poziom: 30% → 30,8%, 50% → 50,0%, 70% → 70,6%,
90% → 89,8%. Koszt pomyłki: złe decyzje o tym, co ćwiczyć, oparte na zawyżonej liczbie.

Ruling 29 — `morze` nadal miało dwie poprawne odpowiedzi, od drugiej strony niż Ruling 26:
przycisk `ż` daje `może`, słowo, które dziewięciolatek zna lepiej niż odmianę „morze — morski".
Ruling 27 przeczesał zestaw `o-u` i nie wrócił do `rz-z`. Podmienione na `dworzec — dworca`.
Niezależny skan wszystkich 63 wyrazów: zostaje dokładnie jedna kolizja, `nóż → nuż`, świadoma.

Ruling 30 — ekran rodzica pokazywał „Najczęściej mylone (10)" przy 58 mylonych pozycjach,
ukrywając 62% błędów, a sortowanie po LICZBIE błędów chowało to, czego syn nie umie
(7 pozycji z wynikiem 0/2 wypadło poza pierwszą dziesiątkę). Rozstrzygam: „10 z 58",
liczba prób przy każdej pozycji, plus osobna sekcja „Zawsze mylone".

Ruling 31 — „Od początku do N" duplikowało „Tylko rozdział N" przy pierwszym rozdziale
KAŻDEGO zestawu dopisanego wg przykładu z README (wyjątek istniał tylko dla `unit: 0`).
Uogólnione na pierwszy rozdział, niezależnie od numeru.

Ruling 32 — README opisywał w „Znanych usterkach" błąd, który już nie istniał, i podawał
nieaktualną liczbę testów. Dopisane sekcje: „Czego jeszcze nie ma" (dwa brakujące zestawy
ortograficzne i brak odblokowywania poziomów — jedyne dwa rozjazdy ze spec) oraz ostrzeżenie
o dwóch niezależnych kompletach statystyk przy otwieraniu raz z pliku, raz z serwera.

Ruling 33 — po fali poprawek dopisałem sam do README ostrzeżenie, żeby raz wyczyścić postępy
przed pierwszym użyciem. Stare statystyki są zawyżone starą metodą i wymieszałyby się z nowymi;
porównanie „w zeszłym tygodniu 65%, dziś 40%" Aleksandra odczytałaby jako regres syna, a byłaby
to zmiana metody pomiaru. Koszt pomyłki: fałszywy alarm o pogorszeniu dziecka.

Ruling 34 — usunąłem dwa nieśledzone duplikaty plików (`tests/app.test 2.js`,
`dane/ortografia 2.js`), oba bajt w bajt identyczne z oryginałami, potwierdzone przez `diff`.
Nie były ładowane ani uruchamiane, ale pojechałyby razem z katalogiem przy kopiowaniu gry.

RECENZJA FALI POPRAWEK — 11/11 ADDRESSED, werdykt „gotowe do oddania".
Rezydualne: wiersz „0 błędów z 1 próby" na liście mylonych (skutek duplikatów w puli
matematyki, 31/1000 sesji) — kosmetyczny, opisany w README. Sekcja „Zawsze mylone" zapełnia
się dopiero od drugiej rundy — poprawne, ale rodzic po jednym posiedzeniu nie zobaczy nic.

STAN KOŃCOWY: 106/106 testów, 25 commitów, drzewo czyste.
NIEZWERYFIKOWANE: uruchomienie przez `file://` (narzędzia przeglądarkowe blokują protokół;
sprawdzone zastępczo statycznie), zachowanie na fizycznym telefonie, seria „dni z rzędu"
przez wiele dni.

