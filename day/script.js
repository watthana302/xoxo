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
    console.log("ผู้เล่นน้ำเงินเริ่ม")
    $(this).addClass('current');
    $('.player-1').addClass('blue');
    $('.player-2').addClass('red');
    
  });
  
  /*clicking on player2 button gives class current to player 2*/
  $('.player2').click(function() {
    console.log("ผู้เล่นแดงเริ่ม")
    $(this).addClass('current');
    $('.player-1').addClass('red');
    $('.player-2').addClass('blue');
  });

  $(".random-player").click(function () {
    var randomNumber = Math.random();
    if (randomNumber < 0.5) {
      $(".player1").addClass("current");
      $(".player-1").addClass("blue");
      $(".player-2").addClass("red");
    } else {
      $(".player2").addClass("current");
      $(".player-1").addClass("red");
      $(".player-2").addClass("blue");
    }
  });
  
  $('.newgame').click(function() {
    console.log("เริ่มเกมใหม่")
    newGame();
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
    console.log("คลิ๊กcell")
    if ($(this).hasClass('blue')||$(this).hasClass('red')){
      
      alert('Someone has already claimed this cell!');
      
    } else {
    
      var cellIndex = $(this).index();
      
      var boxIndex = $(this).parent().index();
      
      if ($('.player1').hasClass('current')) {
        //สีcellที่กด//
        $(this).addClass('blue');
        
        var currentArray = blueMoves[boxIndex];
      
        blueMoves[boxIndex].push(cellIndex);
        boxLimit[boxIndex].push(cellIndex);
         var boxLimitCheck = boxLimit[boxIndex].length;
        
        let blueWinsBox = isWinner(currentArray);
     
        if (blueWinsBox == true) {
          console.log("สีน้ำเงินชนะในช่องนี้")
          $(this).siblings('.overlay').removeClass('gray-overlay').addClass('blue-overlay').show();
          
          blueGlobal.push(boxIndex);
          globalLimit.push('globalLimit: ' + boxIndex);
          
          var blueWinsGame = isWinner(blueGlobal);
          
        } else if (blueWinsBox == false && (boxLimit[boxIndex].length) == 9) {
          isBoxDraw(boxIndex, this, globalLimit);
        }
       
        if (blueWinsGame === true) {
          console.log("สีน้ำเงินชนะเกมนี้")
          youWin('blue');
        }
        
        isGameDraw(blueWinsGame);
  
        
        togglePlayer()
  
     
      } else if ($('.player2').hasClass('current')) {
        
        $(this).addClass('red');
        
        var currentArray = redMoves[boxIndex];
        
        redMoves[boxIndex].push(cellIndex);
        boxLimit[boxIndex].push(cellIndex);
         var boxLimitCheck = boxLimit[boxIndex].length;
        
        let redWinsBox = isWinner(currentArray);
      
        if (redWinsBox == true) {
          console.log("สีแดงชนะในช่องนี้")
          $(this).siblings('.overlay').removeClass('gray-overlay').addClass('red-overlay').show();
         
          redGlobal.push(boxIndex);
          globalLimit.push(boxIndex);
          
          redWinsGame = isWinner(redGlobal);
          
  
        } else if (redWinsBox == false && (boxLimit[boxIndex].length) == 9) {
          console.log("ช่องนี้เสมอ")
          isBoxDraw(boxIndex, this, globalLimit);
        }
        
        if (redWinsGame == true) {
          console.log("สีแดงชนะเกมนี้")
          youWin('red');
        }
        /* check whether this move ends the game in a draw */
        isGameDraw(redWinsGame);
  
        /*switch player after move*/
        togglePlayer()
  
       
      } else {
        alert('Choose starting player.')
      }
    } /*else close - */
  
    
   
    if (($('.player1').hasClass('current') || $('.player2').hasClass('current')) && (!$(this).hasClass('blue') || !$(this).hasClass('red'))) {
    
      if ($('.overlay').eq(cellIndex).hasClass('blue-overlay')||$('.overlay').eq(cellIndex).hasClass('red-overlay')||(boxLimit[cellIndex].length) == 9) {
        $('.overlay.gray-overlay:not(.blue-overlay):not(.red-overlay)').hide();
      } else {
        

        $('.overlay').show();
        $('.overlay').eq(cellIndex).hide();
      }
    }
  })
  
  
  
  
  function isBoxDraw(boxIndex, element, globalArray) /*element = this*/{
      $(element).siblings('.overlay').removeClass('gray-overlay').addClass('draw-overlay').show();
      globalArray.push(boxIndex);
      isGameDraw(globalArray);
  }
  
 
  function isGameDraw(winStatus) {
    if (winStatus == false && globalLimit.length == 9) {
      
      bruh.play();
      
      
    }
  }
  
 
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
  var blueScore = 0;
  var redScore = 0;
  var score = 1;
    /*if someone has won the game (this was already verified elsewhere), block the gamefield and display winner banner*/
    
    
    
    function youWin(color) {
      // ...
      if (color == 'red') {
        // ...
        redScore++;
        $('#red-score').text(redScore);
      } else if (color == 'blue') {
        // ...
        blueScore++;
        $('#blue-score').text(blueScore);
      }

      score++;
      $('#round-score').text(score);
      winnersound.play();
        newGame();
      // ...
    }
  
  function togglePlayer() {
    $('.player1').toggleClass('current');
    $('.player2').toggleClass('current');
    console.log("สลับฝั่ง")
  }
  function newGame() {
    blueMoves = [[],[],[],[],[],[],[],[],[]];
    redMoves = [[],[],[],[],[],[],[],[],[]];
    boxLimit = [[],[],[],[],[],[],[],[],[]];
    blueGlobal = [];
    redGlobal = [];
    globalLimit = [];
    blueWinsGame = false;
    redWinsGame = false;
    $('.cell').removeClass('blue red');
    $('.game-overlay').removeClass('blue-overlay red-overlay');
    $('.overlay').removeClass('blue-overlay red-overlay').addClass('gray-overlay').hide();
    togglePlayer();
  }
  
  // กำหนดให้ปุ่ม "New Game" มีการเชื่อมต่อกับฟังก์ชัน newGame()
  
  });/*DNT*/