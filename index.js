import io from 'socket.io-client';

  // Función para verificar si se algun jugador ha ganado.
  function verificarGanador(tablero, jugador) {
    // Verificar filas
    for (let i = 0; i < tablero.length; i++) {
      for (let j = 0; j <= tablero[i].length - 4; j++) {
        if (
          tablero[i][j] === jugador &&
          tablero[i][j + 1] === jugador &&
          tablero[i][j + 2] === jugador &&
          tablero[i][j + 3] === jugador
        ) {
          return true;
        }
      }
    }
  
    // Verificar columnas
    for (let i = 0; i <= tablero.length - 4; i++) {
      for (let j = 0; j < tablero[i].length; j++) {
        if (
          tablero[i][j] === jugador &&
          tablero[i + 1][j] === jugador &&
          tablero[i + 2][j] === jugador &&
          tablero[i + 3][j] === jugador
        ) {
          return true;
        }
      }
    }
  
    // Verificar diagonales (de izquierda a derecha)
    for (let i = 0; i <= tablero.length - 4; i++) {
      for (let j = 0; j <= tablero[i].length - 4; j++) {
        if (
          tablero[i][j] === jugador &&
          tablero[i + 1][j + 1] === jugador &&
          tablero[i + 2][j + 2] === jugador &&
          tablero[i + 3][j + 3] === jugador
        ) {
          return true;
        }
      }
    }
  
    // Verificar diagonales (de derecha a izquierda)
    for (let i = 0; i <= tablero.length - 4; i++) {
      for (let j = 3; j < tablero[i].length; j++) {
        if (
          tablero[i][j] === jugador &&
          tablero[i + 1][j - 1] === jugador &&
          tablero[i + 2][j - 2] === jugador &&
          tablero[i + 3][j - 3] === jugador
        ) {
          return true;
        }
      }
    }
  
    return false;
  }

  // Función para evaluar el tablero en su estado actual
  function evaluarTablero(tablero, jugadorMax, jugadorMin) {
    let puntuacionTotal = 0;
  
    // Evaluar lineas horizontales
    for (let fila = 0; fila < tablero.length; fila++) {
      for (let columna = 0; columna <= tablero[fila].length - 4; columna++) {
        const linea = tablero[fila].slice(columna, columna + 4);
        puntuacionTotal += evaluarLinea(linea, jugadorMax, jugadorMin);
      }
    }
  
    // Evaluar lineas verticales
    for (let columna = 0; columna < tablero[0].length; columna++) {
      for (let fila = 0; fila <= tablero.length - 4; fila++) {
        const linea = [
          tablero[fila][columna],
          tablero[fila + 1][columna],
          tablero[fila + 2][columna],
          tablero[fila + 3][columna]
        ];
        puntuacionTotal += evaluarLinea(linea, jugadorMax, jugadorMin);
      }
    }
  
    // Evaluar lineas diagonales (de izquierda a derecha)
    for (let fila = 0; fila <= tablero.length - 4; fila++) {
      for (let columna = 0; columna <= tablero[fila].length - 4; columna++) {
        const linea = [
          tablero[fila][columna],
          tablero[fila + 1][columna + 1],
          tablero[fila + 2][columna + 2],
          tablero[fila + 3][columna + 3]
        ];
        puntuacionTotal += evaluarLinea(linea, jugadorMax, jugadorMin);
      }
    }
  
    // Evaluar lineas diagonales (de derecha a izquierda)
    for (let fila = 0; fila <= tablero.length - 4; fila++) {
      for (let columna = 3; columna < tablero[fila].length; columna++) {
        const linea = [
          tablero[fila][columna],
          tablero[fila + 1][columna - 1],
          tablero[fila + 2][columna - 2],
          tablero[fila + 3][columna - 3]
        ];
        puntuacionTotal += evaluarLinea(linea, jugadorMax, jugadorMin);
      }
    }
  
    return puntuacionTotal;
  }
  
  // Función para obtener los movimientos válidos
  function obtenerMovimientosValidos(tablero) {
    const movimientosValidos = [];
    for (let columna = 0; columna < tablero[0].length; columna++) {
      if (tablero[0][columna] === 0) {
        movimientosValidos.push(columna);
      }
    }
    return movimientosValidos;
  }

// Función para evaluar una linea de 4 posiciones (la heurística del juego)
function evaluarLinea(linea, jugador) {
    let puntuacion = 0;
    const oponente = jugador === 1 ? 2 : 1;
  
    // Evaluar linea del jugador
    if (linea.filter(cell => cell === jugador).length === 4) {
      puntuacion += 100;
    } else if (linea.filter(cell => cell === jugador).length === 3 && linea.filter(cell => cell === 0).length === 1) {
      puntuacion += 5;
    } else if (linea.filter(cell => cell === jugador).length === 2 && linea.filter(cell => cell === 0).length === 2) {
      puntuacion += 2;
    }
  
    // Evaluar linea del oponente
    if (linea.filter(cell => cell === oponente).length === 3 && linea.filter(cell => cell === 0).length === 1) {
      puntuacion -= 4;
    }
  
    return puntuacion;
  }
  
  // Función para realizar un movimiento en el tablero
  function hacerMovimiento(tablero, columna, jugador) {
    for (let fila = tablero.length - 1; fila >= 0; fila--) {
      if (tablero[fila][columna] === 0) {
        tablero[fila][columna] = jugador;
        break;
      }
    }
  }
  
  // Función Minimax con poda alfa-beta
  function minimax(tablero, profundidad, alfa, beta, esMaximizador, jugadorMax, jugadorMin) {
    const movimientosValidos = obtenerMovimientosValidos(tablero);
    const ganadorMax = verificarGanador(tablero, jugadorMax);
    const ganadorMin = verificarGanador(tablero, jugadorMin);
    const empate = movimientosValidos.length === 0;
  
    if (profundidad === 0 || ganadorMax || ganadorMin || empate) {
      if (ganadorMax) {
        return 1000000000;
      } else if (ganadorMin) {
        return -1000000000;
      } else {
        return evaluarTablero(tablero, jugadorMax);
      }
    }
  
    if (esMaximizador) {
      let valorMax = -Infinity;
      for (let columna of movimientosValidos) {
        const nuevoTablero = JSON.parse(JSON.stringify(tablero));
        hacerMovimiento(nuevoTablero, columna, jugadorMax);
        const valor = minimax(nuevoTablero, profundidad - 1, alfa, beta, false, jugadorMax, jugadorMin);
        valorMax = Math.max(valorMax, valor);
        alfa = Math.max(alfa, valor);
        if (alfa >= beta) {
          break;
        }
      }
      return valorMax;
    } else {
      let valorMin = Infinity;
      for (let columna of movimientosValidos) {
        const nuevoTablero = JSON.parse(JSON.stringify(tablero));
        hacerMovimiento(nuevoTablero, columna, jugadorMin);
        const valor = minimax(nuevoTablero, profundidad - 1, alfa, beta, true, jugadorMax, jugadorMin);
        valorMin = Math.min(valorMin, valor);
        beta = Math.min(beta, valor);
        if (beta <= alfa) {
          break;
        }
      }
      return valorMin;
    }
  }
  
  // Función para que el jugador automático realice su movimiento
  function hacerMovimientoAutomatico(tablero, jugador) {
    const movimientosValidos = obtenerMovimientosValidos(tablero);
    let mejorValor = -Infinity;
    let mejorColumna = movimientosValidos[Math.floor(Math.random() * movimientosValidos.length)];
    const profundidad = 7; // Profundidad de búsqueda del árbol de juego
  
    for (let columna of movimientosValidos) {
      const nuevoTablero = JSON.parse(JSON.stringify(tablero));
      hacerMovimiento(nuevoTablero, columna, jugador);
      const valor = minimax(nuevoTablero, profundidad, -Infinity, Infinity, false, jugador, jugador === 1 ? 2 : 1);
  
      if (valor > mejorValor) {
        mejorValor = valor;
        mejorColumna = columna;
      }
    }
    return mejorColumna;
  }

//console.log(message);
// const io = require('socket.io-client')
const serverUrl = "http://192.168.1.104:4000"
const socket = io(serverUrl)

const tournamentID = 142857

socket.on('connect', () => {
    console.log("Connected to server")

    socket.emit('signin', {
        user_name: "Oscar",
        tournament_id: tournamentID,
        user_role: 'player'
    })
})

// Sign in correcto.
socket.on('ok_signin', () => {
    console.log("Login")
})

socket.on('ready', function(data){
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var board = data.board;
    console.log(board)
    var movimiento = 0;
    movimiento = hacerMovimientoAutomatico(board, playerTurnID)
    console.log(gameID)
    console.log(movimiento)
    socket.emit('play', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID,
      movement: movimiento
    });
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;
    
  socket.emit('player_ready', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});