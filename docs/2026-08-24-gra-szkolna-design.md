# Gra szkolna „Pojedynek z Potworem" — specyfikacja

**Data:** 2026-08-24
**Dla:** syn, początek klasy 3 (wrzesień 2026)
**Cel:** ćwiczenie i powtórka trzech obszarów szkolnych — tabliczka mnożenia/dzielenia,
ortografia polska, słownictwo angielskie — w formie, którą dziecko uruchamia samo i chce
do niej wracać.

---

## 1. Kształt techniczny

Statyczna strona otwierana z pliku (`file://`) lub z prostego serwera. Bez frameworków,
bez build stepu, bez internetu, bez backendu. Otwarcie `index.html` uruchamia grę na
laptopie i na telefonie.

```
gra-szkolna/
  index.html
  css/style.css
  js/
    app.js          — router ekranów, stan gry
    walka.js        — mechanika bossa (HP, serca, combo)
    postepy.js      — zapis/odczyt localStorage, statystyki
  dane/
    matematyka.js   — generator działań wg poziomu
    ortografia.js   — wyrazy z lukami + zasady
    slowka.js       — zestawy słówek angielskich
  docs/
```

Rozdział `dane/` od `js/` jest celowy: dopisanie nowego unitu ze słówek albo nowej listy
wyrazów ortograficznych to edycja jednego pliku danych, bez dotykania logiki gry.

Brak zależności zewnętrznych. Żadne dane nie opuszczają urządzenia.

## 2. Mechanika wspólna — pojedynek z bossem

Jedna mechanika obsługuje wszystkie trzy tryby; zmienia się tylko źródło pytań.

| Element | Zasada |
|---|---|
| Boss | Ma pasek życia (np. 10 trafień). Pokonanie = koniec rundy, wygrana. |
| Gracz | 3 serca. Utrata wszystkich = koniec rundy, przegrana (bez dramatyzowania). |
| Poprawna odpowiedź | Cios w bossa. |
| Błędna odpowiedź | Utrata serca + pokazanie poprawnej odpowiedzi z krótkim wyjaśnieniem. |
| Combo | 3 poprawne z rzędu → cios ×2; 5 z rzędu → cios ×3. Błąd zeruje combo. |
| Powtórka błędu | Pytanie, na które padła zła odpowiedź, wraca do kolejki tej samej rundy. |
| Postęp | Pokonany boss odblokowuje następny poziom + przyznaje odznakę. |

**Bez timera.** Combo nagradza skupienie i serię, nie szybkość. Presja czasu w tym wieku
częściej blokuje niż motywuje. Timer może dojść później jako opcja w ustawieniach.

Powtórka błędu w tej samej rundzie jest tu najważniejszym elementem dydaktycznym — to ona
zamienia grę w naukę, a nie w test.

## 3. Trzy tryby

### 3.1 Tabliczka mnożenia i dzielenia

Działania generowane, nie listowane. Poziomy (kolejno odblokowywane):

1. `×2, ×5, ×10` — rozgrzewka, materiał klasy 2
2. `×3, ×4` — materiał klasy 2
3. `×6, ×7, ×8, ×9` — trudne przypadki, główny cel klasy 3
4. `dzielenie` w zakresie 100
5. `mieszane` — mnożenie i dzielenie na przemian

Odpowiedź wpisywana klawiaturą numeryczną na ekranie (działa na telefonie bez klawiatury
systemowej). Generator waży losowanie: działania wcześniej mylone pojawiają się częściej.

### 3.2 Ortografia polska

Wyraz z luką, np. `kr_l`. Dwa duże przyciski z wariantami (`ó` / `u`). Po odpowiedzi —
niezależnie czy dobra, czy zła — krótka zasada, np.:

> **król** — *ó* wymienia się na *o*: **królowa**

Zestawy: `ó/u`, `rz/ż`, `ch/h`, `ą/ę`, `wielka litera`.
Każdy wpis w `ortografia.js` to: wyraz, pozycja luki, warianty, poprawny, zasada.

Zasada przy każdym wyrazie jest wymogiem, nie ozdobą — bez niej tryb uczy zgadywania
zamiast ortografii.

### 3.3 Angielski

Słówka podzielone na **zestawy z etykietą**, nie jedną listę:

- `Klasa 2 — powtórka` — z Picture Dictionary (podręcznik klasy 2, zdjęcia w Google Photos)
- `Klasa 3 — Unit 1`, `Unit 2`, … — dopisywane w trakcie roku szkolnego

Formaty pytań wg poziomu:
- poziom 1–2: PL → EN, wybór z 4 odpowiedzi
- poziom 3+: PL → EN, wpisywanie z klawiatury (tolerancja wielkości liter i spacji)

Dodanie nowego unitu = dopisanie jednego bloku w `slowka.js`.

**Źródło treści na start:** 5 stron Picture Dictionary z podręcznika klasy 2. Angielskie
słowa przepisywane ze zdjęć; **polskie tłumaczenia dopisywane przez Claude'a i przedstawiane
Aleksandrze do zatwierdzenia przed wrzuceniem do gry** — przy słowach wieloznacznych
(*rubber*, *coach*) obrazek w książce rozstrzyga znaczenie, a przepisanie może chybić.
Strony nieczytelne na zdjęciu są zgłaszane wprost, nie zgadywane.

## 4. Ekran postępów dla rodzica

Wejście przez małą, nierzucającą się w oczy ikonę — nie jest ukryty hasłem, ale też nie
jest częścią rozgrywki.

Pokazuje:
- % poprawnych odpowiedzi w każdym trybie i na każdym poziomie
- **10 najczęściej mylonych pozycji** z nazwą wprost: `7×8`, `rz/ż: żaba`, `słówko: bread`
- osobno wyniki dla zestawu „Klasa 2 — powtórka" i zestawów klasy 3 — widać, czy stary
  materiał się trzyma, gdy dochodzi nowy
- liczbę dni z rzędu, w których syn grał

Dane w `localStorage` przeglądarki. Nic nie jest wysyłane. Reset dostępny z tego ekranu.

## 5. Świadomie poza zakresem pierwszej wersji

Dźwięk. Animowane sprite'y potworów (na start CSS + prosta grafika/emoji). Tryb
dwuosobowy. Eksport statystyk do pliku. Timer. Konta wielu dzieci. Synchronizacja między
urządzeniami.

Każde z tych da się dołożyć później bez przebudowy — mechanika walki, dane i postępy są
rozdzielone.

## 6. Kryteria ukończenia

1. Otwarcie `index.html` uruchamia grę bez błędów w konsoli, na desktopie i na szerokości
   telefonu.
2. Każdy z trzech trybów da się przejść od wyboru poziomu do pokonania bossa.
3. Błędna odpowiedź odejmuje serce, pokazuje poprawną odpowiedź i wraca w tej samej rundzie.
4. Combo ×2 włącza się po 3 poprawnych z rzędu, ×3 po 5, i zeruje się po błędzie.
5. Ekran rodzica pokazuje niezerowe statystyki po rozegraniu rundy i przeżywa odświeżenie
   strony.
6. Tryb angielskiego ma wypełniony zestaw „Klasa 2 — powtórka" z tłumaczeniami
   zatwierdzonymi przez Aleksandrę.
7. Dopisanie nowego zestawu słówek wymaga edycji wyłącznie `dane/slowka.js`.
