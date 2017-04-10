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

    console.log(move)
    updateBoard();

}

function updateBoard(data) {
    if(data) {
        const move = game.move(data.move);
        board.move( move.from + '-' + move.to );
        // TODO: Highlight last move
    }

    // History
    const history = game.history( {verbose: true} );
    $('div.history').html('');
    history.forEach((item) => {
        $('div.history').append(`<div class="item">${item.piece}: ${item.from} -> ${item.to}</div>`);
    });

    // TODO: Clock?
    // TODO: History list
    // TODO: Check for game over
    $('#turn').removeClass('b w');
    $('#turn').addClass(game.turn());

    console.log(player, game.turn());

    if(player === 'white' && game.turn() == 'w' || player === 'black' && game.turn() == 'b') {
        swal({
            text: `It's your turn!`,
            timer: 3000
        });
    }
}

function init() {
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

// TODO: Remove
window.client = client;
window.board = board;
window.game = game;

// *** Events *** //

client.on( 'game created', (data) => {
    console.log('game created', data)
    window.history.pushState( data, data.game.id, '/' + data.game.id );
});

client.on('game started', (data) => {
    disableLoader();
    console.log('game started');
    console.log(data);
});

client.on('game joined', (data) => {
    enableLoader('Waiting for an opponent...');
    console.log('game joined');
    console.log(data);

    game.load_pgn( data.game.pgn );
    console.log(board);

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

function enableLoader(text) {
    $('.ui.dimmer').addClass('active');
    if(text) {
        $('.ui.loader').html(text);
    }
}

function disableLoader() {
    $('.ui.dimmer').removeClass('active');
}

client.on('move', (data) => {
    console.log('move')
    console.log(data)
    updateBoard(data)
});

// Sidebar (History)
$('div.history').sidebar({
    dimPage: false,
    transition: 'overlay'
}).sidebar('attach events', '.button.history');

init();