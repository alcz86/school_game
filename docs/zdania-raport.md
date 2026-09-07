# Zdania z lukami + przelacznik trybu odpowiedzi — raport

Data: 2026-09-07. Baza: `8f3f8e8` (117 przechodzacych testow).

## Co powstalo

| Plik | Zmiana |
|------|--------|
| `dane/zdania.js` | **nowy** — 46 zdan z luka, unity 1–8, API identyczne jak `slowka.js` |
| `js/app.js` | dwa zrodla angielskiego, przelacznik trybu, wlasny wiersz zdan na ekranie rodzica |
| `css/style.css` | styl przelacznika (`.przelacznik-trybu`, `.btn-tryb`) |
| `index.html` | `dane/zdania.js` przed `js/app.js` |
| `tests/zdania.test.js` | **nowy** — 18 testow modulu danych |
| `tests/app.test.js` | +13 testow wpiecia i przelacznika, 2 asercje zaktualizowane (nizej) |

## Dane

46 zdan z `docs/zdania-klasa3-do-zatwierdzenia.md`, wszystkie zatwierdzone.
Numery unitow przepisane z raportu. Zdanie o plaszczu (`I am ___ a coat in winter`)
**nie zostalo dodane** — nie ma go w podreczniku; osobny test to blokuje.

**Rozstrzygniecie projektowe:** dystraktory sa wpisane recznie przy kazdym zdaniu,
a NIE losowane z materialu jak w slowkach. Losowy wyraz z innego zdania czesto bylby
gramatycznie poprawny w luce ("He ___ hiking" przyjmuje i "is", i "isn't"), czyli
pytanie mialoby dwie poprawne odpowiedzi. Kazdy zestaw dystraktorow ma w dokumencie
zrodlowym kolumne `sprawdzenie`.

`id` pytania = `zdania-klasa3:` + pelna tresc zdania. Stabilne i niezalezne od zakresu,
bo tresc jest unikalna (pilnuje tego test) — to samo zdanie ma ten sam klucz statystyk
w rundzie "tylko rozdzial 8" i "od poczatku do 8".

## Przelacznik trybu

- Dwa przyciski nad lista rozdzialow: "Wybor z czterech" / "Wpisywanie", 128×48–61 px.
- Domyslnie tak, jak gra dzialala do tej pory: klasa 2 → wybor, klasa 3+ → wpisywanie.
- Stan w zmiennej modulu (`trybOdpowiedzi`), nie w DOM. Klik przemalowuje tylko
  przyciski — pelny re-render resetowalby przewiniecie listy rozdzialow.
- Resetuje sie do domyslnego przy kazdym wejsciu na ekran rozdzialu: matka prosila
  o wybor **przy kazdej rundzie**, a nie o ustawienie na stale.
- `pytaniaDla(tryb, id, ile, zakres, trybOdpowiedzi)` — 5. argument opcjonalny.
  Pominiety albo spoza `TRYBY_ODPOWIEDZI` → stare zachowanie wg pola `klasa`.
- Delegacja zdarzen na `#gra`, zero inline'owych handlerow (zweryfikowane w DOM).

## Ekran rodzica

Zdania dostaly **wlasny wiersz** — "Klasa 3 — zdania", osobny od "Klasa 3 — slowka".
Wlasnie po to ten poziom powstal: dziecko moze znac kazde slowo z osobna i nie umiec
ich zlozyc; jeden wspolny wiersz by to ukryl. Pomylone zdanie opisuje sie jako
`What ____ you doing? → are`, nie surowym kluczem.

## Testy

`node --test` → **148 zdanych, 0 nieudanych** (117 wyjsciowych + 31 nowych).

**Dwie asercje wyjsciowe zmienione — obie wymuszone przez nowe dane, nie obejscia:**

1. `poziomyDla zwraca poziomy wlasciwe dla trybu` — bylo
   `poziomyDla('angielski').length === slowka.ZESTAWY.length`, jest
   `slowka.ZESTAWY.length + zdania.ZESTAWY.length`. Angielski ma teraz dwa zrodla.
2. `wierszeAngielski rozdziela powtorke...` — grup jest trzy zamiast dwoch, a wiersz
   slowek klasy 3 nazywa sie "Klasa 3 — slowka" (samo "Klasa 3" bylo mylace obok
   "Klasa 3 — zdania").

### Weryfikacja mutacyjna

Na **kopii projektu** w katalogu roboczym (nie przez `git checkout`), piec mutacji:

| Mutacja | Wynik |
|---------|-------|
| usuniete tasowanie opcji w `zbudujPytanie` | ✅ zlapana |
| koercja `Number()` przed sprawdzeniem typu w `numerRozdzialu` | ✅ zlapana |
| wagi liczone z calego zestawu zamiast z zakresu | ✅ zlapana |
| `pytaniaDla` ignoruje jawny tryb odpowiedzi | ✅ zlapana |
| zdania scalone z wierszem slowek klasy 3 | ✅ zlapana |

Kontrola bez mutacji: 148/148.

## Weryfikacja w przegladarce

Lokalny serwer HTTP w katalogu gry, viewport 320×800.

| Sprawdzenie | Wynik |
|---|---|
| "Zdania z lukami · 46 zdan" na liscie poziomow angielskiego | ✅ |
| przelacznik widoczny nad lista rozdzialow, aktywny stan czytelny | ✅ domyslnie "Wpisywanie" dla klasy 3 |
| przelaczanie dziala (klasa + `aria-pressed`) | ✅ |
| runda zdan w trybie WYBORU | ✅ cztery przyciski, poprawna wsrod nich |
| kolejnosc opcji zmienna miedzy pytaniami | ✅ poprawna trafiala na pozycje 0, 1 i 2 |
| ta sama runda w trybie WPISYWANIA | ✅ pole tekstowe, zero przyciskow |
| przelacznik na slowkach ("Klasa 3" → "Wybor z czterech") | ✅ cztery przyciski zamiast pola |
| pelna runda do pokonania bossa | ✅ "Potwor pokonany!", zycie 10→0 |
| wyjasnienie po bledzie | ✅ 3,24 s, tresc: `Prawie! Poprawnie: are` + zasada |
| ekran rodzica: osobny wiersz zdan | ✅ "Klasa 3 — zdania 6/8 75%" obok "Klasa 3 — slowka" |
| ekran rodzica: czytelne opisy pomylek | ✅ `What ____ you doing? → are` |
| 320 px bez przewijania poziomego | ✅ na wszystkich ekranach |
| konsola | ✅ zero bledow |
| brak inline'owych handlerow | ✅ sprawdzone w `innerHTML` |

Sprawdzono osobno odpowiedzi z apostrofem (`aren't`, `isn't`) — przyciski i porownanie
dzialaja poprawnie.

## Poprawka znaleziona w przegladarce

Ekran wyboru rozdzialu mial na sztywno naglowek "Ktore **slowka** cwiczymy?" — na
zestawie zdan to nieprawda. Teraz naglowek zalezy od modulu (`naglowekRozdzialow`),
z testem.

## Watpliwosci i rzeczy do decyzji

1. **`BRAK_MATERIALU` = "Ten rozdzial nie ma jeszcze slowek"** — komunikat zostal
   nietkniety, wiec na zestawie zdan powie "slowek". W praktyce nieosiagalny (kazdy
   z 8 rozdzialow ma zdania) i jest przedmiotem istniejacego testu, wiec nie ruszalem.
2. **Czas 3,2 s na przeczytanie** — wystarczy na krotkie zdanie z zasada, ale przy
   najdluzszych ("Are you playing tennis? No, I ____ not." + wyjasnienie) dziewieciolatek
   moze nie zdazyc. Rozwazyc czas zalezny od dlugosci tekstu, jesli syn bedzie narzekal.
3. **Punkty "DO POTWIERDZENIA" z dokumentu zrodlowego zostaja otwarte** — zwlaszcza
   przypisanie strony 83 do unitu 8 (przyjete bez naglowka unitu na zdjeciu). Jesli to
   inny unit, poprawka to zmiana pola `unit` w 5 pozycjach.
4. **Odznaka po wygranej** dla angielskiego to nadal "🏅 Mistrz slowek", takze po
   rundzie zdan. Do rozwazenia osobna odznaka.
5. **Reset przelacznika przy kazdym wejsciu na ekran rozdzialu** to moja interpretacja
   "wyboru przy kazdej rundzie". Jesli syn woli, zeby gra pamietala jego wybor miedzy
   rundami, to zmiana jednej linii.
