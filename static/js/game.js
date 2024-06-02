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
    var occupySound = new Audio("/static/audio/occupy.mp3");
    var readyCountDownSound = new Audio("/static/audio/countdownsound9seconds.mp3");
    var systemNotification = new Audio("/static/audio/systemnotification.mp3");
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


    function displayOnBoard(squaresBoard, textToDisplay, rows_count, cols_count ,clear_board, startRow, startCol) {
      // console.log(`Displaying ${textToDisplay} on board`);

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
              const boardIndex = (startRow + row) * cols_count + (currentStartCol + col) + 1;
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

    const displayPlayers = ({players, squares, game_mod, map_size_data, game_id, is_started, start_get_ready = false}) => {
      if (is_started === false && start_get_ready === false && players[playerName].is_ready == true) {
        // const totalSquares = Object.keys(squares).length;
        gameBoard.classList.add("done");
        createGameBoard(map_size_data.rows_count, map_size_data.cols_count, map_size_data.class_name, game_mod === "complete_mod" ? handleCompleteModClick : handleNormalModClick);
        // how much cols would the word take in the board(each letter 3 cols +1 space)
        text_long = (game_id.length * 3) + game_id.length;
        displayOnBoard(squares, game_id, map_size_data.rows_count, map_size_data.cols_count, false, map_size_data.middle_position_to_display_char.row, Math.ceil((map_size_data.cols_count - text_long) / 2));
      }
      playerInform.innerHTML = "";
      Object.values(players).forEach((player) => {
        const playerDiv = document.createElement("div");
        const check_img = `/static/imgs/${ player.is_ready ? "ready-check.png" : "unready-check.png"}`
        playerDiv.id = player.name;
        playerDiv.classList.add("player", player.is_ready ? "player-ready" : "player-unready");
        playerDiv.style.color = player.color;
        playerDiv.innerHTML = `<img type="image/png" sizes="16x16" rel="icon" src="${check_img}">${player.name}<span class="score" id="${player.name}-score">${player.all_time_occupied}</span>`;
        playerInform.appendChild(playerDiv);
      });
    };

    const rgbToHex = (rgb) => {
      const rgbValues = rgb.substring(4, rgb.length - 1).split(",").map(value => parseInt(value.trim(), 10));
      return `#${rgbValues.map(value => value.toString(16).padStart(2, "0")).join("")}`;
    };

    const countResults = () => {
      const player_result = document.querySelectorAll(`.square[value="${playerName}"`).length;
      return player_result;
    };

    const convertSecondstoTime = (given_seconds) => {

      dateObj = new Date(given_seconds * 1000);
      minutes = dateObj.getUTCMinutes();
      seconds = dateObj.getSeconds();

      timeString = minutes.toString().padStart(2, '0')
                   + ':' + seconds.toString().padStart(2, '0');

      return timeString;
  }
    const startCountdown = (seconds, countdown_type, squaresBoard = {}, map_size_data ,callback) => {
      // if (countdown_type === "ready_timer") {
      //   readyCountDownSound.play()
      // }
      const tick = () => {
        timer.innerText = convertSecondstoTime(seconds)
        if (seconds > 0) {
          if (seconds == 9) {
            readyCountDownSound.play()
          }
          // if countdown_type is game and squares get provided
          if (countdown_type === "ready_timer" && squaresBoard) {
            displayOnBoard(squaresBoard, seconds.toString(), map_size_data.rows_count, map_size_data.cols_count ,true ,map_size_data.middle_position_to_display_char.row, map_size_data.middle_position_to_display_char.col);
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
        occupySound.play();
        // console.log("if statement passed")
        const prevClickCount = parseInt(squareDiv.innerText) || 0;
        squareDiv.style.backgroundColor = playerColor;
        squareDiv.setAttribute("value", playerName);
        squareDiv.innerText = prevClickCount + 1;
        wsGame.send(JSON.stringify({
          method: "update_square",
          data: { squareId: squareDiv.id, color: playerColor, player: playerName , clicked: prevClickCount + 1 }
        }));
        // console.log("after the sending to server")
      }
    };

    const createSquare = (id, class_name ,clickHandler) => {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.classList.add(class_name);
      squareDiv.id = id;
      squareDiv.setAttribute("value", "");
      squareDiv.addEventListener("click", () => clickHandler(squareDiv));
      return squareDiv;
    };

    const createRow = (cols, rowIndex, class_name, clickHandler) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        rowDiv.appendChild(createSquare(rowIndex * cols + colIndex + 1, class_name, clickHandler));
      }
      return rowDiv;
    };

    const createGameBoard = (rows, cols, class_name, clickHandler) => {
      console.log("createGameBoard Get called")
      deleteBoard();
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        gameBoard.appendChild(createRow(cols, rowIndex, class_name, clickHandler));
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

    const updateSquare = ({ squareId, color, player, clicked }) => {
      const square = document.getElementById(squareId);
      square.style.backgroundColor = color;
      square.setAttribute("value", player);
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

    const startGame = ({ map_size_data, game_mod }) => {
      // TODO: here instead of creating the gameboard again, i can only clean the board instead,since it get created on when player joined
      // TODO: it might be more efficient
      createGameBoard(map_size_data.rows_count, map_size_data.cols_count, map_size_data.class_name ,game_mod === "complete_mod" ? handleCompleteModClick : handleNormalModClick);
      gameBoard.classList.remove("done");
      startCountdown(map_size_data.play_time, "game_timer", {}, map_size_data, endGame);
    };

    const handleCompleteModClick = (squareDiv) => {
      if (!squareDiv.style.backgroundColor) {
        occupySound.play();
        squareDiv.style.backgroundColor = playerColor;
        squareDiv.setAttribute("value", playerName);
        wsGame.send(JSON.stringify({
          method: "update_square",
          data: { squareId: squareDiv.id, color: playerColor, player: playerName ,clicked: null }
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
        data: { game_id: gameId, player_name: playerName ,player_results: countResults() }
      }));
    };

    const handleGetReady = ({ start_get_ready, players, squares, map_size_data, game_mod}) => {
      if (start_get_ready) {
        // const totalSquares = Object.keys(squares).length;
        // createGameBoard(map_size_data.rows_count, map_size_data.cols_count, map_size_data.class_name, game_mod === "complete_mod" ? handleCompleteModClick : handleNormalModClick);
        gameBoard.classList.add("done");
        displayMessage("Game Will start in 10 seconds", "NTF");
        startCountdown(map_size_data.ready_time, "ready_timer", squares, map_size_data,() => wsGame.send(JSON.stringify({ method: "start_game", data: { go_start_game: true } })));
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
        messageDiv.classList.add("notification-message")
        messageDiv.innerHTML = `<span style="color: red;">[SERVER]</span>: ${message}`;
        systemNotification.play()
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
