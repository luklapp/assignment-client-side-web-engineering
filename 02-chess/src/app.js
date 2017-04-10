import config from './config';

const chessboard = require('chessboardjs'),
    Chess = require('chess.js'),
    io = require('socket.io-client');

const client = io.connect(config.SERVER_URL),
    game = new Chess.Chess(),
    board = new chessboard('board', {
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop
    });
let player;

function onDragStart() {
    if(
        game.game_over() ||
        game.turn() === 'w' && player !== 'white' ||
        game.turn() === 'b' && player !== 'black'
    ) {
        swal({
            title: 'Error!',
            text: `It's not your turn!`,
            type: 'error'
        });
        return false;
    }
}

function onDrop(from, to) {
    console.log("drop")

    const move = game.move( {
        from,
        to,
        promotion: 'q'
    });

    if (move === null) {
        return 'snapback';
    }

    client.emit('move', {
        move: move.san
    });

    highlightMove(move);
    updateBoard();

}

function highlightMove(move) {
    $('.square-55d63').removeClass('highlight');
    $(`.square-${move.from}`).addClass('highlight');
    $(`.square-${move.to}`).addClass('highlight');
}

function updateBoard(data) {
    if(data) {
        const move = game.move(data.move);
        board.move( move.from + '-' + move.to );
        highlightMove(move);
    }

    // History
    const history = game.history( {verbose: true} ).reverse();
    $('div.history').html('');
    history.forEach((item) => {
        const el = $(`<div class="item">${item.piece}: ${item.from} -> ${item.to}</div>`);
        el.on('click', (e) => {
            highlightMove(item);
        });
        $('div.history').append(el);
    });

    // TODO: Clock?
    $('#turn').removeClass('b w');
    $('#turn').addClass(game.turn());

    let msg;

    // checkmate
    if (game.in_checkmate() === true) {
        msg = `Game over, ${game.turn()} lost!`;
    }
    // draw
    else if (game.in_draw() === true) {
        msg = `Draw!`;
    }
    // stalemate
    else if(game.in_stalemate()) {
        msg = `Game over, ${game.turn()} is in stalemate!`;
    }

    if(msg) {
        swal({
            title: `Game finished!`,
            text: msg,
            type: 'info'
        });
        return;
    }

    if(player === 'white' && game.turn() == 'w' || player === 'black' && game.turn() == 'b') {
        swal({
            text: `It's your turn!`,
            type: 'info'
        });
    } else {
        swal({
            text: `It's your opponent's turn!`,
            type: 'info'
        });
    }
}

function init() {
    // Join game if ID is in URL
    if (window.location.pathname.length > 1) {
        client.emit( 'join game', {game: window.location.pathname.substr( 1 )} );
    } else {
        $('#hello-modal').modal({
            onApprove: (data) => {
                client.emit('new game');
            },
            onDeny: (data) => {
                $('#join-game-modal').modal({
                    onApprove: (data) => {
                        client.emit('join game', {
                            game: $('#join-game-modal input').val()
                        });
                    }
                }).modal('show');
            }
        }).modal('show');
    }
}

function enableLoader(text) {
    $('.ui.dimmer').addClass('active');
    if(text) {
        $('.ui.loader').html(text);
    }
}

function disableLoader() {
    $('.ui.dimmer').removeClass('active');
}

function undo() {
    game.undo();
    board.position( game.fen(), false );
    updateBoard();
}

function restart() {
    game.reset();
    board.position( game.fen(), false );
    updateBoard();
}

// TODO: Remove
window.client = client;
window.board = board;
window.game = game;

// *** Events *** //

client.on( 'game created', (data) => {
    window.history.pushState( data, data.game.id, '/' + data.game.id );
});

client.on('game started', (data) => {
    disableLoader();
});

client.on('game joined', (data) => {
    enableLoader('Loading...');

    game.load_pgn( data.game.pgn );
    board.position( data.game.fen, false );
    board.orientation( data.player.color );
    player = data.player.color;
    swal(
        'Game joined!',
        `Your color is <b>${player}</b>!<br>Game ID: <b>${data.game.id}</b>`,
        'success'
    ).then(() => {
        updateBoard();
    });
});

client.on('move', (data) => {
    updateBoard(data)
});

client.on( 'undo', function() {
    undo();
});

client.on( 'restart', function() {
    restart();
});

/* BUTTONS, SIDEBAR */

// Sidebar (History)
$('div.history').sidebar({
    dimPage: false,
    transition: 'overlay'
}).sidebar('attach events', '.button.history');

// Undo
$('.button.undo').on('click', (e) => {
    undo();
client.emit('undo');
});

// Restart
$('.button.restart').on('click', (e) => {
    restart();
    client.emit('restart');
});

init();