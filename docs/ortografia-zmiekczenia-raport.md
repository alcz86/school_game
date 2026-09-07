# Ortografia — zestawy zmiękczeń (ś/si, ć/ci, ń/ni, ź/zi, dź/dzi)

Data: 2026-09-07
Zmienione pliki: `dane/ortografia.js`, `tests/ortografia.test.js` — **tylko te dwa.**
Mechanizm gry nie wymagał żadnej zmiany: obsługa wielo-znakowych wariantów działała
już dla `rz`/`ch`, a trzyznakowe `dzi` przeszło przez nią bez poprawek.

Testy: **111 → 113**, wszystkie zielone.

---

> ## ⚠️ TEN RAPORT MA DWIE WARSTWY — CZYTAJ ANEKS
>
> Sekcje **1–7 poniżej opisują stan z pierwszej rundy**, czyli **pięć osobnych
> zestawów** (`s-si`, `c-ci`, `n-ni`, `z-zi`, `dz-dzi`). **Ten stan już nie istnieje.**
> Jeszcze tego samego dnia zestawy zostały **scalone w jeden zestaw `zmiekczenia`**,
> a dane pod tym zmieniono. Co dokładnie jest już nieprawdą w sekcjach 1–7:
>
> | Sekcja | Co mówi | Jak jest naprawdę |
> |---|---|---|
> | 2 | pięć zestawów `s-si` … `dz-dzi`, każdy z własnym `id` i podpisem | jeden zestaw `zmiekczenia`, nazwa „Zmiękczenia", opis `ś/si · ć/ci · ń/ni · ź/zi · dź/dzi` |
> | 2 | `warianty` to pole ZESTAWU | `warianty` to pole **KAŻDEGO WYRAZU** (patrz Aneks §2) |
> | 2 | wyraz `cień` na liście `n-ni` | **usunięty** — kolidował z `cieńszy`/renderem po scaleniu (Aneks §4) |
> | 2 | liczebności per zestaw (20 + 19 + 19 + 20 + 19) | **97 wyrazów** w jednej grupie po usunięciach |
> | 5 | „111 → 113 testów" | to była tylko pierwsza runda; aktualną liczbę podaje Aneks §5 |
> | 6 | weryfikacja przeglądarkowa na pięciu kaflach | jeden kafel „Zmiękczenia" (Aneks §7) |
>
> **Sekcje 1 i 3 (reguła pozycyjna, wyrazy odrzucone) pozostają aktualne** —
> scalenie nie zmieniło ani reguły, ani listy odrzuceń.
>
> Źródłem prawdy o obecnym stanie jest **Aneks** na końcu pliku oraz `dane/ortografia.js`.

---

## 1. Zasada, której uczą te zestawy

W odróżnieniu od `ó/u` (gdzie trzeba pamiętać listę) ta reguła jest **pozycyjna** —
dziecko nie zapamiętuje wyrazów, tylko patrzy na literę **zaraz za luką**:

| Co stoi po luce | Piszemy | Przykład |
|---|---|---|
| samogłoska `a ą e ę o ó u` | forma dwu-/trzyznakowa: `si ci ni zi dzi` | s**io**stra, c**io**cia, n**ie**bo, z**ie**mia, dz**ia**dek |
| spółgłoska albo koniec wyrazu | forma z kreską: `ś ć ń ź dź` | **ś**lad, **ć**ma, ko**ń**cówka, **ź**le, **dź**wig |

Uwaga: `i` **nie** jest tu samogłoską otwierającą regułę — połączenie `sii` w polszczyźnie
nie występuje. `y` też nie. Test pozycyjny to wymusza.

Każda `zasada` w danych nazywa regułę wprost, np.
`przed samogłoską piszemy ci: ci + o — ciocia`, `na końcu wyrazu piszemy ć: być`.

---

## 2. Pełne listy wyrazów

### `s-si` — „ś czy si" (20 wyrazów: si = 9, ś = 11)

| Wyraz | Renderuje się | Poprawny | Zasada |
|---|---|---|---|
| siostra | `_ostra` | si | przed samogłoską piszemy si: si + o |
| siano | `_ano` | si | przed samogłoską piszemy si: si + a |
| siedem | `_edem` | si | przed samogłoską piszemy si: si + e |
| siatka | `_atka` | si | przed samogłoską piszemy si: si + a |
| sierpień | `_erpień` | si | przed samogłoską piszemy si: si + e |
| osiem | `o_em` | si | przed samogłoską piszemy si: si + e |
| jesień | `je_eń` | si | przed samogłoską piszemy si: si + e |
| prosię | `pro_ę` | si | przed samogłoską piszemy si: si + ę |
| gąsienica | `gą_enica` | si | przed samogłoską piszemy si: si + e |
| ślad | `_lad` | ś | przed spółgłoską piszemy ś: ś + l |
| śnieg | `_nieg` | ś | przed spółgłoską piszemy ś: ś + n |
| świeca | `_wieca` | ś | przed spółgłoską piszemy ś: ś + w |
| świat | `_wiat` | ś | przed spółgłoską piszemy ś: ś + w |
| ślimak | `_limak` | ś | przed spółgłoską piszemy ś: ś + l |
| śmiech | `_miech` | ś | przed spółgłoską piszemy ś: ś + m |
| środa | `_roda` | ś | przed spółgłoską piszemy ś: ś + r |
| myśl | `my_l` | ś | przed spółgłoską piszemy ś: ś + l |
| wiśnia | `wi_nia` | ś | przed spółgłoską piszemy ś: ś + n |
| coś | `co_` | ś | na końcu wyrazu piszemy ś |
| ktoś | `kto_` | ś | na końcu wyrazu piszemy ś |

### `c-ci` — „ć czy ci" (19 wyrazów: ci = 10, ć = 9)

| Wyraz | Renderuje się | Poprawny | Zasada |
|---|---|---|---|
| ciocia | `_ocia` | ci | przed samogłoską piszemy ci: ci + o |
| ciepło | `_epło` | ci | przed samogłoską piszemy ci: ci + e |
| ciasto | `_asto` | ci | przed samogłoską piszemy ci: ci + a |
| ciało | `_ało` | ci | przed samogłoską piszemy ci: ci + a |
| ciemno | `_emno` | ci | przed samogłoską piszemy ci: ci + e |
| ciężko | `_ężko` | ci | przed samogłoską piszemy ci: ci + ę |
| ciekawy | `_ekawy` | ci | przed samogłoską piszemy ci: ci + e |
| cień | `_eń` | ci | przed samogłoską piszemy ci: ci + e |
| babcia | `bab_a` | ci | przed samogłoską piszemy ci: ci + a |
| kwiecień | `kwie_eń` | ci | przed samogłoską piszemy ci: ci + e |
| ćma | `_ma` | ć | przed spółgłoską piszemy ć: ć + m |
| ćwiczyć | `_wiczyć` | ć | przed spółgłoską piszemy ć: ć + w |
| być | `by_` | ć | na końcu wyrazu piszemy ć |
| pić | `pi_` | ć | na końcu wyrazu piszemy ć |
| jeść | `jeś_` | ć | na końcu wyrazu piszemy ć |
| grać | `gra_` | ć | na końcu wyrazu piszemy ć |
| czytać | `czyta_` | ć | na końcu wyrazu piszemy ć |
| płacić | `płaci_` | ć | na końcu wyrazu piszemy ć |
| śpiewać | `śpiewa_` | ć | na końcu wyrazu piszemy ć |

### `n-ni` — „ń czy ni" (19 wyrazów: ni = 11, ń = 8)

| Wyraz | Renderuje się | Poprawny | Zasada |
|---|---|---|---|
| niebo | `_ebo` | ni | przed samogłoską piszemy ni: ni + e |
| niebieski | `_ebieski` | ni | przed samogłoską piszemy ni: ni + e |
| niania | `_ania` | ni | przed samogłoską piszemy ni: ni + a |
| niedziela | `_edziela` | ni | przed samogłoską piszemy ni: ni + e |
| niedźwiedź | `_edźwiedź` | ni | przed samogłoską piszemy ni: ni + e |
| koniec | `ko_ec` | ni | przed samogłoską piszemy ni: ni + e |
| konie | `ko_e` | ni | przed samogłoską piszemy ni: ni + e |
| ziemniak | `ziem_ak` | ni | przed samogłoską piszemy ni: ni + a |
| kuchnia | `kuch_a` | ni | przed samogłoską piszemy ni: ni + a |
| śniadanie | `ś_adanie` | ni | przed samogłoską piszemy ni: ni + a |
| pieniądze | `pie_ądze` | ni | przed samogłoską piszemy ni: ni + ą |
| bańka | `ba_ka` | ń | przed spółgłoską piszemy ń: ń + k |
| słońce | `sło_ce` | ń | przed spółgłoską piszemy ń: ń + c |
| tańczyć | `ta_czyć` | ń | przed spółgłoską piszemy ń: ń + c |
| łańcuch | `ła_cuch` | ń | przed spółgłoską piszemy ń: ń + c |
| skończyć | `sko_czyć` | ń | przed spółgłoską piszemy ń: ń + c |
| końcówka | `ko_cówka` | ń | przed spółgłoską piszemy ń: ń + c |
| dzień | `dzie_` | ń | na końcu wyrazu piszemy ń |
| ogień | `ogie_` | ń | na końcu wyrazu piszemy ń |

### `z-zi` — „ź czy zi" (20 wyrazów: zi = 10, ź = 10)

| Wyraz | Renderuje się | Poprawny | Zasada |
|---|---|---|---|
| ziemia | `_emia` | zi | przed samogłoską piszemy zi: zi + e |
| zielony | `_elony` | zi | przed samogłoską piszemy zi: zi + e |
| zieleń | `_eleń` | zi | przed samogłoską piszemy zi: zi + e |
| ziewać | `_ewać` | zi | przed samogłoską piszemy zi: zi + e |
| ziarno | `_arno` | zi | przed samogłoską piszemy zi: zi + a |
| ziemniak | `_emniak` | zi | przed samogłoską piszemy zi: zi + e |
| koziołek | `ko_ołek` | zi | przed samogłoską piszemy zi: zi + o |
| poziomka | `po_omka` | zi | przed samogłoską piszemy zi: zi + o |
| gałęzie | `gałę_e` | zi | przed samogłoską piszemy zi: zi + e |
| buzia | `bu_a` | zi | przed samogłoską piszemy zi: zi + a |
| źle | `_le` | ź | przed spółgłoską piszemy ź: ź + l |
| źrebak | `_rebak` | ź | przed spółgłoską piszemy ź: ź + r |
| źródło | `_ródło` | ź | przed spółgłoską piszemy ź: ź + r |
| późno | `pó_no` | ź | przed spółgłoską piszemy ź: ź + n |
| groźny | `gro_ny` | ź | przed spółgłoską piszemy ź: ź + n |
| mroźny | `mro_ny` | ź | przed spółgłoską piszemy ź: ź + n |
| bliźniak | `bli_niak` | ź | przed spółgłoską piszemy ź: ź + n |
| wyraźnie | `wyra_nie` | ź | przed spółgłoską piszemy ź: ź + n |
| weź | `we_` | ź | na końcu wyrazu piszemy ź |
| gałąź | `gałą_` | ź | na końcu wyrazu piszemy ź |

### `dz-dzi` — „dź czy dzi" (19 wyrazów: dzi = 11, dź = 8)

| Wyraz | Renderuje się | Poprawny | Zasada |
|---|---|---|---|
| dziadek | `_adek` | dzi | przed samogłoską piszemy dzi: dzi + a |
| dziecko | `_ecko` | dzi | przed samogłoską piszemy dzi: dzi + e |
| dziewczyna | `_ewczyna` | dzi | przed samogłoską piszemy dzi: dzi + e |
| dziura | `_ura` | dzi | przed samogłoską piszemy dzi: dzi + u |
| dzień | `_eń` | dzi | przed samogłoską piszemy dzi: dzi + e |
| dziesięć | `_esięć` | dzi | przed samogłoską piszemy dzi: dzi + e |
| dziewięć | `_ewięć` | dzi | przed samogłoską piszemy dzi: dzi + e |
| niedziela | `nie_ela` | dzi | przed samogłoską piszemy dzi: dzi + e |
| poniedziałek | `ponie_ałek` | dzi | przed samogłoską piszemy dzi: dzi + a |
| widzieć | `wi_eć` | dzi | przed samogłoską piszemy dzi: dzi + e |
| bardziej | `bar_ej` | dzi | przed samogłoską piszemy dzi: dzi + e |
| dźwig | `_wig` | dź | przed spółgłoską piszemy dź: dź + w |
| dźwięk | `_więk` | dź | przed spółgłoską piszemy dź: dź + w |
| dźwigać | `_wigać` | dź | przed spółgłoską piszemy dź: dź + w |
| niedźwiedź | `nie_wiedź` | dź | przed spółgłoską piszemy dź: dź + w |
| wiedźma | `wie_ma` | dź | przed spółgłoską piszemy dź: dź + m |
| idź | `i_` | dź | na końcu wyrazu piszemy dź |
| jedź | `je_` | dź | na końcu wyrazu piszemy dź |
| wejdź | `wej_` | dź | na końcu wyrazu piszemy dź |

Wszystkie zestawy spełniają wymóg ≥ 15 wyrazów i ≥ 5 wystąpień każdego wariantu.

---

## 3. Wyrazy ODRZUCONE

### 3a. Pozorne zmiękczenia — `i` jest pełną samogłoską

Wyglądają jak zmiękczenia, ale nie mają konkurencyjnej pisowni (`źma`, `ńc`, `ćsza`
nie istnieją). Dziecko nigdy się na nich nie pomyli, więc niczego nie uczą — a przy
okazji łamią regułę pozycyjną, bo po `zi`/`ci`/`si` stoi w nich spółgłoska.

| Odrzucony | Dlaczego |
|---|---|
| zima, zimno | `zi` + spółgłoska `m` — `i` to samogłoska |
| nic, nigdy | `ni` + spółgłoska `c`/`g` |
| cisza, cicho, cichy | `ci` + spółgłoska `s`/`ch` |
| siła, posiłek | `si` + spółgłoska `ł` |
| siwy | `si` + spółgłoska `w` |
| dzik, dziś | `dzi` + spółgłoska `k`/`ś` |
| godzina, urodziny | `dzi` + spółgłoska `n` |
| chodzić, sadzić | `dzi` + spółgłoska `ć` |
| gęsi, musi, chodzi (jako hasła) | forma dwuznakowa na końcu wyrazu |

`ciasny` z pytania — **przyjęty byłby poprawnie** (`ci` + `a`, samogłoska), ale nie
został dodany: `ciasto` i `ciało` niosą tę samą regułę i są bliższe dziewięciolatkowi.

### 3b. Zły wariant tworzy prawdziwe polskie słowo

To ta sama usterka, która przeszła przez dwie recenzje w zestawie `rz/ż`
(`morze` → `może`). Przy `ś/ć/ń/ź/dź` **na końcu wyrazu** zły wariant bardzo często
daje realną formę liczby mnogiej — dziecko odpowiedziałoby sensownie i straciło serce.

| Odrzucony | Zły wariant daje | Co to jest |
|---|---|---|
| gęś | gęsi | l. mn. — prawdziwe słowo |
| koń | koni | dopełniacz l. mn. |
| słoń | słoni | dopełniacz l. mn. |
| kamień | kamieni | dopełniacz l. mn. |
| jesień (jako hasło z `ń`) | jesieni | przypadek zależny |
| dłoń | dłoni | przypadek zależny |
| liść | liści | dopełniacz l. mn. |
| gość | gości | dopełniacz l. mn. |
| kość | kości | dopełniacz l. mn. |
| nić | nici | l. mn. |
| chodź | chodzi | bardzo częsty czasownik |
| śledź | śledzi | dopełniacz l. mn. |
| miedź | miedzi | przypadek zależny |
| łabędź | łabędzi | dopełniacz l. mn. |
| gwóźdź | gwóździ | dopełniacz l. mn. |
| iść | iści | „coś się iści" |
| łoś | łosi | forma zależna / przymiotnik |
| łódź | łódzi ~ łodzi | zbyt bliskie prawdziwemu „łodzi" |
| pięć | pięci | zbyt bliskie „pięciu" |

Zostawione zostały wyłącznie takie zakończenia, gdzie zły wariant nie jest żadnym
polskim słowem: `być→byci`, `pić→pici`, `jeść→jeści`, `grać→graci`, `coś→cosi`,
`ktoś→ktosi`, `weź→wezi`, `gałąź→gałązi`, `dzień→dzieni`, `ogień→ogieni`,
`idź→idzi`, `jedź→jedzi`, `wejdź→wejdzi`.

---

## 4. Skan błędnych wariantów — wynik empiryczny

Przeszedłem **wszystkie 97 nowych wyrazów**, wstawiając w lukę BŁĘDNY wariant
i sprawdzając, czy powstaje prawdziwe polskie słowo.

**Wynik: 0 kolizji.** Żadna z 97 form nie jest polskim wyrazem.

Potwierdza to przewidywanie z zadania — w tej kategorii `ś` przed samogłoską i `si`
przed spółgłoską po prostu w polszczyźnie nie występują, więc zły wariant daje
sekwencję niemożliwą (`śostra`, `ćocia`, `źemia`, `dźadek`) albo rozbitą
(`silad`, `cima`, `banika`, `zirebak`, `dziwig`). Ale — zgodnie z lekcją z `rz/ż` —
zostało to **sprawdzone, nie założone**; ryzyko było realne i skupione w podgrupie
„kreska na końcu wyrazu", z której 19 wyrazów odrzucono (sekcja 3b).

Sprawdzone też: **brak kolizji renderowania** — w żadnym zestawie dwa różne wyrazy
nie dają tej samej treści z luką (pilnuje tego istniejący test, potwierdzone osobno).

---

## 5. Nowe testy

Do `tests/ortografia.test.js` doszły dwa testy (111 → 113):

1. **`sa zestawy zmiekczen s-si, c-ci, n-ni, z-zi, dz-dzi`** — obecność pięciu zestawów.
2. **`zmiekczenia: zasada pozycyjna`** — siatka bezpieczeństwa na pułapkę z sekcji 3a.
   Dla każdego wyrazu w nowych zestawach czyta znak **zaraz za luką** i wymaga:
   - wariant dwu-/trzyznakowy → następny znak ∈ `a ą e ę o ó u` (celowo bez `i` i `y`),
   - wariant z kreską → spółgłoska albo koniec wyrazu.
   Komunikat błędu nazywa wyraz i to, co faktycznie po luce stoi.

### Weryfikacja mutacyjna

Podłożone `zima` do zestawu `z-zi` → test **czerwony**, komunikat:

```
z-zi: "zima" ma "zi", wiec po luce musi stac samogloska (a ą e ę o ó u),
a stoi "m". Czy to na pewno zmiekczenie, a nie pozorne (jak "zima",
gdzie "i" jest pelna samogloska)?
```

Mutacja cofnięta, `node --test` → 113/113 zielone.

---

## 6. Weryfikacja w przeglądarce

Lokalny serwer `python3 -m http.server 8777` w katalogu gry (pliki spoza katalogu
projektu renderują się w narzędziach przeglądarkowych bez skryptów).

- **Lista poziomów ortografii**: 8 pozycji — 3 stare + 5 nowych (`ś czy si`,
  `ć czy ci`, `ń czy ni`, `ź czy zi`, `dź czy dzi`).
- **Pełna runda do pokonania bossa w dwóch zestawach**:
  - `s-si` — 6 trafień, boss 10→0, „Potwór pokonany! 🎉", odznaka „🏅 Mistrz ortografii".
  - `dz-dzi` (trzyznakowy wariant) — boss pokonany; jedna celowo błędna odpowiedź
    zabrała serce i nie zabrała bossowi HP; wyraz wrócił później w rundzie
    (mechanizm wag działa), a ekran wyniku pokazał sekcję „Do powtórki (1)"
    z poprawnie zrenderowanym `_wigać → dź`.
- **Wyjaśnienie po odpowiedzi POPRAWNEJ** (spec §3.2): potwierdzone —
  „Dobrze! 💥 / prosię — przed samogłoską piszemy si: si + ę — prosię".
- **Oba przyciski po obu stronach**: kolejność wariantów zmienia się między
  pytaniami (`si`/`ś` górą i dołem naprzemiennie w obu rozegranych rundach) —
  nie da się wygrać klikając stale w jedno miejsce.
- **Pozostałe trzy zestawy** uruchomione i renderujące poprawnie:
  `c-ci` → `_eń`, `n-ni` → `kuch_a`, `z-zi` → `_elony`.
- **Konsola**: bez błędów i ostrzeżeń przez całą sesję.

---

## 7. Uwagi

- Podpis poziomu dubluje nazwę („ś czy si / ś czy si"), bo `app.js` buduje `opis`
  jako `warianty.join(' czy ')`. To zachowanie **istniejące** — dotyczy tak samo
  `ó czy u` i `ch czy h` — i leży poza dozwolonym zakresem zmian, więc nie ruszałem.
  Warto poprawić osobno.
- Zestawy `ń` przed spółgłoską są zdominowane przez `ń + c` (słońce, tańczyć,
  łańcuch, skończyć, końcówka). To nie błąd — `ń` przed inną spółgłoską niż `c`/`k`
  jest w polszczyźnie rzadkie — ale dobór jest mniej różnorodny niż w pozostałych
  zestawach.

---

# Aneks — scalenie pięciu zestawów w jedną grupę (2026-09-07)

## 1. Decyzja i powód

Zmiana zakresu od matki dziecka: pięć osobnych zestawów zmiękczeń (`s-si`, `c-ci`,
`n-ni`, `z-zi`, `dz-dzi`) staje się **jedną grupą** `zmiekczenia` / „Zmiękczenia".
Powód merytoryczny: wszystkie pięć uczy tej samej reguły pozycyjnej (patrz na literę
za luką), więc mieszanie par w obrębie jednej rundy ćwiczy ją lepiej niż pięć
osobnych przebiegów. Powód praktyczny: ekran wyboru poziomu ma **cztery kafle
zamiast ośmiu**.

## 2. Konsekwencja techniczna — para przycisków należy do WYRAZU

Dotąd `warianty` były polem zestawu i `naPytanie` robiło `zestaw.warianty.slice()`.
W połączonej grupie to nie wystarcza: przy `ciocia` przyciski muszą pokazać `ć`/`ci`,
a przy `ślad` — `ś`/`si`.

- każdy z 97 wyrazów niesie własne `warianty: ['ć', 'ci']` itd.;
- `naPytanie` bierze `(w.warianty || zestaw.warianty).slice()` — **zawsze kopię**,
  bo współdzielona referencja była już raz usterką w tym pliku;
- `o-u`, `rz-z`, `ch-h` zachowują `warianty` na poziomie zestawu — nietknięte.

## 3. Podpis poziomu — wątpliwość #1 z poprzedniej rundy zamknięta

`app.js` budował opis jako `z.warianty.join(' czy ')`, co dla połączonej grupy dałoby
bezsensowny ciąg dziesięciu znaków. Zestawy dostały opcjonalne pole `opis`, a `app.js`
używa `z.opis || z.warianty.join(' czy ')`. Opisy:

| zestaw | opis |
|---|---|
| `o-u` | wymiana ó na o, e — i wyjątki do zapamiętania |
| `rz-z` | rz po spółgłosce i w wymianie na r; ż osobno |
| `ch-h` | ch na końcu wyrazu i w wymianie na sz; h w zapożyczeniach |
| `zmiekczenia` | ś/si · ć/ci · ń/ni · ź/zi · dź/dzi |

**Druga, nieprzewidziana linijka w `app.js`.** Tabela skuteczności dla rodzica robiła
`zestaw.warianty.join('/')`; `zmiekczenia` nie ma tego pola, więc ekran wywalał się na
`undefined`. Dodany strażnik `zestaw && zestaw.warianty ? … : null`. Przy okazji
naprawia też stare wpisy w `localStorage` po nieistniejących już zestawach
(`s-si`, `dz-dzi`) — zweryfikowane w przeglądarce na realnym zapisie postępów.

## 4. Kolizje wykryte przez zaostrzony test — naprawione w danych

Test kolizji treści działa teraz na **całej puli 97 wyrazów** zamiast na pięciu
osobnych, i faktycznie wykrył problemy niewidoczne wcześniej. Żadnego testu nie
złagodzono — poprawione zostały dane.

**A. Kolizja renderowania (ta bolesna dla dziecka):**

| wyrazy | wspólna treść | dlaczego to problem |
|---|---|---|
| `cień` (ci) i `dzień` (dzi) | `_eń` | oba to prawdziwe słowa, ale pokazałyby **różne pary przycisków** dla identycznej luki |

→ `cień` zastąpiony przez `cieszyć`.

**B. Zdublowany wyraz = zdublowany identyfikator pytania.** Cztery wyrazy występowały
w dwóch zestawach naraz z inną luką. Po scaleniu dawały ten sam klucz
`zmiekczenia:<wyraz>`, co psuje wagi postępów i pokrycie losowania:

| wyraz | było | zostaje | zamiennik |
|---|---|---|---|
| `niedziela` | `ni@0` + `dzi@3` | `dzi@3` | `jaskinia` (ni + a) |
| `niedźwiedź` | `ni@0` + `dź@3` | `dź@3` | `nietoperz` (ni + e) |
| `ziemniak` | `ni@4` + `zi@0` | `zi@0` | `zdanie` (ni + e) |
| `dzień` | `ń@4` + `dzi@0` | `dzi@0` | `grudzień` (ń na końcu) |

Pula nadal liczy **97 wyrazów**, wszystkie unikalne i wszystkie unikalne w renderze.

## 5. Testy

`node --test` → **115 testów, 115 pass, 0 fail.**

Zmiany w `tests/ortografia.test.js`:

- **„miesza oba warianty"** — dla `zmiekczenia` sprawdza **każdą z pięciu par osobno**
  (min. 5 wyrazów z formą z kreską i min. 5 z formą dwu-/trzyznakową na parę).
  Liczenie zbiorcze byłoby bezzębne: 90 × `si` i po dwa z reszty by przeszło.
- **nowy test** „kazdy wyraz zmiekczen ma WLASNE warianty, a poprawny do nich nalezy" —
  para musi być jedną z pięciu dozwolonych i musi zawierać `poprawny`; sprawdzane też
  na wygenerowanych pytaniach.
- **nowy test** „warianty z WYRAZU tez sa kopia" — mutacja pytania nie może skazić danych.
- **„zmiekczenia to JEDEN zestaw z opisem"** — zastępuje test pięciu identyfikatorów;
  wymaga 4 kafli, braku starych id, oraz opisu, który nie dubluje nazwy.
- **reguła pozycyjna** — przestawiona na `zmiekczenia`, parę odczytuje z `w.warianty`.
- Testy `o-u`, `rz-z`, `ch-h` przechodzą bez zmian merytorycznych.

## 6. Weryfikacja mutacyjna

Wykonana **na kopii pliku w katalogu roboczym**, nie przez `git checkout` (w
poprzedniej rundzie tak zginęła praca). Każda mutacja cofnięta przez `cp` z kopii,
po przywróceniu ponownie 115/115.

| mutacja | wynik |
|---|---|
| usunięte wszystkie wyrazy z `dź` | ❌ „miesza oba warianty — KAZDA z pieciu par osobno" (1 fail) |
| `siano` dostaje parę `['ć','ci']` | ❌ 3 faile: własne warianty, luka/poprawny, reguła pozycyjna |
| `cieszyć` cofnięte do `cień` | ❌ „zaden wyraz nie renderuje sie identycznie" (1 fail) |

## 7. Weryfikacja w przeglądarce (lokalny serwer `python3 -m http.server`)

- **Cztery pozycje** na liście poziomów, nie osiem. Opis „Zmiękczenia" =
  `ś/si · ć/ci · ń/ni · ź/zi · dź/dzi` — czytelny, niezdublowany.
- **Mieszanie par w jednej rundzie — sedno tej zmiany.** Rozegrane 4 rundy,
  **24 pytania**. Wystąpiły **wszystkie 5 par**. W pojedynczej rundzie (6 pytań do
  pokonania bossa): 3, 4 i 3 różne pary. Przykłady z jednego przebiegu:
  `_asto → ci [ć/ci]`, `_arno → zi [ź/zi]`, `bar_ej → dzi [dź/dzi]`,
  `o_em → si [ś/si]`, `ogie_ → ń [ń/ni]` — **przyciski za każdym razem pokazywały
  parę właściwą dla danego wyrazu**.
- **Pełna runda do pokonania bossa**: „Potwór pokonany! 🏅 Mistrz ortografii",
  trafienia 6, combo 6.
- **Wyjaśnienie po odpowiedzi POPRAWNEJ**: każde z 24 pytań pokazało zasadę, np.
  „Dobrze! 💥 / śnieg — przed spółgłoską piszemy ś: ś + n — śnieg".
- **Kolejność przycisków zmienia się**: zaobserwowane oba układy dla każdej pary
  (`si>ś` i `ś>si`, `ni>ń` i `ń>ni`, `ci>ć` i `ć>ci`, `zi>ź` i `ź>zi`, `dź>dzi`).
- **Ekran postępów dla rodzica** renderuje się poprawnie, także dla starych wpisów
  po zestawach `s-si` / `dz-dzi` z `localStorage`.
- **Konsola bez błędów** na świeżym ładowaniu (jedyny błąd w sesji pochodził z
  zakeszowanej starej wersji `app.js` sprzed poprawki i znika po twardym odświeżeniu).

## 8. Wątpliwości

1. **Druga linijka w `app.js`** (strażnik w tabeli skuteczności) wykracza poza
   „jedną dozwoloną zmianę". Bez niej ekran postępów dla rodzica **wywala się**,
   więc uznałem naprawę za konieczną — do świadomej akceptacji.
2. **Cztery wyrazy zniknęły z puli w jednej roli** (`niedziela`, `niedźwiedź`,
   `ziemniak`, `dzień` uczą teraz tylko jednej ze swoich par, nie dwóch) i `cień`
   zniknął całkiem. Alternatywą byłoby dopuszczenie dwóch pytań o ten sam wyraz przez
   zmianę schematu identyfikatora — odrzucone, bo identyfikator jest kluczem zapisanych
   postępów w `localStorage`.
3. **`grudzień` jako nośnik `ń` na końcu** zawiera też `dzi`. Reguła jest poprawna
   (pytamy o ostatnią literę), ale wyraz niesie dwa zmiękczenia naraz — jeśli okaże
   się mylący dla dziecka, łatwo go wymienić.
