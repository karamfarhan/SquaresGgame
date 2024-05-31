  document.addEventListener("DOMContentLoaded", () => {
    const numberPatterns = {
      "0": {"matrix": [[1, 1, 1], [1, 0, 1], [0, 1, 0], [1, 0, 1], [1, 1, 1]], "color": "#00FF00"},
      "1": {"matrix": [[0, 1, 0], [1, 1, 0], [0, 1, 0], [0, 1, 0], [1, 1, 1]], "color": "#fc0703"},
      "2": {"matrix": [[1, 1, 1], [0, 0, 1], [1, 1, 1], [1, 0, 0], [1, 1, 1]], "color": "#fcbe03"},
      "3": {"matrix": [[1, 1, 1], [0, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]], "color": "#e3fc03"},
      "4": {"matrix": [[1, 0, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [0, 0, 1]], "color": "#88fc03"},
      "5": {"matrix": [[1, 1, 1], [1, 0, 0], [1, 1, 1], [0, 0, 1], [1, 1, 1]], "color": "#03fc39"},
      "6": {"matrix": [[1, 1, 1], [1, 0, 0], [1, 1, 1], [1, 0, 1], [1, 1, 1]], "color": "#03fcc2"},
      "7": {"matrix": [[1, 1, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]], "color": "#03b1fc"},
      "8": {"matrix": [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 1, 1]], "color": "#0703fc"},
      "9": {"matrix": [[1, 1, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]], "color": "#3503fc"},
      "A": {"matrix": [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]], "color": "#ff0000"},
      "B": {"matrix": [[1, 1, 0], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 1, 0]], "color": "#00ff00"},
      "C": {"matrix": [[1, 1, 1], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 1, 1]], "color": "#0000ff"},
      "D": {"matrix": [[1, 1, 0], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 0]], "color": "#ff0000"},
      "E": {"matrix": [[1, 1, 1], [1, 0, 0], [1, 1, 1], [1, 0, 0], [1, 1, 1]], "color": "#00ff00"},
      "F": {"matrix": [[1, 1, 1], [1, 0, 0], [1, 1, 1], [1, 0, 0], [1, 0, 0]], "color": "#0000ff"},
      "G": {"matrix": [[1, 1, 1], [1, 0, 0], [1, 0, 1], [1, 0, 1], [1, 1, 1]], "color": "#ff0000"},
      "H": {"matrix": [[1, 0, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]], "color": "#00ff00"},
      "I": {"matrix": [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [1, 1, 1]], "color": "#0000ff"},
      "J": {"matrix": [[1, 1, 1], [0, 0, 1], [0, 0, 1], [1, 0, 1], [1, 1, 1]], "color": "#ff0000"},
      "K": {"matrix": [[1, 0, 1], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 0, 1]], "color": "#00ff00"},
      "L": {"matrix": [[1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 1, 1]], "color": "#00FF00"},
      "M": {"matrix": [[1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1]], "color": "#ff0000"},
      "N": {"matrix": [[1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1]], "color": "#00ff00"},
      "O": {"matrix": [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]], "color": "#0000ff"},
      "P": {"matrix": [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 0], [1, 0, 0]], "color": "#ff0000"},
      "Q": {"matrix": [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1]], "color": "#00ff00"},
      "R": {"matrix": [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]], "color": "#0000ff"},
      "S": {"matrix": [[1, 1, 1], [1, 0, 0], [1, 1, 1], [0, 0, 1], [1, 1, 1]], "color": "#ff0000"},
      "T": {"matrix": [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]], "color": "#00ff00"},
      "U": {"matrix": [[1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]], "color": "#0000ff"},
      "V": {"matrix": [[1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [0, 1, 0]], "color": "#ff0000"},
      "W": {"matrix": [[1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1]], "color": "#00ff00"},
      "X": {"matrix": [[1, 0, 1], [1, 0, 1], [0, 1, 0], [1, 0, 1], [1, 0, 1]], "color": "#0000ff"},
      "Y": {"matrix": [[1, 0, 1], [1, 0, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0]], "color": "#ff0000"},
      "Z": {"matrix": [[1, 1, 1], [0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 1]], "color": "#00ff00"}
    }
    const playerName = JSON.parse(document.getElementById("name").textContent);
    const gameId = JSON.parse(document.getElementById("game_id").textContent);
    const gameMod = JSON.parse(document.getElementById("game_mod").textContent);
    const playerColor = JSON.parse(document.getElementById("color").textContent);

    const container = document.querySelector(".game-container");
    const gameBoard = document.querySelector(".game-board");
    const playerInform = document.querySelector(".scoreboard");
    const timer = document.getElementById("timer");
    const replayBtn = document.getElementById("again-btn");

    const httpScheme = window.location.protocol;
    const wsScheme = httpScheme === "https:" ? "wss" : "ws";

    const wsChat = new WebSocket(`${wsScheme}://${window.location.host}/ws/chat/${gameId}/${playerName}/`);
    const wsGame = new WebSocket(`${wsScheme}://${window.location.host}/ws/game/${gameId}/${playerName}/`);

    if (window.performance.getEntriesByType("navigation")[0].type === "reload") {
      window.location.replace(`${httpScheme}//${window.location.host}`);
    }


    function displayOnBoard(squaresBoard, textToDisplay, clear_board = true, startRow = 4, startCol = 11) {
      console.log(`Displaying ${textToDisplay} on board`);

      if (clear_board) {
        ClearBoard(squaresBoard);
      }

      let currentStartCol = startCol;

      for (let i = 0; i < textToDisplay.length; i++) {
        const charToDisplay = textToDisplay[i];
        const charData = numberPatterns[charToDisplay];

        if (!charData) {
          console.error(`Character data not found for: ${charToDisplay}`);
          continue;
        }

        // Apply the charData to the board
        for (let row = 0; row < charData.matrix.length; row++) {
          for (let col = 0; col < charData.matrix[row].length; col++) {
            if (charData.matrix[row][col] === 1) {
              const boardIndex = (startRow + row) * 26 + (currentStartCol + col) + 1;
              squaresBoard[boardIndex.toString()].color = charData.color;
            }
          }
        }

        // Move to the next start column for the next character
        currentStartCol += charData.matrix[0].length + 1; // Adding 1 for space between characters
      }

      // Update the board display
      for (let key in squaresBoard) {
        const square = document.getElementById(key);
        if (square) {
          square.style.backgroundColor = squaresBoard[key].color;
        }
      }
    }


    function displayOnBoard1(squaresBoard, charToDisplay, clear_board = true, startRow = 4, startCol = 11) {
      console.log(`displaying number ${charToDisplay} on board`);
      // Choose the charData for the given number
      const charData = numberPatterns[charToDisplay];


      // Reset all squares to default color
      if (clear_board) {
        ClearBoard(squaresBoard);
      }

      // // Calculate starting position to center the number
      // const startRow = 4; // Centering vertically in a 14 rows grid
      // const startCol = 11; // Centering horizontally in a 26 columns grid

      // Apply the charData to the board
      for (let row = 0; row < charData.matrix.length; row++) {
        for (let col = 0; col < charData.matrix[row].length; col++) {
          if (charData.matrix[row][col] === 1) {
            const boardIndex = (startRow + row) * 26 + (startCol + col) + 1;
            squaresBoard[boardIndex.toString()].color = charData.color;
          }
        }
      }
      // // Apply the charData to the board for when i have the id of each square
      // charData.matrix.forEach(index => {
      //   squaresBoard[index.toString()].color = charData.color;
      // });

      // Update the board display
      for (let key in squaresBoard) {
          const square = document.getElementById(key);
          if (square) {
              square.style.backgroundColor = squaresBoard[key].color;
          }
      }

    //   // Update Board directlly from the charData data,(no need to applay on board)

    //   charData.matrix.forEach(index => {
    //     const square = document.getElementById(index.toString());
    //     if (square) {
    //         square.style.backgroundColor = charData.color;
    //     }
    // });
  }
    const deleteBoard = () => {
      while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
      }
    };
    // Reset all squares to default color
    const ClearBoard = (squaresBoard) => {
      for (let key in squaresBoard) {
        squaresBoard[key].color = "";
      }
      return squaresBoard
    };

    const displayPlayers = ({players, squares, game_mod, game_id, is_started, start_get_ready = false}) => {
      if (is_started === false && start_get_ready === false && players[playerName].is_ready == true) {
        const totalSquares = Object.keys(squares).length;
        createGameBoard(totalSquares / 26, 26, game_mod === "complete_mod" ? handleCompleteModClick : handleNormalModClick);
        gameBoard.classList.add("done");
        displayOnBoard(squares, game_id, false, 4, 3);
      }
      playerInform.innerHTML = "";
      Object.values(players).forEach((player) => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player", player.is_ready ? "player-ready" : "player-unready");
        playerDiv.id = player.name;
        playerDiv.style.color = player.color;
        playerDiv.innerHTML = `${player.name} <span class="score" id="${player.name}-score">${player.all_time_occupied}</span>`;
        playerInform.appendChild(playerDiv);
      });
    };

    const rgbToHex = (rgb) => {
      const rgbValues = rgb.substring(4, rgb.length - 1).split(",").map(value => parseInt(value.trim(), 10));
      return `#${rgbValues.map(value => value.toString(16).padStart(2, "0")).join("")}`;
    };

    const countResults = () => {
      const results = {};
      document.querySelectorAll(".square").forEach(square => {
        const color = square.style.backgroundColor;
        if (color) {
          const hexColor = rgbToHex(color);
          results[hexColor] = (results[hexColor] || 0) + 1;
        }
      });
      return results;
    };


    const startCountdown = (seconds, callback, countdown_type, squaresBoard = {}) => {
      const tick = () => {
        timer.innerText = `0:${seconds < 10 ? "0" : ""}${seconds}`;
        if (seconds > 0) {
          // if countdown_type is game and squares get provided
          if (countdown_type === "ready_timer" && squaresBoard) {
            displayOnBoard(squaresBoard, seconds.toString());
          }
          seconds--;
          setTimeout(tick, 1000);
        } else {

          callback();
        }
      };
      tick();
    };

    const handleReplayClick = () => {
      wsGame.send(JSON.stringify({
        method: "restart_game",
        data: { game_id: gameId, name: playerName, color: playerColor }
      }));
      replayBtn.classList.add("hide");
    };

    const handleSquareClick = (squareDiv) => {
      // console.log("Clicked")
      if (rgbToHex(squareDiv.style.backgroundColor) !== playerColor) {
        // console.log("if statement passed")
        const prevClickCount = parseInt(squareDiv.innerText) || 0;
        squareDiv.style.backgroundColor = playerColor;
        squareDiv.innerText = prevClickCount + 1;
        wsGame.send(JSON.stringify({
          method: "update_square",
          data: { squareId: squareDiv.id, color: playerColor, clicked: prevClickCount + 1 }
        }));
        // console.log("after the sending to server")
      }
    };

    const createSquare = (id, clickHandler) => {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = id;
      squareDiv.addEventListener("click", () => clickHandler(squareDiv));
      return squareDiv;
    };

    const createRow = (cols, rowIndex, clickHandler) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        rowDiv.appendChild(createSquare(rowIndex * cols + colIndex + 1, clickHandler));
      }
      return rowDiv;
    };

    const createGameBoard = (rows, cols, clickHandler) => {
      deleteBoard();
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        gameBoard.appendChild(createRow(cols, rowIndex, clickHandler));
      }
    };

    replayBtn.addEventListener("click", handleReplayClick);

    wsChat.onmessage = ({ data }) => {
      const { method, data: messageData } = JSON.parse(data);
      if (method === "MSG") {
        displayMessage(messageData.message, "MSG", messageData.player, messageData.player_color);
      } else if (method === "NTF") {
        displayMessage(messageData.message, "NTF");
      }
    };

    wsGame.onmessage = ({ data }) => {
      const { method, data: gameData } = JSON.parse(data);
      switch (method) {
        case "update_square":
          updateSquare(gameData);
          break;
        case "send_results":
          displayRoundResults(gameData);
          break;
        case "start_game":
          startGame(gameData);
          break;
        case "update_players":
          displayPlayers(gameData);
          break;
        case "get_ready":
          handleGetReady(gameData);
          break;
      }
    };

    const updateSquare = ({ squareId, color, clicked }) => {
      const square = document.getElementById(squareId);
      square.style.backgroundColor = color;
      if (gameMod === "normal_mod") {
        square.innerText = clicked;
      }
    };

    const displayRoundResults = ({ players, current_round }) => {
      let results = `Round ${current_round} Results<hr>`;
      for (const player in players) {
        results += `<span style="color: ${players[player].color};">${players[player].name}</span> --> ${players[player].occupied_last_round}<br>`;
      }
      results += "<hr>";
      displayMessage(results, "NTF");
      replayBtn.classList.remove("hide");
    };

    const startGame = ({ squares, game_mod }) => {
      const totalSquares = Object.keys(squares).length;
      createGameBoard(totalSquares / 26, 26, game_mod === "complete_mod" ? handleCompleteModClick : handleNormalModClick);
      gameBoard.classList.remove("done");
      startCountdown(60, endGame, "game_timer");
    };

    const handleCompleteModClick = (squareDiv) => {
      if (!squareDiv.style.backgroundColor) {
        squareDiv.style.backgroundColor = playerColor;
        wsGame.send(JSON.stringify({
          method: "update_square",
          data: { squareId: squareDiv.id, color: playerColor, clicked: null }
        }));
      }
    };

    const handleNormalModClick = (squareDiv) => {
      handleSquareClick(squareDiv);
    };

    const endGame = () => {
      gameBoard.classList.add("done");
      wsGame.send(JSON.stringify({
        method: "player_results",
        data: { game_id: gameId, player_results: countResults() }
      }));
    };

    const handleGetReady = ({ start_get_ready, players , squares, game_mod}) => {
      if (start_get_ready) {
        const totalSquares = Object.keys(squares).length;
        createGameBoard(totalSquares / 26, 26, game_mod === "complete_mod" ? handleCompleteModClick : handleNormalModClick);
        gameBoard.classList.add("done");
        displayMessage("Players Count Completed, Game will Start in 10 seconds", "NTF");
        startCountdown(9, () => wsGame.send(JSON.stringify({ method: "start_game", data: { go_start_game: true } })), "ready_timer", squares);
      }
      if (!(playerName in players)) {
        window.location.replace(`${httpScheme}//${window.location.host}`);
      }
    };

    const displayMessage = (message, type, player = null, playerColor = null) => {
      const chatMessages = document.getElementById("chatMessages");
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("chat-message");
      if (type === "NTF") {
        messageDiv.innerHTML = `<span style="color: red;">[SERVER]</span>: ${message}`;
      } else if (type === "MSG") {
        messageDiv.innerHTML = `<span style="color: ${playerColor};">${player}</span>: ${message}`;
      }
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const sendMessage = () => {
      const chatInput = document.getElementById("chatInput");
      if (chatInput.value.trim()) {
        wsChat.send(JSON.stringify({
          method: "send_message",
          data: {
            message: chatInput.value,
            player: playerName,
            player_color: playerColor,
            game_id: gameId
          }
        }));
        chatInput.value = "";
      }
    };

    document.getElementById("chatInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  });
