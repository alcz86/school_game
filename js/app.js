(function () {
  const EKRANY = ['menu', 'wybor-poziomu', 'wybor-rozdzialu', 'walka', 'wynik', 'rodzic'];

  // Ile pytań trafia do puli rundy.
  //
  // Rozmiar puli decyduje o tym, czy powtórka błędu — najważniejszy element
  // dydaktyczny wg spec §2 — jest w ogóle WIDOCZNA. walka.js dokłada pomylone
  // pytanie na KONIEC kolejki, więc wraca ono dopiero po (pula - 1) kolejnych
  // pytaniach. Przy puli 12 boss (10 życia, przy combo do zbicia wystarczy
  // 6 trafień) ginie, zanim błąd zdąży wrócić — mechanika istniałaby tylko
  // w kodzie. Przy 8 powtórka wypada po ~7 pytaniach, czyli wewnątrz rundy.
  const PYTAN_NA_RUNDE = 8;

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
        // Przy rozdziale 0 („Hello") „od początku do" nie ma sensu — to ten sam zbiór.
        const doN = n === 0 ? '' :
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

  function odblokuj() {
    blokada = false;
    timerFeedback = null;
  }

  function rozpocznijWalke(tryb, idPoziomu, zakres) {
    const pytania = pytaniaDla(tryb, idPoziomu, PYTAN_NA_RUNDE, zakres);
    if (!pytania.length) {
      // NIGDY nowaWalka([]) — dałoby stan bez pytań, z którego nie ma wyjścia.
      const komunikat = 'Ten rozdział nie ma jeszcze słówek';
      if (tryb === 'angielski') renderujWyborRozdzialu(idPoziomu, komunikat);
      else renderujWyborPoziomu(tryb);
      return false;
    }
    if (timerFeedback) { clearTimeout(timerFeedback); }
    odblokuj();
    kontekst = { tryb, idPoziomu, zakres: zakres || null };
    stanWalki = walkaMod.nowaWalka(pytania);
    wpisMat = '';
    trafienia = 0;
    najdluzszeCombo = 0;
    pomylone = [];
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
      return '<div class="warianty">' + p.warianty.map((w) =>
        '<button class="wariant" data-odp="' + esc(w) + '">' + esc(w) + '</button>'
      ).join('') + '</div>';
    }
    return '<div class="wpisywanie">' +
      '<input type="text" id="pole-odp" autocomplete="off" autocapitalize="off" ' +
      'spellcheck="false" placeholder="wpisz po angielsku">' +
      '<button class="klawisz klawisz-ok" data-akcja="ok">OK</button></div>';
  }

  function renderujWalke(feedbackHtml) {
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
    postepy.zapiszOdpowiedz(tryb, idPoziomu, pytanie.id, o.poprawna);

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

    wpisMat = '';
    blokada = true;
    renderujWalke(feedback);

    timerFeedback = setTimeout(() => {
      // Blokada zdejmowana ZAWSZE, nawet gdy render rzuci — inaczej zacięłaby się
      // na stałe i dziecko zostałoby z martwym ekranem.
      try {
        if (stanWalki && stanWalki.skonczona) {
          postepy.zapiszWalke(kontekst.tryb, kontekst.idPoziomu, stanWalki.wynik);
          renderujWynik();
        } else {
          renderujWalke();
        }
      } finally {
        odblokuj();
      }
    }, 1200);
  }

  // -------------------------------------------------------------- ekran wyniku

  function renderujWynik() {
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

  const api = { EKRANY, pokazEkran, poziomyDla, pytaniaDla, postepy, rozpocznijWalke };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.app = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
