const test = require('node:test');
const assert = require('node:assert');
const app = require('../js/app.js');

test('EKRANY zawiera wszystkie ekrany gry', () => {
  assert.deepStrictEqual(app.EKRANY, ['menu', 'wybor-poziomu', 'walka', 'wynik', 'rodzic']);
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

test('pytaniaDla dla nieznanego poziomu zwraca [] we WSZYSTKICH trybach', () => {
  // Krytyczny przypadek: matematyka.generuj cicho fallbackuje na "trudne" dla
  // nieznanego idPoziomu — guard MUSI siedzieć w pytaniaDla, przed delegacją,
  // inaczej literówka w poziomie po cichu uruchamia rundę z niewłaściwym materiałem.
  assert.deepStrictEqual(app.pytaniaDla('matematyka', 'nie-ma-takiego-poziomu', 5), []);
  assert.deepStrictEqual(app.pytaniaDla('ortografia', 'nie-ma-takiego-poziomu', 5), []);
  assert.deepStrictEqual(app.pytaniaDla('angielski', 'nie-ma-takiego-poziomu', 5), []);
});
