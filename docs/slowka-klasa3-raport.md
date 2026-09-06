# Słówka klasa 3 — raport z wdrożenia

**Data:** 2026-09-06
**Źródło:** `docs/slowka-klasa3-do-zatwierdzenia.md` (157 pozycji, zatwierdzone przez matkę)
**Zmienione pliki:** `dane/slowka.js`, `tests/slowka.test.js` — i nic więcej.

---

## Co weszło do gry

| Zestaw | `id` | `klasa` | Rozdziały | Słów |
|---|---|---|---|---|
| Klasa 3 | `klasa3` | 3 | 1–8 (po 14) | **112** |
| Klasa 3 — święta i okazje | `klasa3-swieta` | 3 | 1 Christmas (6), 2 Maths Day (10), 3 St Patrick's (6) | **22** |

Razem 134 z 157 pozycji listy. Brakujące 23 to cały unit 0 — pominięty decyzją matki.

## Zrealizowane decyzje matki

1. **Unit 0 pominięty w całości** (23 pozycje, 18 z nich to dokładna powtórka z `klasa2-powtorka`).
   Przy okazji znika jedyna realna kolizja polskich haseł: `take photos` (kl. 3) vs
   `take pictures` (kl. 2, unit 8) — oba „robić zdjęcia". W trybie wpisywania dziecko
   odpowiadałoby poprawnie i traciło serce.
2. **`tea` = „podwieczorek"** (brytyjskie afternoon tea, posiłek — nie napój).
3. **`dinner` = „kolacja"** zamiast „obiad" — żeby nie mylił się z `have lunch` = „jeść obiad"
   z klasy 2. Ryzyko opisane w sekcji KOLIZJE źródła tym samym znika.

Wszystkie trzy decyzje są udokumentowane komentarzem bezpośrednio w `dane/slowka.js`,
razem z uzasadnieniem — żeby ktoś ich później nie „poprawił".

## Struktura — dlaczego jeden zestaw, nie osiem

Rozdziały 1–8 są **jednym** zestawem `klasa3`. Tryb zakresu `{ do: N }` („od początku do N")
filtruje w obrębie jednego zestawu, więc osiem osobnych zestawów zlikwidowałoby powtórkę
narastającą — czyli główny powód, dla którego ta funkcja powstała.

Sekcje sezonowe są **osobnym** zestawem, bo nie należą do progresji rozdziałów i nie powinny
wpadać do rundy „od początku do rozdziału 5". Numery `unit` 1–3 są nasze (książka ich nie
nadaje), po jednym na okazję, żeby wybór rozdziału miał sens.

Zestaw `klasa3` startuje od rozdziału 1 (nie ma unitu 0), więc opcja „od początku do N"
pojawia się dopiero przy rozdziale 2 — przy pierwszym rozdziale gra ją ukrywa celowo,
bo dublowałaby „tylko rozdział 1". Zachowanie potwierdzone w przeglądarce.

`klasa: 3` przełącza rundę w tryb wpisywania z klawiatury — potwierdzone realnie, nie tylko
z kodu.

## Nowe testy (5)

1. **Brak kolizji polskich haseł przy `klasa >= 3`** — sprawdza wewnątrz zestawu *i* między
   zestawami klasy 3, komunikat wskazuje oba kolidujące słowa (`zestaw:en` vs `zestaw:en`).
   Test został zweryfikowany przez podłożenie sztucznej kolizji („Kolacja " vs `dinner`) —
   wykrywa ją, więc nie jest pusty.
2. **`klasa3` ma dokładnie rozdziały 1–8**, każdy niepusty.
3. **`klasa3-swieta` istnieje, jest osobny** i nie dubluje `en` z `klasa3`.
4. **Komplet `pl` / `en` / całkowity `unit`** dla wszystkich zestawów klasy 3+ (jawnie, mimo że
   trzy istniejące testy iterują po całej tablicy `ZESTAWY` i też to pokrywają).
5. **Generator klasy 3** — tryb wpisywania nie podaje wariantów, zakresy `{ do: 3 }` i
   `{ tylko: 8 }` są respektowane.

Istniejący test na duplikaty `en` w obrębie zestawu iteruje po `s.ZESTAWY`, więc nowe zestawy
obejmuje bez zmian — nie było czego rozszerzać.

## Testy

`node --test` (bez argumentu): **111 pass, 0 fail** — 106 istniejących + 5 nowych.

## Weryfikacja w przeglądarce

Lokalny serwer `python3 -m http.server` w katalogu gry, `http://localhost:8781/`.

- ✅ Oba nowe zestawy na liście poziomów: „Klasa 3 — 112 słówek", „Klasa 3 — święta i okazje — 22 słówek"
- ✅ `Klasa 3`: rozdziały 1–8; „Od początku do N" od rozdziału 2 (przy rozdziale 1 ukryte)
- ✅ Runda startuje w trybie **wpisywania** (pole `#pole-odp` + OK, brak `.warianty`)
- ✅ Pełna runda „Od początku do 4" przejdzie do końca: 6 poprawnych, combo ×3, **„Potwór pokonany! 🎉"**
- ✅ Zestaw świąteczny też startuje, „Tylko Rozdział 2" daje liczebniki (osiemdziesiąt → eighty)
- ✅ Ekran rodzica (📊): osobny wiersz „Angielski / Klasa 3" oraz wiersz „Klasa 3" w tabeli
  „powtórka a nowy materiał", niezależny od „Powtórka (klasa 2)"
- ✅ Konsola bez błędów i ostrzeżeń

## Wątpliwości i rzeczy do decyzji

1. **`fish` ma dwa polskie hasła w dwóch zestawach** — „ryby" (klasa 2, unit 5) i „łowić ryby"
   (klasa 3, unit 8). To **nie** jest kolizja (różne `pl`, ta sama odpowiedź), gra nie uzna
   poprawnej odpowiedzi za błąd. Zostawione świadomie, zgodnie ze źródłem.
2. **Klawisz Enter w trybie wpisywania** — w `js/app.js` jest handler `keydown` na Enter, ale
   przy syntetycznym naciśnięciu z automatu odpowiedź nie zatwierdziła się; klik w OK działa
   za każdym razem. Nie wykluczam, że to artefakt sterowania przeglądarką, a nie usterka gry.
   **Nie ruszałem tego** — to plik poza zakresem zadania. Warto sprawdzić palcem na tablecie:
   jeśli Enter faktycznie nie działa, to osobny defekt do zgłoszenia.
3. **„wstążka gimnastyczna" i „peklowana wołowina z kapustą"** są długie do wpisania dla
   9-latka w trybie klawiaturowym. Zostawione zgodnie z zatwierdzoną listą, ale jeśli
   dziecko będzie się frustrować, to pierwsi kandydaci do skrócenia.
4. **Rubryki „English+" ze stron lekcji** (`doctor's surgery`, `fish fingers`, `packed lunch`…)
   nie są objęte — to druga runda przepisywania ze zdjęć, zgodnie z zastrzeżeniem w źródle.
