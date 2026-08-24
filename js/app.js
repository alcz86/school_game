(function () {
  const EKRANY = ['menu', 'wybor-poziomu', 'walka', 'wynik', 'rodzic'];

  function pokazEkran(idEkranu) {
    if (!EKRANY.includes(idEkranu)) return false;
    if (typeof document === 'undefined') return true;
    document.querySelectorAll('.ekran').forEach((el) => {
      el.hidden = el.id !== 'ekran-' + idEkranu;
    });
    return true;
  }

  const api = { EKRANY, pokazEkran };
  if (typeof window !== 'undefined') {
    window.GRA = window.GRA || {};
    window.GRA.app = api;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
