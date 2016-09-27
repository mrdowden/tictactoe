$(function() {
    var game = TicTacToe();
    var done = false;

    // Setup Game Event Handlers
    game.onwin(function(winner) {
        done = true;
        var $score = $('#' + winner.toLowerCase() + 'win');
        $score.html( parseInt($score.html()) + 1 );
        showWinner(winner);
    }).ondraw(function() {
        done = true;
        showDraw();
    }).start();


    var $panel = $('.panel');
    var $notification = $('#game .panel-heading');
    var $cells = $('.cell');
    var $turn = $('#turn');

    // Setup
    $notification.hide().removeClass('hidden');

    // Register Event Handlers
    $cells.on('click', function(ev) {
        if(done) return;
        var $cell = $(ev.target);
        if($cell.html() !== '') {
            showError('That space is already taken');
        } else {
            $cell.html(game.currentPlayer());
            var parts = $cell.attr('id').split('-');
            game.takeTurn(parts[1], parts[2]);
            $turn.html(game.currentPlayer());
        }
    });

    $('#again').on('click', function() {
        // Animate the clearing of the game board
        $cells.each(function(i, elem) {
            var $elem = $(elem);
            $elem.animate({color: '#777777'}, function() {
                $elem.html('').css('color', '#ffffff');
            })
        });
        // Hide notification
        $notification.slideUp(function() {
            // Reset Styles
            $notification.html('');
            $panel.removeClass('panel-success panel-danger').addClass('panel-primary');
        });
        // Reset the game
        done = false;
        game.start();
        $turn.html(game.currentPlayer());
    });

    // Utility Functions
    function showError(error) {
        $('#error').html(error).fadeIn(400).delay(2000).fadeOut(800);
    }
    function showWinner(winner) {
        $panel.removeClass('panel-primary').addClass('panel-success');
        $notification.html(winner + ' is the winner!').slideDown();
    }
    function showDraw() {
        $panel.removeClass('panel-primary').addClass('panel-danger');
        $notification.html('The game is a draw').slideDown();
    }
});

var TicTacToe = function() {
    var startPlayer = 'X';
    var player;
    var board;
    var drawHandler;
    var winHandler;
    var plays;

    var winningCombos = [
        [0, 0, 0, 1, 0, 2], //row 1
        [1, 0, 1, 1, 1, 2], //row 2
        [2, 0, 2, 1, 2, 2], //row 3
        [0, 0, 1, 0, 2, 0], //col 1
        [0, 1, 1, 1, 2, 1], //col 2
        [0, 2, 1, 2, 2, 2], //col 3
        [0, 0, 1, 1, 2, 2], //backslash
        [0, 2, 1, 1, 2, 0]  //slash
    ]
    var nextPlayer = function(player) {
        return (player === 'X') ? 'O' : 'X';
    }
    //Tests a set of three row,col coordinates for a win
    var testLine = function(a) {
        var i = 0;
        var r1 = a[i++];
        var c1 = a[i++];
        var r2 = a[i++];
        var c2 = a[i++];
        var r3 = a[i++];
        var c3 = a[i++];
        var cell1 = board[r1][c1];
        return (cell1 === 'X' || cell1 === 'O') && cell1 === board[r2][c2] && cell1 === board[r3][c3];
    }
    var testBoard = function() {
        for(var i in winningCombos) {
            if(testLine(winningCombos[i])) {
                startPlayer = player;
                if(winHandler) winHandler(player);
                return true;
            }
        }
        if(plays >= 9) {
            startPlayer = nextPlayer(startPlayer);
            if(drawHandler) drawHandler();
            return true;
        }
        return false;
    }

    return {
        currentPlayer: function() {
            return player;
        },
        onwin: function(callback) {
            if(typeof callback !== 'function') throw 'callback must be a function';
            winHandler = callback;
            return this;
        },
        ondraw: function(callback) {
            if(typeof callback !== 'function') throw 'callback must be a function';
            drawHandler = callback;
            return this;
        },
        takeTurn: function(row, col) {
            plays++;
            board[row][col] = player;
            if(!testBoard()) {
                player = nextPlayer(player);
            }
        },
        start: function() {
            board = [['','',''],['','',''],['','','']];
            plays = 0;
            player = startPlayer;
        }
    };
};
