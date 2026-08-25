(function () {
  const EKRANY = ['menu', 'wybor-poziomu', 'wybor-rozdzialu', 'walka', 'wynik', 'rodzic'];

  // Ile pytań trafia do puli rundy. Boss ma 10 życia, więc pula nigdy się nie
  // wyczerpuje "naturalnie" — walka.js i tak cykluje kolejkę.
  //
  // Rozmiar puli NIE steruje powtórką błędu: pomylone pytanie wraca na pozycję 2
  // kolejki (patrz walka.js), więc odstęp jest stały niezależnie od tej liczby.
  const PYTAN_NA_RUNDE = 12;

  const BRAK_MATERIALU = 'Ten rozdział nie ma jeszcze słówek';

  // Most między środowiskami: w przeglądarce moduły wiszą pod window.GRA.*
  // (bo pliki ładują się jako zwykłe skrypty, bez modułów), w Node — przez require
  // (bo tam biegną testy). To jedyny mechanizm, którym app.js widzi inne moduły.
  function modul(nazwa, sciezka) {
    if (typeof window !== 'undefined' && window.GRA && window.GRA[nazwa]) return window.GRA[nazwa];
    if (typeof require !== 'undefined') return require(sciezka);
    return null;
  }
  const walkaMod   = modul('walka',      './walka.js');
  const matematyka = modul('matematyka', '../dane/matematyka.js');
  const ortografia = modul('ortografia', '../dane/ortografia.js');
  const slowka     = modul('slowka',     '../dane/slowka.js');
  const postepyMod = modul('postepy',    './postepy.js');
  const postepy    = postepyMod.utworz();

  function pokazEkran(idEkranu) {
    if (!EKRANY.includes(idEkranu)) return false;
    if (typeof document === 'undefined') return true;
    // Każde przejście między ekranami unieważnia oczekującą informację zwrotną.
    // Bez tego „← Wróć" w trakcie animacji wyrzucał dziecko na ekran wyniku
    // 1,2 s później, dwa ekrany od miejsca, w którym faktycznie było.
    anulujFeedback();
    document.querySelectorAll('.ekran').forEach((el) => {
      el.hidden = el.id !== 'ekran-' + idEkranu;
    });
    return true;
  }

  function poziomyDla(tryb) {
    if (tryb === 'matematyka') return matematyka.POZIOMY.map((p) => ({ id: p.id, nazwa: p.nazwa, opis: p.opis }));
    if (tryb === 'ortografia') return ortografia.ZESTAWY.map((z) => ({ id: z.id, nazwa: z.nazwa, opis: z.warianty.join(' czy ') }));
    if (tryb === 'angielski')  return slowka.ZESTAWY.map((z) => ({ id: z.id, nazwa: z.nazwa, opis: z.slowa.length + ' słówek' }));
    return [];
  }

  function pytaniaDla(tryb, idPoziomu, ile, zakres) {
    // Guard musi weryfikować idPoziomu tutaj, przed delegacją — matematyka.generuj
    // cicho fallbackuje na "trudne" dla nieznanego id i zwróciłaby pełnowartościowe
    // pytania zamiast []. pytaniaDla ma być jedynym punktem kontroli.
    if (!poziomyDla(tryb).some((p) => p.id === idPoziomu)) return [];
    const w = postepy.wagi(tryb, idPoziomu);
    if (tryb === 'matematyka') return matematyka.generuj(idPoziomu, ile, w);
    if (tryb === 'ortografia') return ortografia.generuj(idPoziomu, ile, w);
    if (tryb === 'angielski') {
      // Spec §3.3: zestawy powtórkowe (klasa 2) — wybór z 4; nowy materiał (klasa 3+) — wpisywanie
      const zestaw = slowka.ZESTAWY.find((z) => z.id === idPoziomu);
      const trybPytania = zestaw && zestaw.klasa >= 3 ? 'wpisywanie' : 'wybor';
      return slowka.generuj(idPoziomu, ile, trybPytania, w, zakres);
    }
    return [];
  }

  function renderujWyborPoziomu(tryb) {
    const sekcja = document.getElementById('ekran-wybor-poziomu');
    const poziomy = poziomyDla(tryb);
    sekcja.innerHTML =
      '<button class="wstecz" data-akcja="menu">← Wróć</button>' +
      '<h2>Wybierz poziom</h2>' +
      '<div class="kafle">' +
      poziomy.map((p) =>
        '<button class="kafel kafel-poziom" data-poziom="' + p.id + '">' +
        '<span><strong>' + p.nazwa + '</strong><br><small>' + p.opis + '</small></span></button>'
      ).join('') +
      '</div>';
    sekcja.dataset.tryb = tryb;
    pokazEkran('wybor-poziomu');
  }

  // ---------------------------------------------------------------- pomocnicze

  function przetasuj(tab) {
    const t = tab.slice();
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const POTWORY = ['👾', '👹', '🐉', '🦑', '🧟', '🐲'];
  const ODZNAKI = {
    matematyka: '🏅 Mistrz tabliczki',
    ortografia: '🏅 Mistrz ortografii',
    angielski: '🏅 Mistrz słówek',
  };

  function potworDla(tryb, idPoziomu) {
    const lista = poziomyDla(tryb);
    const i = lista.findIndex((p) => p.id === idPoziomu);
    return POTWORY[(i < 0 ? 0 : i) % POTWORY.length];
  }

  function nazwaRozdzialu(n) {
    // Rozdział 0 to sekcja „Hello" z podręcznika, a nie rozdział w książce.
    return n === 0 ? 'Hello (podstawy)' : 'Rozdział ' + n;
  }

  // ------------------------------------------------- ekran wyboru rozdziału

  // „Od początku do N" ma sens tylko wtedy, gdy przed N jest jakiś rozdział.
  // `numery` przychodzą z slowka.rozdzialy() — posortowane, bez duplikatów.
  function zakresDoMaSens(numery, n) {
    return numery.indexOf(n) > 0;
  }

  function renderujWyborRozdzialu(idZestawu, komunikat) {
    const sekcja = document.getElementById('ekran-wybor-rozdzialu');
    const numery = slowka.rozdzialy(idZestawu);
    sekcja.dataset.zestaw = idZestawu;
    sekcja.innerHTML =
      '<button class="wstecz" data-akcja="wybor-poziomu">← Wróć</button>' +
      '<h2>Które słówka ćwiczymy?</h2>' +
      (komunikat ? '<p class="komunikat">' + esc(komunikat) + '</p>' : '') +
      '<div class="rozdzialy">' +
      numery.map((n) => {
        const tylko =
          '<button class="btn-zakres" data-rozdzial="' + n + '" data-zakres="tylko">' +
          'Tylko ' + esc(nazwaRozdzialu(n)) + '</button>';
        // Przy PIERWSZYM rozdziale zestawu „od początku do N" daje dokładnie to samo
        // co „Tylko rozdział N" — dwa przyciski, jedna runda. Kiedyś wyjątek był
        // zaszyty na `n === 0` („Hello"), ale zestaw dopisany według README zaczyna
        // się od rozdziału 1 i duplikat wracał. Liczy się pozycja, nie numer.
        const doN = !zakresDoMaSens(numery, n) ? '' :
          '<button class="btn-zakres btn-zakres-do" data-rozdzial="' + n + '" data-zakres="do">' +
          'Od początku do ' + n + '</button>';
        return '<div class="rozdzial"><h3>' + esc(nazwaRozdzialu(n)) + '</h3>' + tylko + doN + '</div>';
      }).join('') +
      '</div>';
    pokazEkran('wybor-rozdzialu');
  }

  // --------------------------------------------------------------- stan walki

  // Stan rundy żyje TYLKO tutaj — nigdy w atrybutach DOM. DOM jest widokiem.
  let stanWalki = null;
  let kontekst = null;       // { tryb, idPoziomu, zakres }
  let wpisMat = '';          // bufor klawiatury numerycznej
  let blokada = false;       // blokada wejścia na czas informacji zwrotnej
  let timerFeedback = null;
  let trafienia = 0;
  let najdluzszeCombo = 0;
  let pomylone = [];         // [{ tresc, oczekiwana, wyjasnienie }]
  // Identyfikatory pytań, na które padła już odpowiedź w TEJ rundzie.
  //
  // Śledzimy to tutaj, a nie w postepy.js, bo „runda" istnieje wyłącznie w app.js —
  // postepy.js to trwały magazyn bez pojęcia sesji ani granic rundy i gdyby miał
  // sam odróżniać powtórkę od pierwszego podejścia, musiałby trzymać stan czasowy
  // w localStorage (i mylić się przy odświeżeniu strony w środku walki).
  let odpowiedzianeWRundzie = new Set();

  function odblokuj() {
    blokada = false;
    timerFeedback = null;
  }

  // Anuluje oczekującą informację zwrotną i zdejmuje blokadę wejścia.
  // Wołane z pokazEkran (każda zmiana ekranu) — to jedno wąskie gardło, przez
  // które przechodzi cała nawigacja, więc żadna nowa ścieżka go nie ominie.
  function anulujFeedback() {
    if (timerFeedback) clearTimeout(timerFeedback);
    odblokuj();
  }

  function ekranWalkiWidoczny() {
    if (typeof document === 'undefined') return false;
    const el = document.getElementById('ekran-walka');
    return !!el && !el.hidden;
  }

  function rozpocznijWalke(tryb, idPoziomu, zakres) {
    const pytania = pytaniaDla(tryb, idPoziomu, PYTAN_NA_RUNDE, zakres);
    if (!pytania.length) {
      // NIGDY nowaWalka([]) — dałoby stan bez pytań, z którego nie ma wyjścia.
      if (typeof document === 'undefined') return false;
      if (tryb === 'angielski') renderujWyborRozdzialu(idPoziomu, BRAK_MATERIALU);
      else renderujWyborPoziomu(tryb);
      return false;
    }
    anulujFeedback();
    kontekst = { tryb, idPoziomu, zakres: zakres || null };
    stanWalki = walkaMod.nowaWalka(pytania);
    wpisMat = '';
    trafienia = 0;
    najdluzszeCombo = 0;
    pomylone = [];
    odpowiedzianeWRundzie = new Set();
    renderujWalke();
    pokazEkran('walka');
    return true;
  }

  function polePytania() {
    const p = stanWalki.aktualne;
    const tryb = kontekst.tryb;
    if (tryb === 'matematyka') {
      const klawisze = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        .map((c) => '<button class="klawisz" data-cyfra="' + c + '">' + c + '</button>').join('');
      return '<div class="wpis" id="wpis">' + esc(wpisMat || '?') + '</div>' +
        '<div class="klawiatura">' + klawisze +
        '<button class="klawisz klawisz-usun" data-akcja="usun">⌫ usuń</button>' +
        '<button class="klawisz klawisz-ok" data-akcja="ok">OK</button></div>';
    }
    if (Array.isArray(p.warianty) && p.warianty.length) {
      // Kolejność przycisków tasujemy TUTAJ, w warstwie widoku.
      //
      // W ortografii `warianty` przychodzą z danych zawsze w tej samej kolejności
      // (['ó','u']), a poprawną odpowiedzią jest wariant pierwszy w ~2/3 wyrazów.
      // Bez tasowania dziewięciolatek po jednej rundzie odkrywa, że wystarczy klikać
      // w lewo — i wygrywa bez czytania wyrazu. Tasowanie zostaje w UI, bo
      // `warianty` w module ortografii mają pozostać deterministyczne (sprawdzają
      // to istniejące testy).
      return '<div class="warianty">' + przetasuj(p.warianty).map((w) =>
        '<button class="wariant" data-odp="' + esc(w) + '">' + esc(w) + '</button>'
      ).join('') + '</div>';
    }
    return '<div class="wpisywanie">' +
      '<input type="text" id="pole-odp" autocomplete="off" autocapitalize="off" ' +
      'spellcheck="false" placeholder="wpisz po angielsku">' +
      '<button class="klawisz klawisz-ok" data-akcja="ok">OK</button></div>';
  }

  function renderujWalke(feedbackHtml) {
    // Bez DOM (testy w Node) budujemy sam stan i nie rysujemy — dzięki temu
    // logika startu rundy jest testowalna headless, tak jak pokazEkran.
    if (typeof document === 'undefined') return;
    const sekcja = document.getElementById('ekran-walka');
    const s = stanWalki;
    const procent = Math.round((s.zycieBossa / s.maxZycieBossa) * 100);
    const serca = [0, 1, 2].map((i) =>
      '<span class="serce' + (i < s.serca ? '' : ' serce-puste') + '">♥</span>').join('');
    const mnoznik = walkaMod.mnoznikCombo(s.combo);
    const combo = s.combo >= 3
      ? '<div class="combo">🔥 Combo ' + s.combo + ' &nbsp;×' + mnoznik + '</div>'
      : '<div class="combo combo-pusto"></div>';

    sekcja.innerHTML =
      '<button class="wstecz" data-akcja="menu">← Wróć</button>' +
      '<div class="boss">' +
      '<div class="potwor">' + potworDla(kontekst.tryb, kontekst.idPoziomu) + '</div>' +
      '<div class="pasek"><div class="pasek-wypelnienie" style="width:' + procent + '%"></div></div>' +
      '<div class="pasek-opis">' + s.zycieBossa + ' / ' + s.maxZycieBossa + '</div>' +
      '</div>' +
      '<div class="serca">' + serca + '</div>' +
      combo +
      (feedbackHtml
        ? feedbackHtml
        : '<p class="pytanie">' + esc(s.aktualne.tresc) + '</p>' + polePytania());

    const pole = document.getElementById('pole-odp');
    if (pole) pole.focus();
  }

  function obsluzOdpowiedz(odp) {
    if (blokada || !stanWalki || stanWalki.skonczona || !stanWalki.aktualne) return;
    if (odp === '' || odp == null) return;

    const tryb = kontekst.tryb;
    const idPoziomu = kontekst.idPoziomu;
    const pytanie = stanWalki.aktualne;
    const nowy = walkaMod.odpowiedz(stanWalki, odp);
    stanWalki = nowy;
    const o = nowy.ostatnia;

    // Statystyki liczą się PER ZESTAW, nie per zakres — stąd idPoziomu, nie zakres.
    // Do skuteczności wchodzi TYLKO pierwsze podejście do danego pytania w tej
    // rundzie; powtórka po pomyłce nadal zlicza błąd (wagi), ale nie zawyża procentu.
    const pierwszePodejscie = !odpowiedzianeWRundzie.has(pytanie.id);
    odpowiedzianeWRundzie.add(pytanie.id);
    postepy.zapiszOdpowiedz(tryb, idPoziomu, pytanie.id, o.poprawna, pierwszePodejscie);

    if (o.poprawna) {
      trafienia += 1;
      if (nowy.combo > najdluzszeCombo) najdluzszeCombo = nowy.combo;
    } else {
      pomylone.push({
        tresc: pytanie.tresc,
        oczekiwana: o.oczekiwana,
        wyjasnienie: pytanie.wyjasnienie,
      });
    }

    let feedback;
    if (o.poprawna) {
      // W ortografii zasadę pokazujemy TAKŻE po trafieniu — inaczej dziecko
      // uczy się klikania, nie ortografii.
      const zasada = tryb === 'ortografia' && pytanie.wyjasnienie
        ? '<p class="wyjasnienie">' + esc(pytanie.wyjasnienie) + '</p>' : '';
      feedback = '<div class="feedback feedback-dobrze"><p class="feedback-tytul">Dobrze! 💥' +
        (o.mnoznik > 1 ? ' ×' + o.mnoznik : '') + '</p>' + zasada + '</div>';
    } else {
      feedback = '<div class="feedback feedback-zle">' +
        '<p class="feedback-tytul">Prawie! Poprawnie: <strong>' + esc(o.oczekiwana) + '</strong></p>' +
        (pytanie.wyjasnienie ? '<p class="wyjasnienie">' + esc(pytanie.wyjasnienie) + '</p>' : '') +
        '</div>';
    }

    // Wynik walki zapisujemy TU, synchronicznie, w momencie w którym walka się
    // kończy — a nie w callbacku informacji zwrotnej.
    //
    // Wcześniej zapis siedział w setTimeout, za strażnikiem ekranWalkiWidoczny().
    // Runda doprowadzona do zera życia bossa i porzucona klikiem „← Wróć" w trakcie
    // ostatniej animacji NIE zapisywała się w postępach — i to z dwóch niezależnych
    // powodów: pokazEkran woła anulujFeedback(), które robi clearTimeout, więc
    // callback w ogóle nie startował; a nawet gdyby wystartował, strażnik widoczności
    // ucinał go przed zapisem. Przeniesienie zapisu przed strażnik wewnątrz callbacku
    // naprawiłoby tylko drugi z tych powodów — stąd zapis synchroniczny tutaj.
    // Ekran rodzica pokazuje te dane, więc zaniżony licznik walk był realną stratą.
    if (nowy.skonczona) postepy.zapiszWalke(tryb, idPoziomu, nowy.wynik);

    wpisMat = '';
    blokada = true;
    renderujWalke(feedback);

    timerFeedback = setTimeout(() => {
      // Drugie zabezpieczenie, niezależne od anulowania w pokazEkran: jeśli dziecko
      // zdążyło opuścić ekran walki, callback nie ma prawa nic narysować ani
      // przełączyć ekranu. Dwa zabezpieczenia, bo to klasa błędu, która wraca
      // przy każdej nowej ścieżce nawigacji.
      if (!ekranWalkiWidoczny()) { odblokuj(); return; }
      // Blokada zdejmowana ZAWSZE, nawet gdy render rzuci — inaczej zacięłaby się
      // na stałe i dziecko zostałoby z martwym ekranem.
      try {
        if (stanWalki && stanWalki.skonczona) renderujWynik();
        else renderujWalke();
      } finally {
        odblokuj();
      }
    }, 1200);
  }

  // -------------------------------------------------------------- ekran wyniku

  function renderujWynik() {
    if (typeof document === 'undefined') return;
    const sekcja = document.getElementById('ekran-wynik');
    const s = stanWalki;
    const wygrana = s.wynik === 'wygrana';
    let html = '<button class="wstecz" data-akcja="menu">← Wróć</button>';

    if (wygrana) {
      html +=
        '<h2 class="wynik-tytul">Potwór pokonany! 🎉</h2>' +
        '<p class="odznaka">' + esc(ODZNAKI[kontekst.tryb] || '🏅 Odznaka') + '</p>' +
        '<ul class="statystyki-rundy">' +
        '<li>Trafienia: <strong>' + trafienia + '</strong></li>' +
        '<li>Najdłuższe combo: <strong>' + najdluzszeCombo + '</strong></li>' +
        '</ul>';
    } else {
      html +=
        '<h2 class="wynik-tytul">Prawie! Potworowi zostało ' + s.zycieBossa + ' życia</h2>' +
        '<p class="podtytul">Zobacz, co warto powtórzyć — następnym razem pójdzie łatwiej.</p>';
    }

    if (pomylone.length) {
      html += '<h3 class="naglowek-pomylki">Do powtórki (' + pomylone.length + ')</h3>' +
        '<ul class="pomylki">' + pomylone.map((p) =>
          '<li><span class="pomylka-tresc">' + esc(p.tresc) + '</span>' +
          '<span class="pomylka-odp">→ ' + esc(p.oczekiwana) + '</span>' +
          (p.wyjasnienie ? '<span class="wyjasnienie">' + esc(p.wyjasnienie) + '</span>' : '') +
          '</li>').join('') + '</ul>';
    }

    html += '<div class="przyciski-wyniku">' +
      '<button class="kafel kafel-akcja" data-akcja="jeszcze-raz">🔁 Jeszcze raz</button>' +
      '<button class="kafel kafel-akcja" data-akcja="menu">🏠 Wróć do menu</button>' +
      '</div>';

    sekcja.innerHTML = html;
    pokazEkran('wynik');
  }

  // ------------------------------------------------------ ekran rodzica

  const NAZWY_TRYBOW = {
    matematyka: 'Tabliczka mnożenia',
    ortografia: 'Ortografia',
    angielski: 'Angielski',
  };
  const PROG_SLABY = 60;   // spec §4 / brief: poniżej tego progu wynik wyróżniamy na czerwono
  const BRAK_DANYCH = 'Jeszcze brak danych — zagraj pierwszą rundę.';

  // Czytelna nazwa poziomu/zestawu. Aleksandra nie ma widzieć `o-u` ani
  // `klasa2-powtorka` — to klucze techniczne, bezużyteczne na tym ekranie.
  function nazwaPoziomu(tryb, idPoziomu) {
    const p = poziomyDla(tryb).find((x) => x.id === idPoziomu);
    return p ? p.nazwa : idPoziomu;
  }

  // Zamiana identyfikatora pomylonej pozycji na opis po ludzku.
  // Kształty identyfikatorów (patrz dane/*.js):
  //   matematyka  '7x8'  |  '56:8'
  //   ortografia  'o-u:król'          (prefiks = id zestawu)
  //   angielski   'klasa2-powtorka:bread'
  function opisBledu(tryb, idZestawu, idPytania) {
    const surowy = String(idPytania == null ? '' : idPytania);
    if (tryb === 'matematyka') {
      const mn = surowy.match(/^(\d+)x(\d+)$/);
      if (mn) return mn[1] + ' × ' + mn[2];
      const dz = surowy.match(/^(\d+):(\d+)$/);
      if (dz) return dz[1] + ' : ' + dz[2];
      return surowy;
    }
    // Prefiks zestawu jest w identyfikatorze powtórzony — obcinamy go, ale tylko
    // gdy faktycznie tam jest (dane mogą przyjść ze starszego zapisu).
    const prefiks = idZestawu + ':';
    const reszta = surowy.indexOf(prefiks) === 0 ? surowy.slice(prefiks.length) : surowy;
    if (tryb === 'ortografia') {
      const zestaw = ortografia.ZESTAWY.find((z) => z.id === idZestawu);
      const para = zestaw ? zestaw.warianty.join('/') : null;
      return para ? reszta + ' (' + para + ')' : reszta;
    }
    if (tryb === 'angielski') {
      const zestaw = slowka.ZESTAWY.find((z) => z.id === idZestawu);
      const slowo = zestaw && zestaw.slowa.find((s) => s.en === reszta);
      return slowo ? reszta + ' — ' + slowo.pl : reszta;
    }
    return reszta;
  }

  // Płaska lista wierszy tabeli skuteczności, w stałej kolejności trybów
  // (a wewnątrz trybu — w kolejności poziomów z danych, nie z localStorage).
  function wierszeSkutecznosci(stat) {
    const wiersze = [];
    for (const tryb of ['matematyka', 'ortografia', 'angielski']) {
      const wTrybie = (stat.tryby && stat.tryby[tryb]) || {};
      const kolejnosc = poziomyDla(tryb).map((p) => p.id);
      const idki = Object.keys(wTrybie)
        .sort((a, b) => {
          const ia = kolejnosc.indexOf(a), ib = kolejnosc.indexOf(b);
          return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
        });
      for (const id of idki) {
        const w = wTrybie[id];
        if (!w || !w.wszystkie) continue;   // bez 0/0 i bez NaN%
        wiersze.push({
          tryb, nazwaTrybu: NAZWY_TRYBOW[tryb] || tryb,
          poziom: id, nazwaPoziomu: nazwaPoziomu(tryb, id),
          poprawne: w.poprawne, wszystkie: w.wszystkie, procent: w.procent,
        });
      }
    }
    return wiersze;
  }

  // Spec §4: powtórka (klasa 2) osobno od nowego materiału (klasa 3+).
  // Bez tego nie widać, czy stary materiał się trzyma, gdy dochodzi nowy —
  // z samej listy zestawów tego nie da się odczytać.
  function wierszeAngielski(stat) {
    const wTrybie = (stat.tryby && stat.tryby.angielski) || {};
    const grupy = [
      { klucz: 'powtorka', nazwa: 'Powtórka (klasa 2)', poprawne: 0, wszystkie: 0 },
      { klucz: 'klasa3',   nazwa: 'Klasa 3',            poprawne: 0, wszystkie: 0 },
    ];
    for (const id of Object.keys(wTrybie)) {
      const zestaw = slowka.ZESTAWY.find((z) => z.id === id);
      if (!zestaw) continue;
      const g = zestaw.klasa >= 3 ? grupy[1] : grupy[0];
      g.poprawne += wTrybie[id].poprawne;
      g.wszystkie += wTrybie[id].wszystkie;
    }
    return grupy.map((g) => ({
      nazwa: g.nazwa,
      poprawne: g.poprawne,
      wszystkie: g.wszystkie,
      procent: g.wszystkie ? Math.round((g.poprawne / g.wszystkie) * 100) : null,
    }));
  }

  function formatujDate(iso) {
    const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? m[3] + '.' + m[2] + '.' + m[1] : String(iso || '');
  }

  function formatujDni(n) {
    return n + (n === 1 ? ' dzień' : ' dni');
  }

  function komorkaProcent(procent) {
    if (procent == null) return '<td class="td-procent td-brak">brak danych</td>';
    const klasa = procent < PROG_SLABY ? ' procent-slaby' : '';
    return '<td class="td-procent' + klasa + '">' + procent + '%</td>';
  }

  // „3 błędy z 4 prób" — sama liczba pomyłek nic nie mówi: 4 z 20 to co innego
  // niż 4 z 4. Liczymy na PIERWSZYCH podejściach (patrz postepy.zapiszOdpowiedz),
  // więc błędy i próby są na tym samym mianowniku.
  function formaKoncowka(n, jeden, kilka, wiele) {
    if (n === 1) return jeden;
    const d = n % 10, s = n % 100;
    return (d >= 2 && d <= 4 && !(s >= 12 && s <= 14)) ? kilka : wiele;
  }

  function opisPomylek(b) {
    const bledy = b.bledyPierwsze == null ? b.bledy : b.bledyPierwsze;
    const proby = b.proby == null ? bledy : b.proby;
    return bledy + ' ' + formaKoncowka(bledy, 'błąd', 'błędy', 'błędów') +
      ' z ' + proby + ' ' + formaKoncowka(proby, 'próby', 'prób', 'prób');
  }

  function tabelaPomylek(lista) {
    return '<table class="tabela-postepy"><thead><tr>' +
      '<th>Pozycja</th><th>Tryb i poziom</th><th>Pomyłki</th>' +
      '</tr></thead><tbody>' +
      lista.map((b) =>
        '<tr><td class="td-pozycja">' + esc(opisBledu(b.tryb, b.zestaw, b.id)) + '</td>' +
        '<td class="td-skad">' + esc((NAZWY_TRYBOW[b.tryb] || b.tryb) + ' · ' + nazwaPoziomu(b.tryb, b.zestaw)) + '</td>' +
        '<td class="td-bledy">' + esc(opisPomylek(b)) + '</td></tr>').join('') +
      '</tbody></table>';
  }

  function renderujRodzica() {
    if (typeof document === 'undefined') return false;
    const sekcja = document.getElementById('ekran-rodzic');
    if (!sekcja) return false;
    const stat = postepy.statystyki();
    const wiersze = wierszeSkutecznosci(stat);

    let html = '<button class="wstecz" data-akcja="menu">← Wróć</button>' +
      '<h2>Postępy</h2>';

    if (!wiersze.length) {
      html += '<p class="komunikat komunikat-info">' + esc(BRAK_DANYCH) + '</p>';
      sekcja.innerHTML = html;
      pokazEkran('rodzic');
      return true;
    }

    html += '<p class="seria">🔥 Dni z rzędu: <strong>' + formatujDni(stat.dniZRzedu) + '</strong>' +
      (stat.ostatnioGrane ? ' &nbsp;·&nbsp; ostatnia gra: <strong>' + esc(formatujDate(stat.ostatnioGrane)) + '</strong>' : '') +
      '</p>';

    html += '<h3>Skuteczność wg trybu i poziomu</h3>' +
      '<table class="tabela-postepy"><thead><tr>' +
      '<th>Tryb</th><th>Poziom</th><th>Wynik</th><th>Procent</th>' +
      '</tr></thead><tbody>' +
      wiersze.map((w) =>
        '<tr><td>' + esc(w.nazwaTrybu) + '</td><td>' + esc(w.nazwaPoziomu) + '</td>' +
        '<td>' + w.poprawne + ' / ' + w.wszystkie + '</td>' +
        komorkaProcent(w.procent) + '</tr>').join('') +
      '</tbody></table>';

    const ang = wierszeAngielski(stat);
    if (ang.some((g) => g.wszystkie)) {
      html += '<h3>Angielski: powtórka a nowy materiał</h3>' +
        '<table class="tabela-postepy"><thead><tr>' +
        '<th>Materiał</th><th>Wynik</th><th>Procent</th>' +
        '</tr></thead><tbody>' +
        ang.map((g) =>
          '<tr><td>' + esc(g.nazwa) + '</td>' +
          '<td>' + (g.wszystkie ? g.poprawne + ' / ' + g.wszystkie : '—') + '</td>' +
          komorkaProcent(g.procent) + '</tr>').join('') +
        '</tbody></table>';
    }

    const bledy = (stat.najczestszeBledy || []).filter((b) => b && b.bledy > 0);
    if (bledy.length) {
      const wszystkich = stat.mylonePozycje || bledy.length;
      // Nagłówek pokazuje OBIE liczby. Sam „(10)" kłamał: przy 58 mylonych pozycjach
      // sugerował, że to całość, a poza listą zostawało ok. 62% błędów.
      html += '<h3>Najczęściej mylone (' + bledy.length + ' z ' + wszystkich + ')</h3>' +
        tabelaPomylek(bledy);
    }

    const zawsze = (stat.zawszeMylone || []);
    if (zawsze.length) {
      html += '<h3>Zawsze mylone (' + zawsze.length + ')</h3>' +
        '<p class="podtytul">Pozycje, w których nie było jeszcze ani jednej dobrej odpowiedzi ' +
        '(co najmniej dwie próby).</p>' +
        tabelaPomylek(zawsze);
    }

    html += '<div class="przyciski-wyniku">' +
      '<button class="kafel kafel-akcja kafel-reset" data-akcja="reset-postepy">🗑️ Wyczyść postępy</button>' +
      '</div>';

    sekcja.innerHTML = html;
    pokazEkran('rodzic');
    return true;
  }

  // ------------------------------------------------------------- zdarzenia DOM

  function zatwierdzWpis() {
    if (kontekst && kontekst.tryb === 'matematyka') {
      if (wpisMat === '') return;
      obsluzOdpowiedz(wpisMat);
      return;
    }
    const pole = document.getElementById('pole-odp');
    if (pole && pole.value.trim() !== '') obsluzOdpowiedz(pole.value.trim());
  }

  if (typeof document !== 'undefined') {
    const gra = document.getElementById('gra');
    if (gra) {
      gra.addEventListener('click', (e) => {
        const kafelMenu = e.target.closest('.kafel[data-tryb]');
        if (kafelMenu) {
          renderujWyborPoziomu(kafelMenu.dataset.tryb);
          return;
        }
        if (e.target.closest('#btn-rodzic')) {
          renderujRodzica();
          return;
        }
        if (e.target.closest('[data-akcja="reset-postepy"]')) {
          // confirm() celowo — to jedyna nieodwracalna akcja w całej grze.
          const potwierdz = typeof window !== 'undefined' && window.confirm;
          if (!potwierdz || window.confirm('Na pewno wyczyścić wszystkie postępy? Tego nie da się cofnąć.')) {
            postepy.reset();
            renderujRodzica();
          }
          return;
        }
        const wstecz = e.target.closest('[data-akcja="menu"]');
        if (wstecz) {
          pokazEkran('menu');
          return;
        }
        const doPoziomow = e.target.closest('[data-akcja="wybor-poziomu"]');
        if (doPoziomow) {
          renderujWyborPoziomu('angielski');
          return;
        }
        const poziom = e.target.closest('.kafel-poziom[data-poziom]');
        if (poziom) {
          const tryb = document.getElementById('ekran-wybor-poziomu').dataset.tryb;
          if (tryb === 'angielski') renderujWyborRozdzialu(poziom.dataset.poziom);
          else rozpocznijWalke(tryb, poziom.dataset.poziom);
          return;
        }
        const zakres = e.target.closest('.btn-zakres[data-rozdzial]');
        if (zakres) {
          // dataset.* to ZAWSZE string — bez Number() zakres cicho przepadłby.
          const n = Number(zakres.dataset.rozdzial);
          const idZestawu = document.getElementById('ekran-wybor-rozdzialu').dataset.zestaw;
          rozpocznijWalke('angielski', idZestawu,
            zakres.dataset.zakres === 'do' ? { do: n } : { tylko: n });
          return;
        }
        const jeszczeRaz = e.target.closest('[data-akcja="jeszcze-raz"]');
        if (jeszczeRaz && kontekst) {
          rozpocznijWalke(kontekst.tryb, kontekst.idPoziomu, kontekst.zakres);
          return;
        }
        if (blokada) return;
        const cyfra = e.target.closest('[data-cyfra]');
        if (cyfra) {
          if (wpisMat.length < 4) wpisMat += cyfra.dataset.cyfra;
          const pole = document.getElementById('wpis');
          if (pole) pole.textContent = wpisMat || '?';
          return;
        }
        const usun = e.target.closest('[data-akcja="usun"]');
        if (usun) {
          wpisMat = wpisMat.slice(0, -1);
          const pole = document.getElementById('wpis');
          if (pole) pole.textContent = wpisMat || '?';
          return;
        }
        const ok = e.target.closest('[data-akcja="ok"]');
        if (ok) { zatwierdzWpis(); return; }
        const wariant = e.target.closest('.wariant[data-odp]');
        if (wariant) { obsluzOdpowiedz(wariant.dataset.odp); return; }
      });

      document.addEventListener('keydown', (e) => {
        const ekran = document.getElementById('ekran-walka');
        if (!ekran || ekran.hidden || blokada || !stanWalki || stanWalki.skonczona) return;
        if (e.key === 'Enter') { e.preventDefault(); zatwierdzWpis(); return; }
        if (!kontekst || kontekst.tryb !== 'matematyka') return;
        if (e.key >= '0' && e.key <= '9') {
          if (wpisMat.length < 4) wpisMat += e.key;
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          wpisMat = wpisMat.slice(0, -1);
        } else return;
        const pole = document.getElementById('wpis');
        if (pole) pole.textContent = wpisMat || '?';
      });
    }
  }

  const api = {
    EKRANY, PYTAN_NA_RUNDE, BRAK_MATERIALU, BRAK_DANYCH, PROG_SLABY,
    pokazEkran, poziomyDla, pytaniaDla, postepy, rozpocznijWalke,
    renderujRodzica, nazwaPoziomu, opisBledu, wierszeSkutecznosci, wierszeAngielski,
    formatujDate, formatujDni, zakresDoMaSens, opisPomylek,
  };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.app = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
