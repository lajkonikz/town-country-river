const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

class Game {
  constructor(gameModel) {
    // If a game is provided, load it,
    // otherwise create a NOT_STARTED game.
    if (gameModel) {
      this.loadGame(gameModel);
    } else {
      this.setInitialStructure();
    }
  }

  loadGame(gameModel) {
    var sourceObject = JSON.parse(gameModel);

    const keys = Object.keys(sourceObject);    
    keys.forEach((key, index) => {
      const value = sourceObject[key];
      const dataType = typeof(value);
      this[key] = value;
    });
  }

  setInitialStructure() {
    this.id = this.generateId();
    this.rounds = [];
    this.categories = [];
    this.players = [];
    this.scoreboard = [];
    this.state = 'NOT_STARTED';
    this.pickLetterBehaviour = 'EVERY_GAME';
  }
  
  generateId() {
    return uuidv4();
  }

  excludeLetters(letters) {
    if (!Array.isArray(letters)) {
      throw new Error("Parameter should be an array.");
    }

    this.excludeLetters = letters;
    return this;
  }

  addPlayer(player) {
    if (this.state != 'NOT_STARTED') {
      throw new Error("You only can add players before starting the game.");
    }
    this.players.push(player);
    return this;
  }

  dumps() {
    this.updateCurrentState();
    return JSON.stringify(this, null, 4);
  }

  setCategories(categories) {
    this.categories = categories;
    return this;
  }

  validateStartGame() {
    if (this.state != 'NOT_STARTED') {
      throw new Error("You only can start a game when state is NOT_STARTED.");
    }

    if (this.categories.length == 0) {
      throw new Error("You cannot start a game without setting up the categories.");
    }

    if (this.players.length < 2) {
      throw new Error(`The game only can be started with 2 or more players. You have added ${this.players.length} player(s).`);
    }
  }

  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle(array_to_shuffle) {
    const array = array_to_shuffle.slice(0);
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  randomSortCategories() {
    return this.shuffle(this.categories);
  }

  getAvailableLetters() {
    var all = [], i = "a".charCodeAt(0), j = "z".charCodeAt(0);
    for (; i <= j; ++i) {
      const letter = String.fromCharCode(i);
      if (this.excludeLetters.indexOf(letter) == -1) {
        all.push(letter);
      }
    }
    return this.shuffle(all);
  }

  pickRandom(letters) {
    const max = letters.length - 1;
    const randomIndex = Math.floor(Math.random() * (max - 0)) + 0;
    const chosenLetter = letters[randomIndex];
    letters.splice(letters.indexOf(chosenLetter), 1);
    return chosenLetter;
  }

  setPickLetterBehaviour(pickLetterBehaviour) {
    this.pickLetterBehaviour = pickLetterBehaviour;
    return this;
  }

  createRounds() {
    const sortedCategories = this.randomSortCategories();
    const letters = this.getAvailableLetters();
    
    var letter = this.pickRandom(letters);

    for (let i = 0; i < sortedCategories.length; i++) {
      
      if (this.pickLetterBehaviour == 'EVERY_ROUND') {
        letter = this.pickRandom(letters);
      }

      const roundPlayers = this.shuffle(this.players).map((p) => {
        return {
          name: p,
          scored: false
        }
      });

      this.rounds.push({
        round_id: i + 1,
        category: sortedCategories[i],
        letter: letter,
        round_players: roundPlayers
      });
    }
  }

  setState(state) {
    this.state = state;

    if (this.state == 'STARTED') {
      this.currentState = {
        category: null,
        player: null,
        letter: null,
        roundId: null
      };
    }
  }

  start() {
    this.validateStartGame();
    this.createRounds();
    this.setState('STARTED');
    this.updateCurrentState();
    return this;
  }

  getRound(roundId) {
    return this.rounds[roundId - 1];
  }

  score(roundId, player, points) {
    const round = this.getRound(roundId);

    // Check if game is started.
    if (this.state != 'STARTED') {
      throw new Error(`You only can score in a STARTED game. Current state: ${this.state}`);
    }    

    // Validate round
    if (round === undefined) {
      throw new Error("Round not found.");
    }

    // Validate player
    if (!this.players.includes(player)) {
      throw new Error("Player not found.");
    }

    // Validate points
    if (points < 0) {
      throw new Error("Points should be greater or equal zero.");
    }

    // Validate if player being score is the current one.
    if (this.currentState.player != player) {
      throw new Error(`Player ${player} should not be playing now. Current one is: ${this.currentState.player}`);
    }

    // Score the point, update state and exit the function
    for (let p of round.round_players) {
      if (p.name == player) {
        p.points = points;
        p.scored = true;
        this.updateCurrentState();
        return;
      }
    }
  }

  finish() {
    this.state = 'FINISHED'
    this.currentState = null;
  }

  updateCurrentState() {
    this.updateScoreboard();

    for (let round of this.rounds) {
      for (let player of round.round_players) {
        if (!player.scored) {
          this.currentState.category = round.category,
          this.currentState.player = player.name,
          this.currentState.letter = round.letter,
          this.currentState.roundId = round.round_id
          return true;
        }
      }
    }

    this.finish();
  }

  getPlayersScore() {
    let playersScore = [];
    for (let round of this.rounds) {
      for (let player of round.round_players) {
        playersScore.push({
          name: player.name,
          points: player.points
        });
      }
    }
    return playersScore;
  }

  updateScoreboard() {
    const scoreData = this.getPlayersScore();

    // Group, sum by player name and sort by points
    let scoreboard = _(scoreData)
      .groupBy('name')
      .map((player, playerName) => {
        return {
          name: playerName,
          points: _.sumBy(player, 'points')
        };
      })
      .sortBy(['type','points'])
      .value()
      .reverse();

    this.scoreboard = scoreboard;
  }

  getScoreboard() {
    return this.scoreboard;
  }
}

module.exports = Game;
