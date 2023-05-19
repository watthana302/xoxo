$(document).ready(function() {/*DNT*/

  /** GENERATE GAMEFIELD **/
  /*generate outer grid*/
  for (var i = 0; i < 9; i++) {
    $('#game').prepend('<div class="box"><div class="overlay gray-overlay"></div></div>');
  };
  
  /*generate inner grids*/
  for (var i = 0; i < 9; i++) {
   $('.box').prepend('<div class="cell"></div>');
  };
  
  /** SELECT PLAYER **/
  /*clicking on player1 button gives class current to player 1*/
  $('.player1').click(function() {
    $(this).addClass('current');
  });
  
  /*clicking on player2 button gives class current to player 2*/
  $('.player2').click(function() {
    $(this).addClass('current');
  });
  
  /** SHOW/HIDE INFO **/
  /*show info when clicking on instructions button*/
  $('.btn-info').click(function() {
    $('#container').addClass('active');
    $('.info').addClass('active');
  });
  
  /*hide info when clicking on close button*/
  $('.info-close').click(function() {
    $('#container').removeClass('active');
    $('.info').removeClass('active');
  });
  
  /** GLOBAL VARIABLES for winning conditions **/
  var blueMoves = [
    [],[],[],[],[],[],[],[],[]
  ];
  var redMoves = [
    [],[],[],[],[],[],[],[],[]
  ];
  var boxLimit = [
    [],[],[],[],[],[],[],[],[]
  ];
  var blueGlobal = [];
  var redGlobal = [];
  var globalLimit = [];
  var blueWinsGame = false;
  var redWinsGame = false;
  
  /* * * * * GAME MECHANICS * * * * * */
  /*when clicking on whichever cell*/
  $('.cell').click(function() {
    /*if the cell has already been claimed*/
    if ($(this).hasClass('blue')||$(this).hasClass('red')){
      /*display alert*/
      alert('Someone has already claimed this cell!');
      /*otherwise*/
    } else {
      /*grab current cell index*/
      var cellIndex = $(this).index();
      /*grab current box index*/
      var boxIndex = $(this).parent().index();
      /*if player1 is active, the current cell becomes blue*/
      if ($('.player1').hasClass('current')) {
        $(this).addClass('blue');
        /*select the blue array which index matches the current box*/
        var currentArray = blueMoves[boxIndex];
        /*add cell index to the array*/
        blueMoves[boxIndex].push(cellIndex);
        boxLimit[boxIndex].push(cellIndex);
         var boxLimitCheck = boxLimit[boxIndex].length;
        /*check whether this move wins the box*/
        let blueWinsBox = isWinner(currentArray);
        /*if blue wins*/
        if (blueWinsBox == true) {
          /*block box with blue overlay*/
          $(this).siblings('.overlay').removeClass('gray-overlay').addClass('blue-overlay').show();
          /*send box index to global array*/
          blueGlobal.push(boxIndex);
          globalLimit.push('globalLimit: ' + boxIndex);
          /*check whether this box wins the game*/
          var blueWinsGame = isWinner(blueGlobal);
          /*check whether this box marks a draw*/
        } else if (blueWinsBox == false && (boxLimit[boxIndex].length) == 9) {
          isBoxDraw(boxIndex, this, globalLimit);
        }
        /*if true, celebrate*/
        if (blueWinsGame === true) {
          youWin('blue');
        }
        /* check whether this move ends the game in a draw */
        isGameDraw(blueWinsGame);
  
        /*switch player after move*/
        toogleplayer()
  
      /*if player2 is active*/
      } else if ($('.player2').hasClass('current')) {
        /*the current cell becomes red*/
        $(this).addClass('red');
        /*select the red array which index matches the current box*/
        var currentArray = redMoves[boxIndex];
        /*add cell index to the array*/
        redMoves[boxIndex].push(cellIndex);
        boxLimit[boxIndex].push(cellIndex);
         var boxLimitCheck = boxLimit[boxIndex].length;
        /*check whether this move wins the box*/
        let redWinsBox = isWinner(currentArray);
        /*if red wins*/
        if (redWinsBox == true) {
          /*block box with red overlay*/
          $(this).siblings('.overlay').removeClass('gray-overlay').addClass('red-overlay').show();
          /*send box index to global array*/
          redGlobal.push(boxIndex);
          globalLimit.push(boxIndex);
          /*check whether this box wins the game*/
          redWinsGame = isWinner(redGlobal);
          /*check whether this box marks a draw*/
  
        } else if (redWinsBox == false && (boxLimit[boxIndex].length) == 9) {
          isBoxDraw(boxIndex, this, globalLimit);
        }
        /*if true, celebrate*/
        if (redWinsGame == true) {
          youWin('red');
        }
        /* check whether this move ends the game in a draw */
        isGameDraw(redWinsGame);
  
        /*switch player after move*/
        toogleplayer()
  
      /*if no player is active, a starting player has not yet been picked => display alert*/
      } else {
        alert('Choose starting player.')
      }
    } /*else close - */
  
    /** DYNAMIC OVERLAYS **/
    /*if there's already an active player AND the cell you picked wasn't already claimed*/
    if (($('.player1').hasClass('current') || $('.player2').hasClass('current')) && (!$(this).hasClass('blue') || !$(this).hasClass('red'))) {
      /*if the cell you play redirects to a box that has already been won or ended in a draw, all the boxes that are still up for grabs become playable*/
      if ($('.overlay').eq(cellIndex).hasClass('blue-overlay')||$('.overlay').eq(cellIndex).hasClass('red-overlay')||(boxLimit[cellIndex].length) == 9) {
        $('.overlay.gray-overlay:not(.blue-overlay):not(.red-overlay)').hide();
      } else {
        /*make it so that when you pick a cell, the only playable box for the next move is the one matching the current cell's index*/
        $('.overlay').show();
        $('.overlay').eq(cellIndex).hide();
      }
    }
  })
  
  /* * * * * * FUNCTIONS * * * * * * */
  
  /* check whether a move completes a box without it being won by anyone */
  function isBoxDraw(boxIndex, element, globalArray) /*element = this*/{
      $(element).siblings('.overlay').removeClass('gray-overlay').addClass('draw-overlay').show();
      globalArray.push(boxIndex);
      isGameDraw(globalArray);
  }
  
  /* check whether this move wins the game */
  function isGameDraw(winStatus) {
    if (winStatus == false && globalLimit.length == 9) {
      /*block the whole gamefield with blue overlay*/
      $('.game-overlay').addClass('draw-overlay').show();
      /*announce winner*/
      $('#winner h1').text("It's a draw!").show();
      $('#winner').show();
    }
  }
  
  /*check whether the numbers in the array match winning conditions*/
  function isWinner(array) {
    if((array.includes(0))&&(array.includes(1))&&(array.includes(2)) ||
    (array.includes(3))&&(array.includes(4))&&(array.includes(5)) ||
    (array.includes(6))&&(array.includes(7))&&(array.includes(8)) ||
    (array.includes(0))&&(array.includes(3))&&(array.includes(6)) ||
    (array.includes(1))&&(array.includes(4))&&(array.includes(7)) ||
    (array.includes(2))&&(array.includes(5))&&(array.includes(8)) ||
    (array.includes(0))&&(array.includes(4))&&(array.includes(8)) ||
    (array.includes(2))&&(array.includes(4))&&(array.includes(6))) {
      return true;
    } else {
      return false;
    }
  }
  
  /*if someone has won the game (this was already verified elsewhere), block the gamefield and display winner banner*/
  function youWin(color) {
    if (color == 'red') {
      /*block the whole gamefield with red overlay*/
      $('.game-overlay').addClass('red-overlay').show();
      /*announce winner*/
      $('#winner h1').text('Red wins').show();
      $('#winner').show();
    } else if (color == 'blue') {
      /*block the whole gamefield with blue overlay*/
      $('.game-overlay').addClass('blue-overlay').show();
      /*announce winner*/
      $('#winner h1').text('Blue wins').show();
      $('#winner').show();
      /*if no one wins*/
    }
  }
  function toogleplayer(){
    $('.player1').toggleClass('current');
        $('.player2').toggleClass('current');
  }
  
  });/*DNT*/