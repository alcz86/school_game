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
