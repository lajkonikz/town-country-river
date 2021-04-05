const { fail } = require('assert');
const assert = require('assert');
const Game = require('../game');
const validators = require('../game')

describe('Game', () => {
  it('should be able to start a game', () => {
    var game = new Game()
      .addPlayer('Anderson')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k']);
    
    assert.strictEqual(game.state, 'NOT_STARTED')
    game.start();
    assert.strictEqual(game.state, "STARTED");
  });

  it('should be able to load an existing game', () => {
    var game = new Game()
      .addPlayer('Anderson')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();

    var originalGameJson = game.dumps();
    var newGame = new Game(originalGameJson);

    assert.strictEqual(game.id, newGame.id);
  });

  it('current player should be first player of first round.', () => {
    let game = new Game()
      .addPlayer('Anderson')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .setPickLetterBehaviour('EVERY_ROUND')
      .start();

    const firstRound = game.getRound(1);
    assert.strictEqual(
      firstRound.round_players[0].name,
      game.currentState.player);
  });

  it('should not be able to select an non-existing round.', () => {
    let game = new Game()
      .addPlayer('Anderson')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();

    const round = game.getRound(5);
    assert.strictEqual(round, undefined);
  });

  it('should be able to score for a player.', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();

      const roundId = 1;
      const points = 5;

    game.score(roundId, game.currentState.player, points);

    // Check if points is correcly store inside the round.
    assert.strictEqual(game.rounds[0].round_players[0].points, points);

    // Check if current player is the 2nd one of the round.
    assert.strictEqual(game.currentState.player, game.rounds[0].round_players[1].name);

    // Score for the second player.
    game.score(roundId, game.currentState.player, points);

    // Check if current player is the 3rd one of the round.
    assert.strictEqual(game.currentState.player, game.rounds[0].round_players[2].name);

    // Score for the third player.
    game.score(roundId, game.currentState.player, points);

    // Check if current player is the 1st one of the second round.
    assert.strictEqual(game.currentState.player, game.rounds[1].round_players[0].name);

    // Check if current round is the 2nd one of the game.
    assert.strictEqual(game.currentState.roundId, game.rounds[1].round_id);
  });

  it('should be able to complete a game.', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();
    
    const points = 5;

    let range = n => Array.from(Array(n).keys())
    for (let i of range(9)) {
      game.score(game.currentState.roundId, game.currentState.player, points);    
    }

    assert.strictEqual(game.state, 'FINISHED');
  });

  // scoreboard
  it('should have the scoreboard with valid points', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();
  
    let points = 0;

    // Create scores
    let range = n => Array.from(Array(n).keys())
    for (let i of range(9)) {
      let currentPlayer = game.currentState.player;
      if (currentPlayer == 'Raquela') {
        points = 5;
      } else if (currentPlayer == 'Andersona') {
        points = 3;
      } else if (currentPlayer == 'Armanda') {
        points = 1;
      }

      game.score(game.currentState.roundId, currentPlayer, points);    
    }

    // Validate scoreboard
    let scoreboard = game.getScoreboard();
    assert.strictEqual(scoreboard[0].name, 'Raquela');
    assert.strictEqual(scoreboard[1].name, 'Andersona');
    assert.strictEqual(scoreboard[2].name, 'Armanda');
  });

  it('should be able to run a complete game, loading and reloading it.', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k']);
    
    assert.strictEqual(game.state, 'NOT_STARTED');
    game.start();
    assert.strictEqual(game.state, 'STARTED');
    
    // Round 1. Everyone scores
    game.score(game.currentState.roundId, game.currentState.player, 5);
    game.score(game.currentState.roundId, game.currentState.player, 5);
    assert.strictEqual(game.currentState.roundId, 1);
    game.score(game.currentState.roundId, game.currentState.player, 5);

    // Round 2. Session finishes and restarts.
    // Only 2nd player scores.
    let content = game.dumps();
    let secondPlayerName = "";
    let newGame = new Game(content);
    assert.strictEqual(newGame.state, 'STARTED');
    assert.strictEqual(newGame.currentState.roundId, 2);
    newGame.score(newGame.currentState.roundId, newGame.currentState.player, 0);
    secondPlayerName = newGame.currentState.player;
    newGame.score(newGame.currentState.roundId, newGame.currentState.player, 5);
    newGame.score(newGame.currentState.roundId, newGame.currentState.player, 0);

    // Round 3. Session finishing during the round
    // No one scores.
    newGame.score(newGame.currentState.roundId, newGame.currentState.player, 0);
    content = newGame.dumps();

    let newestGame = new Game(content);
    newestGame.score(newestGame.currentState.roundId, newestGame.currentState.player, 0);
    newestGame.score(newestGame.currentState.roundId, newestGame.currentState.player, 0);

    // Check if game is finished.
    assert.strictEqual(newestGame.state, 'FINISHED');
    const scoreboard = newestGame.getScoreboard();
    assert.strictEqual(scoreboard.length, 3);
  });

  // Dummy tests
  it('excludeLetters should receive an array.', () => {
    assert.throws(() => {
      new Game()
        .addPlayer('Andersona')
        .addPlayer('Raquela')
        .addPlayer('Armanda')
        .setCategories(['color', 'country', 'fruit'])
        .excludeLetters('something')
        .start();  
    }, {
      name: "Error",
    });
  });

  it('should not be able to add players after starting a game.', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();

    assert.throws(() => {
      game.addPlayer('Jose');
    }, {
      name: "Error"
    });
  });

  it('should not be able to start a game in a state different than NOT_STARTED', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();

    assert.throws(() => {
      game.start();
    }, {
      name: "Error"
    });
  });

  it('should not be able to start a game without setting up the categories', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela');
      
    assert.throws(() => {
      game.start();
    }, {
      name: "Error"
    });
  });

  it('should not be able to start a game with one player', () => {
    let game = new Game()
      .addPlayer('Andersona')
      .setCategories(['color', 'country', 'fruit']);
      
    assert.throws(() => {
      game.start();
    }, {
      name: "Error"
    });
  });

  it('should not be able to score using invalid parameters.', () => {      
    let game = new Game()
      .addPlayer('Andersona')
      .addPlayer('Raquela')
      .addPlayer('Armanda')
      .setCategories(['color', 'country', 'fruit'])
      .excludeLetters(['a', 'k'])
      .start();

    // Try to score in a non-existing round.
    assert.throws(() => {
      game.score(9, 'Jose', 5);
    }, {
      name: "Error"
    });

    // Try to score with a non-existing player.
    assert.throws(() => {
      game.score(1, 'Jose', 5);
    }, {
      name: "Error"
    });

    // Try to score with a player who is not the current one.
    assert.throws(() => {
      const nextPlayer = game.getRound(game.currentState.roundId).round_players[1].name;
      game.score(1, nextPlayer, 5);
    }, {
      name: "Error"
    });

    assert.throws(() => {
      game.score(1, game.currentState.player, -1);
    }, {
      name: "Error"
    });    
  });

  it('should not be able to score a point in a non-started game.', () => {
    let game = new Game()
      .addPlayer('Andersona');

    assert.throws(() => {
      game.score(1, 'Andersona', 10);
    }, {
      name: "Error"
    });
  });
  

});
