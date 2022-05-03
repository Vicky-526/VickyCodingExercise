// generate a deck of card
var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];

  for (var i = 0; i < suits.length; i += 1) {
    var currentSuit = suits[i];

    for (var rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      var cardName = rankCounter;

      if (cardName == 1) {
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
      }

      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter
      };

      cardDeck.push(card);
    }
  }
  return cardDeck;
};

// deck shuffle
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

var shuffleCards = function (cardDeck) {
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    var randomIndex = getRandomIndex(cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cardDeck;
};

// define sub-function to record card value
var cardValue = function (value, condition) {
  var cardNumber = 0;
  // define value for jack, queen, king
  if (value == 11 || value == 12 || value == 13) {
    cardNumber = 10;
  }
  // value for ace
  else if (value == 1) {
    if (condition + 11 <= 21) {
      cardNumber = 11;
    } else {
      cardNumber = 1;
    }
  }
  // value for the rest
  else {
    cardNumber = value;
  }
  return cardNumber;
};

// define sub-function to compare two values
var x = 0;
var y = 0;
var compareValue = function (x, y) {
  var gameResult = "please compare the two values";
  // when player bust, deal wins;
  if (x > 21) {
    gameResult = "You bust, computer wins!<br>";
  }
  // when player = 21, player wins;
  else if (x == 21) {
    gameResult = "Black Jack! You draw 21, you win!<br>";
  }
  // when dealer bust, player < 21 wins;
  else if (y == 21) {
    gameResult = "Black Jack! Computer draw 21, computer wins!<br>";
  } else if (x < 21 && y > 21) {
    gameResult = "Computer bust, you win!<br>";
  }
  // when both are under 21, compare value
  else if (x < 21 && y < 21) {
    if (x == y) {
      gameResult = "It is a draw!<br>";
    } else if (x > y) {
      gameResult = "Player wins!!<br>";
    } else {
      gameResult = "Computer wins!!<br>";
    }
  }
  return gameResult;
};

// define sub-function to keep track of betting points
// define initial betting point for player
var a = 100;
// define players input for betting points
var pointTracker = function (x, y, c) {
  var pointResult = " ";
  if (x > 21) {
    a = a - c;
  }
  // when player = 21, player wins;
  else if (x == 21) {
    a = a + 1.5 * c;
  }
  // when dealer bust, player < 21 wins;
  else if (x < 21 && y > 21) {
    a = a + 2 * c;
  }
  // when both are under 21, compare value
  else if (x < 21 && y <= 21) {
    if (x == y) {
      a = a - c;
    } else if (x > y) {
      a = a + 2 * c;
    } else {
      a = a - c;
    }
  }
  return a;
};

// define global variables
var gameMode = "please key in your name";
var userName = "";
var playerSum = 0;
var computerSum = 0;
var playerCardRecord = "You draw: <br>";
var computerCardRecord = "<br> Computer draw: <br>";
var playerCard = "";
var computerCard = "";
var bettingPoint = 0;
var finalPoints = 100;
// Basic game: only one player and computer
var main = function (input) {
  // define variables
  var myOutputValue = "please key in your name";
  var aDeckofCard = makeDeck();
  var shuffledDeck = shuffleCards(aDeckofCard);
  var finalResult = "";

  // key in players name
  if (gameMode == "please key in your name") {
    userName = input;
    myOutputValue =
      "Hi, " +
      userName +
      "! Welcome to the Blackjack Game!<br><br>You have total $100 to bet.<br>Now please key in your betting point for this round.";
    gameMode = "please key in betting point";
    return myOutputValue;
  }
  // player key in betting points
  else if (gameMode == "please key in betting point") {
    if (Number.isNaN(Number(input)) == true) {
      myOutputValue = "Sorry please enter a number.";
      return myOutputValue;
    }
    if (input > finalPoints) {
      myOutputValue =
        "You do not have enough points, please key in a value you can afford to bet.";
      return myOutputValue;
    } else {
      bettingPoint = input;
      myOutputValue =
        userName +
        ", your bet for this round is $" +
        bettingPoint +
        ".<br> Press 'submit' to start dealing cards!";
      gameMode = "start dealing cards";
      return myOutputValue;
    }
  }
  // dealing cards - first 2 cards for player and computer - record both values
  else if (gameMode == "start dealing cards") {
    for (var i = 0; i < 2; i += 1) {
      playerCard = shuffledDeck.pop();
      playerCardRecord += playerCard.name + " of " + playerCard.suit + ".<br>";
      playerSum += cardValue(playerCard.rank, playerSum);
    }

    for (var j = 0; j < 2; j += 1) {
      computerCard = shuffledDeck.pop();
      computerCardRecord +=
        computerCard.name + " of " + computerCard.suit + ".<br>";
      computerSum += cardValue(computerCard.rank, computerSum);
    }
    myOutputValue =
      playerCardRecord +
      computerCardRecord +
      "<br>Please key in 'h' for hit or 's' for stand.";
    gameMode = "hit or stand";
    return myOutputValue;
  } else if (gameMode == "hit or stand") {
    // player decides to 'hit' or 'stand', deal cards till player is bust or player decides to 'stand';
    if (input == "h") {
      playerCard = shuffledDeck.pop();
      playerCardRecord += playerCard.name + " of " + playerCard.suit + ".<br>";
      playerSum += cardValue(playerCard.rank, playerSum);
      myOutputValue =
        playerCardRecord + "<br>Please in 'h' for hit or 's' for stand.";
      return myOutputValue;
    }

    if (input == "s") {
      // dealer decides to 'hit' or 'stand';
      // if sum < 17, dealer automatically 'hit';
      // if sum > 17, dealer automatically 'stand';
      while (computerSum < 17) {
        computerCard = shuffledDeck.pop();
        computerCardRecord +=
          computerCard.name + " of " + computerCard.suit + ".<br>";
        computerSum += cardValue(computerCard.rank, computerSum);
      }
      myOutputValue =
        playerCardRecord +
        computerCardRecord +
        "<br>Please hit 'submit' to see the game result.";
      gameMode = "compare game result";
      return myOutputValue;
    }
  }

  // compare player & computer to compare result;
  // track and record player's bet;
  else if (gameMode == "compare game result") {
    finalResult = compareValue(playerSum, computerSum);
    finalPoints = pointTracker(playerSum, computerSum, bettingPoint);
    myOutputValue =
      "Your total value is " +
      playerSum +
      ".<br>Computer total value is " +
      computerSum +
      ".<br><br>" +
      finalResult +
      "<br>Your current cash is $" +
      finalPoints +
      ".<br>";
    gameMode = "restart game";
    // if remaining betting point = 0, stop game and restart a new round;
    if (finalPoints <= 0) {
      myOutputValue +=
        "<br>You have lost all bet, pleaes click 'submit' to restart the game.<br>You will have $100 to bet. Good luck!";
      finalPoints = 100;
      a = 100;
    } else {
      myOutputValue += "<br>Please click 'submit' to start a new round.";
    }
    return myOutputValue;
  }

  // player click 'submit', restart the game, loop back;
  else if (gameMode == "restart game") {
    // reset all values
    playerSum = 0;
    computerSum = 0;
    playerCardRecord = "You draw: <br>";
    computerCardRecord = "<br> Computer draw: <br>";
    playerCard = "";
    computerCard = "";
    bettingPoint = 0;
    myOutputValue = "Hi " + userName + ", Please key in your bet.";
    gameMode = "please key in betting point";
    return myOutputValue;
  }
};
