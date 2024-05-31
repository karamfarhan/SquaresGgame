  document.addEventListener("DOMContentLoaded", () => {
    const numberPatterns = {
      0: { "matrix": [116, 117, 118, 142, 144, 168, 170, 194, 196, 220, 221, 222], "color": "#FF0000" },
      1: { "matrix": [117, 142, 143, 169, 195, 220, 221, 222], "color": "#F1570C" },
      2: { "matrix": [116, 117, 118, 144, 168, 169, 170, 194, 220, 221, 222], "color": "#F19F0C" },
      3: { "matrix": [116, 117, 118, 144, 168, 169, 170, 196, 220, 221, 222], "color": "#EDF10C" },
      4: { "matrix": [116, 118, 142, 144, 168, 169, 170, 196, 222], "color": "#A6F10C" },
      5: { "matrix": [116, 117, 118, 142, 168, 169, 170, 196, 220, 221, 222], "color": "#49F10C" },
      6: { "matrix": [116, 117, 118, 142, 168, 169, 170, 194, 196, 220, 221, 222], "color": "#0CF14C" },
      7: { "matrix": [116, 117, 118, 144, 170, 196, 222], "color": "#0CF1DF" },
      8: { "matrix": [116, 117, 118, 142, 144, 168, 169, 170, 194, 196, 220, 221, 222], "color": "#0C86F1" },
      9: { "matrix": [116, 117, 118, 142, 144, 168, 169, 170, 196, 220, 221, 222], "color": "#0C2FF1" }
  };
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




    function displayNumberOnBoard(squaresBoard, number) {
      console.log(`displaying number ${number} on board`);
      // Choose the pattern for the given number
      const pattern = numberPatterns[number];


      // Reset all squares to default color
      for (let key in squaresBoard) {
        squaresBoard[key].color = "";
      }

      // Apply the pattern to the board
      pattern.matrix.forEach(index => {
        squaresBoard[index.toString()].color = pattern.color;
      });

      // Update the board display
      for (let key in squaresBoard) {
          const square = document.getElementById(key);
          if (square) {
              square.style.backgroundColor = squaresBoard[key].color;
          }
      }

    //   // Update Board directlly from the pattern data,(no need to applay on board)

    //   pattern.matrix.forEach(index => {
    //     const square = document.getElementById(index.toString());
    //     if (square) {
    //         square.style.backgroundColor = pattern.color;
    //     }
    // });
  }
    const clearBoard = () => {
      while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
      }
    };
    // Reset all squares to default color
    const ResetBoard = (squaresBoard) => {
      for (let key in squaresBoard) {
        squaresBoard[key].color = "";
      }
      return squaresBoard
    };

    const displayPlayers = (players) => {
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
        // if countdown_type is game and squares get provided
        if (countdown_type === "ready_timer" && squaresBoard) {
          displayNumberOnBoard(squaresBoard, seconds);
        }
        if (seconds > 0) {
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
      clearBoard();
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
          displayPlayers(gameData.players);
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
