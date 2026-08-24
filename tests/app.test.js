const test = require('node:test');
const assert = require('node:assert');
const app = require('../js/app.js');

test('EKRANY zawiera wszystkie ekrany gry', () => {
  assert.deepStrictEqual(app.EKRANY, ['menu', 'wybor-poziomu', 'wybor-rozdzialu', 'walka', 'wynik', 'rodzic']);
});

test('pokazEkran zwraca false dla nieznanego ekranu', () => {
  assert.strictEqual(app.pokazEkran('nie-ma-takiego'), false);
});

test('pokazEkran zwraca true dla znanego ekranu', () => {
  assert.strictEqual(app.pokazEkran('menu'), true);
});

const matematyka = require('../dane/matematyka.js');
const ortografia = require('../dane/ortografia.js');
const slowka = require('../dane/slowka.js');

test('poziomyDla zwraca poziomy właściwe dla trybu', () => {
  assert.strictEqual(app.poziomyDla('matematyka').length, matematyka.POZIOMY.length);
  assert.strictEqual(app.poziomyDla('ortografia').length, ortografia.ZESTAWY.length);
  assert.strictEqual(app.poziomyDla('angielski').length, slowka.ZESTAWY.length);
  assert.deepStrictEqual(app.poziomyDla('nie-ma'), []);
});

test('poziomyDla zawsze zwraca id, nazwę i opis', () => {
  for (const tryb of ['matematyka', 'ortografia', 'angielski']) {
    for (const p of app.poziomyDla(tryb)) {
      assert.ok(p.id, 'brak id');
      assert.ok(p.nazwa, `brak nazwy dla ${p.id}`);
      assert.strictEqual(typeof p.opis, 'string');
    }
  }
});

test('pytaniaDla zwraca komplet pytań w kształcie wymaganym przez walkę', () => {
  const pytania = app.pytaniaDla('matematyka', 'trudne', 12);
  assert.strictEqual(pytania.length, 12);
  for (const p of pytania) {
    assert.ok(p.id && p.tresc && p.odpowiedz !== undefined && p.wyjasnienie !== undefined);
  }
});

test('pytaniaDla dla nieistniejacego poziomu zwraca pusta tablice, nie wybucha', () => {
  assert.deepStrictEqual(app.pytaniaDla('angielski', 'nie-ma-takiego', 10), []);
  assert.deepStrictEqual(app.pytaniaDla('nie-ma-trybu', 'cokolwiek', 10), []);
});

test('PYTAN_NA_RUNDE wystarcza, by boss nie zbil sie z jednej puli bez powtorek', () => {
  // Boss ma 10 zycia; przy mnoznikach 1/1/2/2/3/3 do zbicia trzeba co najmniej
  // 6 poprawnych odpowiedzi. Pula musi byc od tego wieksza, inaczej runda
  // zaczynalaby cyklowac te same pytania juz przy bezblednej grze.
  assert.ok(app.PYTAN_NA_RUNDE >= 8, 'pula za mala: ' + app.PYTAN_NA_RUNDE);
});

test('rozpocznijWalke odmawia startu, gdy nie ma materialu', () => {
  // Straznik przed nowaWalka([]) — stan bez pytan zamraza gre, bo `aktualne`
  // jest null, a walka nigdy sie nie konczy.
  assert.strictEqual(app.rozpocznijWalke('angielski', 'klasa2-powtorka', { tylko: 99 }), false);
  assert.strictEqual(app.rozpocznijWalke('angielski', 'nie-ma-zestawu'), false);
  assert.strictEqual(app.rozpocznijWalke('nie-ma-trybu', 'cokolwiek'), false);
  assert.strictEqual(app.rozpocznijWalke('matematyka', 'nie-ma-poziomu'), false);
});

test('rozpocznijWalke startuje dla poprawnego trybu i poziomu', () => {
  assert.strictEqual(app.rozpocznijWalke('matematyka', 'trudne'), true);
  assert.strictEqual(app.rozpocznijWalke('ortografia', 'o-u'), true);
  assert.strictEqual(app.rozpocznijWalke('angielski', 'klasa2-powtorka', { tylko: 3 }), true);
});

test('komunikat o braku materialu jest po polsku i niepusty', () => {
  assert.ok(app.BRAK_MATERIALU && app.BRAK_MATERIALU.length > 10);
});

test('pytaniaDla dla nieznanego poziomu zwraca [] we WSZYSTKICH trybach', () => {
  // Krytyczny przypadek: matematyka.generuj cicho fallbackuje na "trudne" dla
  // nieznanego idPoziomu — guard MUSI siedzieć w pytaniaDla, przed delegacją,
  // inaczej literówka w poziomie po cichu uruchamia rundę z niewłaściwym materiałem.
  assert.deepStrictEqual(app.pytaniaDla('matematyka', 'nie-ma-takiego-poziomu', 5), []);
  assert.deepStrictEqual(app.pytaniaDla('ortografia', 'nie-ma-takiego-poziomu', 5), []);
  assert.deepStrictEqual(app.pytaniaDla('angielski', 'nie-ma-takiego-poziomu', 5), []);
});
