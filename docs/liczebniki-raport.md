# Liczebniki i tryb odpowiedzi na ekranie rodzica — raport

Data: 2026-09-08. Testy: **206 przechodzi, 0 błędów** (`node --test`), z czego 191 to
testy sprzed tej zmiany — żaden nie został zmieniony ani wyłączony.

---

## Część 1 — nowe wyrazy ortograficzne

Dopisano **27 wyrazów**: 9 liczebników do `zmiękczeń` i po 6 do `ó/u`, `rz/ż` i `ch/h`.
Wszystkie leżą w `dane/ortografia.js`. Nic w `js/` nie było do tego potrzebne.

### Zmiękczenia — liczebniki (9)

| Wyraz | Co dziecko widzi | Przyciski | Poprawnie | Zasada |
|---|---|---|---|---|
| sześćdziesiąt | `sześć_esiąt` | dź / dzi | `dzi` | przed samogłoską piszemy dzi: dzi + e — sześćdziesiąt |
| pięćdziesiąt | `pięć_esiąt` | dź / dzi | `dzi` | przed samogłoską piszemy dzi: dzi + e — pięćdziesiąt |
| trzydzieści | `trzy_eści` | dź / dzi | `dzi` | przed samogłoską piszemy dzi: dzi + e — trzydzieści |
| dziewięćset | `_ewięćset` | dź / dzi | `dzi` | przed samogłoską piszemy dzi: dzi + e — dziewięćset |
| sześćset | `sze_ćset` | ś / si | `ś` | przed spółgłoską piszemy ś: ś + ć — sześćset |
| dziewiętnaście | `dziewiętna_cie` | ś / si | `ś` | przed spółgłoską piszemy ś: ś + c — dziewiętnaście |
| czterdzieści | `czterdzie_ci` | ś / si | `ś` | przed spółgłoską piszemy ś: ś + c — czterdzieści |
| tysiąc | `ty_ąc` | ś / si | `si` | przed samogłoską piszemy si: si + ą — tysiąc |
| dziewięćdziesiąt | `dziewię_dziesiąt` | ć / ci | `ć` | przed spółgłoską piszemy ć: ć + d — dziewięćdziesiąt |

**Ograniczenie, o którym Pani wie i które Pani przyjęła.** Najczęstszy realny błąd
w tych wyrazach to *sześdziesiąt* i *pięcdziesiąt* — zgubione albo przestawione `ć`.
Gra pokazuje dwa przyciski, `ć` i `ci`, więc ćwiczy **wybór między tymi dwiema formami**,
a nie samo to, że jakieś `ć` tam w ogóle jest. Druga połowa problemu jest złapana:
`dzi` w `sześćdziesiąt` i `ś` w `sześćset` to dokładnie te miejsca, w których dziecko
musi zastosować regułę. Trzeciego przycisku („brak litery") **nie dorabiałem** — to
osobna decyzja i nie została jeszcze podjęta. Zapisałem to też jako komentarz w danych,
żeby ktoś tego nie „naprawił" przy następnej partii wyrazów.

### ó / u (6)

| Wyraz | Widok | Poprawnie | Zasada |
|---|---|---|---|
| mówić | `m_wić` | ó | ó wymienia się na o: mówić — mowa, rozmowa |
| pokój | `pok_j` | ó | ó wymienia się na o: pokój — pokoje, pokoik |
| wrócić | `wr_cić` | ó | ó wymienia się na a: wrócić — wracać |
| usta | `_sta` | u | na początku wyrazu piszemy u (poza: ósemka, ósmy) |
| kurtka | `k_rtka` | u | u się nie wymienia — trzeba zapamiętać: kurtka, kurteczka |
| pracuje | `prac_je` | u | końcówka -uje zawsze przez u: maluje, rysuje, pracuje |

### rz / ż (6)

| Wyraz | Widok | Poprawnie | Zasada |
|---|---|---|---|
| wrzesień | `w_esień` | rz | po spółgłosce w piszemy rz: wrzesień, wrzos |
| orzeł | `o_eł` | rz | rz wymienia się na r: orzeł — orła, orlik |
| przyjaciel | `p_yjaciel` | rz | po spółgłosce p piszemy rz: przyjaciel, przerwa |
| łyżka | `ły_ka` | ż | ż się tu nie wymienia — trzeba zapamiętać: łyżka, łyżeczka |
| żołnierz | `_ołnierz` | ż | ż się tu nie wymienia — trzeba zapamiętać: żołnierz, żołnierski |
| koleżanka | `kole_anka` | ż | ż wymienia się na g: koleżanka — kolega |

### ch / h (6)

| Wyraz | Widok | Poprawnie | Zasada |
|---|---|---|---|
| chomik | `_omik` | ch | ch trzeba tu zapamiętać: chomik, chomiczek |
| chodzić | `_odzić` | ch | ch trzeba tu zapamiętać: chodzić, chodnik, chód |
| duch | `du_` | ch | na końcu wyrazu piszemy ch: duch, dach, ruch |
| historia | `_istoria` | h | h trzeba zapamiętać — wyraz przyszedł do nas z innego języka |
| hipopotam | `_ipopotam` | h | h trzeba zapamiętać — wyraz przyszedł do nas z innego języka |
| humor | `_umor` | h | h trzeba zapamiętać — wyraz przyszedł do nas z innego języka |

### Odrzucone i dlaczego

To ta sama pułapka, na której poległo kiedyś `morze` → `może`: zły wariant wstawiony
w lukę tworzy prawdziwe polskie słowo, dziecko odpowiada rozsądnie i traci serce.

| Wyraz | Odrzucony wariant zapisu | Powód |
|---|---|---|
| **pięćset** | luka na `ć` (`pię_set`) | zły wariant daje `pięciset` — o jedną literę od prawdziwego dopełniacza `pięciuset`. Wyraz nie ma innego miejsca na lukę, więc odpada w całości. |
| **dziewięćset** z luką na `ć` | `dziewię_set` | to samo: `dziewięciset` vs prawdziwe `dziewięciuset`. **Wyraz uratowany** — lukę przeniosłem na początkowe `dzi` (`_ewięćset`, zły wariant `dźewięćset` nie jest niczym). |
| **duży** | `du_y` | zły wariant daje `durzy` — prawdziwe słowo (od „durzyć się"). |
| **wieża** | `wie_a` | zły wariant daje `wierza` — zbyt blisko form od „wierzyć"/„wierzeja". Za duże ryzyko na wyraz, który nie wnosi nowej zasady. |
| **dziesięć**, **dziewięć** | — | już były w zestawie zmiękczeń, nie duplikowałem. |
| **powtórka**, **krótki**, **dwóch** | — | zasada wyszłaby naciągana („bo tak się pisze") albo zły wariant zbyt blisko istniejącej formy (`dwuch` vs przedrostek `dwu-`). |

Poza tym sprawdziłem **każdy** z 27 nowych wyrazów: wstawiłem w lukę zły wariant
i przeczytałem wynik. Żaden nie daje polskiego słowa. Pełna lista złych form jest
w komentarzach przy danych, żeby dało się to odtworzyć bez powtarzania pracy.

### Czego pilnują testy

- luka trafia dokładnie w poprawną odpowiedź (`dzi` = 3 znaki, `ś` = 1, `si` = 2);
- żaden nowy wyraz nie renderuje się tak samo jak inny w tym samym zestawie;
- reguła pozycyjna w zmiękczeniach (dwuznak przed samogłoską, kreska przed spółgłoską
  lub na końcu) — to ona odrzuca pozorne zmiękczenia typu `zima`;
- każdy wyraz zmiękczeń ma własną parę przycisków;
- **nowy test** wymienia dziewięć liczebników po nazwie i pilnuje, żeby `pięćset`
  ani `dziewięćset` nie wróciły z luką na `ć`.

---

## Część 2 — tryb odpowiedzi widoczny na ekranie rodzica

**Problem.** Przełącznik „Wybór z czterech / Wpisywanie" pamięta teraz wybór syna
między rundami. Skuteczność w wyborze z czterech jest z natury wyższa niż przy
wpisywaniu, więc gdyby syn osiadł w łatwiejszym trybie, procenty na ekranie postępów
zaczęłyby rosnąć bez żadnej zmiany w tym, co umie — i nic by tego nie zdradziło.

**Co doszło.** Tabela „Angielski: powtórka a nowy materiał" ma czwartą kolumnę
**„Jak odpowiadał"**, a pod tabelą jedno zdanie wyjaśniające, dlaczego to ważne.

| Co pokazuje kolumna | Kiedy |
|---|---|
| `Wpisywanie` / `Wybór z czterech` | wszystkie odpowiedzi w tym wierszu z jednego trybu |
| `mieszane (Wybór z czterech: 12 · Wpisywanie: 8)` | rundy w obu trybach — **z rozbiciem, bez uśredniania** |
| `starsze wyniki` | wyniki sprzed tej zmiany, bez zapisanego trybu |
| `mieszane (… · starsze wyniki: 8)` | część wyników starych, część nowych |
| `—` | brak odpowiedzi |

„Mieszane" pada także wtedy, gdy w jednym zestawie syn grał wyborem, a w drugim
z tej samej grupy — wpisywaniem.

**Stare postępy.** Wyników sprzed tej zmiany **nie podpisuję żadnym trybem**.
Podpisanie ich zmyślonym trybem fałszowałoby dokładnie to porównanie, po które
wchodzi się na ten ekran. Dlatego są oznaczone jako „starsze wyniki" i widać je
osobno. Stare postępy wyświetlają się dalej i liczą do procentów tak jak dotąd —
sprawdziłem to na zapisie w starym formacie.

**Gdzie to siedzi.** `js/postepy.js` dostał nową gałąź stanu `sposoby`
(`"<tryb>|<zestaw>": { wybor: n, wpisywanie: n }`). Obrona modułu na uszkodzone
i obce dane w `localStorage` została **rozszerzona, nie ominięta**: brak pola,
tablica, string, `null` i uszkodzony JSON dają pusty obiekt, nie wyjątek. Tryb
liczy się tylko przy pierwszym podejściu do pytania — na tym samym mianowniku
co procenty, więc liczby dają się zestawić bez przeliczania.

**Nowe testy (15).** Stare wpisy bez trybu nie wywracają ekranu i dalej się liczą ·
nowe wpisy pokazują tryb · zestaw z rundami w obu trybach jest oznaczony jako
mieszany, z rozbiciem · mieszanka bierze się też z różnych zestawów tej samej grupy ·
śmieciowe `sposoby` w magazynie są ignorowane · powtórka po pomyłce nie zawyża
licznika trybu · statystyki zwracają kopie, nie referencje.

---

## Co sprawdziłem poza testami

**Weryfikacja mutacyjna** — na kopii projektu (`rsync`, nigdy `git checkout`).
Siedem celowych usterek wprowadzonych po kolei, każda złapana przez testy:
liczenie starych wyników jako zero · zdjęcie walidacji `sposoby` · zamiana
„mieszane" na „ten z większą liczbą" · liczenie powtórek do trybu · przesunięcie
luki w `sześćdziesiąt` o jeden znak · podmiana pary przycisków przy `tysiąc` ·
wstawienie pozornego zmiękczenia `zima`.

**W przeglądarce** (lokalny serwer HTTP, przeładowanie bez cache):

- runda zmiękczeń z liczebnikami — `sześć_esiąt`, `_ewięćset`, `sze_ćset`,
  `trzy_eści`, `pięć_esiąt`; przy każdym właściwa para przycisków (`ś/si` przy
  `sześćset`, `dź/dzi` przy `sześćdziesiąt`) i właściwa zasada po odpowiedzi;
- runda w `ó/u` (`m_wić`, `prac_je`), w `rz/ż` (`g_yb`, `wa_ny`) i w `ch/h`
  (`gro_`, `s_ody`) — bez usterek;
- ekran rodzica z wszystkimi trzema stanami kolumny naraz: `mieszane
  (Wybór z czterech: 3 · Wpisywanie: 2)`, `Wpisywanie`, `starsze wyniki`;
- zapis trybu przez prawdziwą grę, nie przez wstrzyknięcie danych — runda wyborem,
  potem runda wpisywaniem, w magazynie `{ wybor: 3, wpisywanie: 2 }`;
- 320 px: `scrollWidth` = `clientWidth` = 320, czyli **brak przewijania poziomego**;
- konsola przeglądarki czysta — zero komunikatów.

---

## Wątpliwości, które zostawiam Pani do decyzji

1. **`ć` w liczebnikach** — opisane wyżej. Trzeci przycisk („brak litery") rozwiązałby
   najczęstszy błąd, ale zmienia mechanikę całej gry, nie tylko tych dziewięciu
   wyrazów. Nie ruszałem.
2. **`kurtka`** ma zasadę „u się nie wymienia — trzeba zapamiętać". To zasada
   prawdziwa, ale słabsza dydaktycznie niż wymiana. Zostawiłem, bo wyraz jest
   codzienny, a zestaw `ó/u` i tak ma takich wyrazów kilka.
3. **`wrócić — wracać`** to wymiana `ó` na `a`, a nie na `o` czy `e`. Jest poprawna
   i uczona w szkole, ale jest trzecim wariantem tej samej reguły — jeśli okaże się
   dla syna myląca, wystarczy usunąć ten jeden wpis.
