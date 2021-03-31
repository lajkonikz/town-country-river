const { v4: uuidv4 } = require('uuid');

class Game {
  constructor(language) { 
    this.setLanguage(language);
    this.setInitialStructure();
    this.state = 'NOT_STARTED';
  }

  setLanguage(value){
    if (value === undefined) {
      this.language = 'en-us';
    } else {
      this.language = value;
    }
  }

  setInitialStructure() {
    this.id = this.generateId();
    this.rounds = [];
    this.categories = [];
    this.players = [];
    this.scoreboard = [];
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

  createRounds() {
    const sortedCategories = this.randomSortCategories();
    const letters = this.getAvailableLetters();
    
    for (let i = 0; i < sortedCategories.length; i++) {
      const roundPlayers = this.shuffle(this.players);
      this.rounds.push({
        round_id: i + 1,
        category: sortedCategories[i],
        letter: this.pickRandom(letters),
        round_players: roundPlayers
      });
    }
  }

  start() {
    this.validateStartGame();
    this.createRounds();
  }
}

module.exports = Game;
