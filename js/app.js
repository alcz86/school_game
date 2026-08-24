(function () {
  const EKRANY = ['menu', 'wybor-poziomu', 'walka', 'wynik', 'rodzic'];

  // Most między środowiskami: w przeglądarce moduły wiszą pod window.GRA.*
  // (bo pliki ładują się jako zwykłe skrypty, bez modułów), w Node — przez require
  // (bo tam biegną testy). To jedyny mechanizm, którym app.js widzi inne moduły.
  function modul(nazwa, sciezka) {
    if (typeof window !== 'undefined' && window.GRA && window.GRA[nazwa]) return window.GRA[nazwa];
    if (typeof require !== 'undefined') return require(sciezka);
    return null;
  }
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
      });
    }
  }

  const api = { EKRANY, pokazEkran, poziomyDla, pytaniaDla, postepy };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.app = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
