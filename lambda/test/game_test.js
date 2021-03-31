const { fail } = require('assert');
const assert = require('assert');
const Game = require('../game');
const validators = require('../game')

describe('Game', () => {
  it('should be able to run a complete game', () => {
    var game = new Game("en-us")
      .addPlayer('Anderson')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k']);
      
    game.start();
    console.log(JSON.stringify(game, null, 4));
  });
});
