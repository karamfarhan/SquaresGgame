let playerName = JSON.parse(document.getElementById("name").textContent);
let gameId = JSON.parse(document.getElementById("game_id").textContent);
let gameMod = JSON.parse(document.getElementById("game_mod").textContent);
let playerColor = JSON.parse(document.getElementById("color").textContent);
let container = document.querySelector(".container");
let gameBoard = document.querySelector(".game-board");
let playerInform = document.querySelector(".scoreboard");
let timer = document.getElementById("timer");
let replaybtn = document.getElementById("again-btn")
var http_scheme = window.location.protocol
function checkEvt() {
  let evTypep = window.performance.getEntriesByType("navigation")[0].type;
  if (evTypep == "reload") {
    window.location.replace(`${http_scheme}//${window.location.host}`);
  }
}
checkEvt();

var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
const ws_chat = new WebSocket(`${ws_scheme}://${window.location.host}/ws/chat/${gameId}/${playerName}/`);
const ws = new WebSocket(`${ws_scheme}://${window.location.host}/ws/game/${gameId}/${playerName}/`);
while (gameBoard.firstChild) gameBoard.removeChild(gameBoard.firstChild);

function displayPlayers(players) {
  // console.log("start display players function")
  playerInform.innerHTML = "";
  // let ul = document.createElement("ul");

  for (const player in players) {
    let player_div = document.createElement("div")
    player_div.classList.add("player")
    player_div.setAttribute("id", players[player].name);
    player_div.style.color = players[player].color
    player_div.innerHTML = `${players[player].name} <span class="score" id="${players[player].name}-score">${players[player].all_time_occupied}</span>`
    // spanColor = document.createElement("span");
    // spanSquares = document.createElement("span");
    // li.classList.add("menu-btn")
    // li.classList.add("mt-2");

    // spanName.className = players[player].name;
    // spanColor.className = players[player].color;
    // spanSquares.className = players[player].name;
    // spanColor.setAttribute("id", players[player].color);

    // spanName.innerHTML = players[player].name;
    // spanSquares.innerHTML = players[player].all_time_occupied
    if (players[player].is_ready === true){
      player_div.classList.add("player-ready");
    }else{
      player_div.classList.add("player-unready");
    }
    // spanName.classList.add("player-name");
    // spanColor.classList.add("player-circle-color");
    // spanColor.style.backgroundColor = players[player].color;
    // li.appendChild(spanName);
    // li.appendChild(spanSquares)
    // li.appendChild(spanColor);
    // ul.appendChild(li);
    playerInform.appendChild(player_div)
  }
  // console.log(playerInform)
  // playerInform.appendChild(ul);
}



function rgbToHex(rgb) {
  // Remove "rgb(" and ")" from the string
  const rgbValues = rgb.substring(4, rgb.length - 1).split(",").map(value => parseInt(value.trim(), 10));

  // Convert each RGB value to hexadecimal and pad with zeros if necessary
  const hexValues = rgbValues.map(value => {
    const hex = value.toString(16).toLowerCase();
    return hex.length === 1 ? `0${hex}` : hex;
  });

  // Combine the hex values and prepend "#" symbol
  return `#${hexValues.join("")}`;
}

function countResluts() {
  const allSquares = document.querySelectorAll(".square");

  let results = {};

  for (square of allSquares) {
    let sqcolor = square.style.backgroundColor;
    let sqcolor_inhex = rgbToHex(String(sqcolor))
    // const user_color_rgb = document.getElementById(playerColor).style.backgroundColor;
    // console.log(`${sqcolor} == ${user_color_rgb}`)
    if (sqcolor != "") {
      results[sqcolor_inhex] = results[sqcolor_inhex] + 1 || 1;
    }
  }
  // if the player did not occupy any square, add his color to results with value 0
  // if ( !(playerColor in results) ){
  //   results[playerColor] = 0
  // }
  return results;
}

// //pop up
// let reloadBtn = document.querySelector(".refresh");
// let exitBtn = document.querySelector(".exit");
// exitBtn.addEventListener("click", () => {
//   window.href;
// });

// reloadBtn.addEventListener("click", () => {
//   const PayLoad = {
//     method: "restart_game",
//     data: {
//       game_id: gameId,
//       name: playerName,
//       color: playerColor,
//     },
//   };
//   var alert = document.querySelector(".dialog-container");
//   ws.send(JSON.stringify(PayLoad));
//   container.classList.remove("done");
//   alert.classList.remove("active");
//   container.innerHTML = "";
//   playerInform.innerHTML = "";
// });

replaybtn.addEventListener("click", () => {
  const PayLoad = {
    method: "restart_game",
    data: {
      game_id: gameId,
      name: playerName,
      color: playerColor,
    },
  };
  // var alert = document.querySelector(".dialog-container");
  ws.send(JSON.stringify(PayLoad));
  replaybtn.classList.add("hide")
  // container.classList.remove("done");
  // alert.classList.remove("active");
  // container.innerHTML = "";
  // playerInform.innerHTML = "";
});
function game_countdown(seconds) {
  // console.log("start game countdown function")
  function tick() {
    seconds--;
    timer.innerText = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
    if (seconds > 0) {
      setTimeout(tick, 1000);
    }
    else {
      gameBoard.classList.add("done");
      timer.innerText = "0:00";
      // RestGame();
      let player_results_data = countResluts();
      const PayLoad = {
        method: "player_results",
        data: {
          game_id: gameId,
          player_results: player_results_data
        },
      };
      ws.send(JSON.stringify(PayLoad));
    }
  }
  tick();
}

function ready_countdown(seconds) {
  // console.log("start ready countdown function")
  // console.log("we launched the ready countdown")
  function tick() {
    seconds--;
    timer.innerText = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
    if (seconds > 0) {
      setTimeout(tick, 1000);
    }
    else {
      const PayLoad = {
        method: "start_game",
        data: {
          "go_start_game": true,
        },
      };
      ws.send(JSON.stringify(PayLoad));
      // console.log("we send the start game method to backend")
    }
  }
  tick();
}

function clickHandle(squareDiv) {
  if (squareDiv.innerText == "") {
    return 0;
  } else {
    return parseInt(squareDiv.innerText);
  }
}

function update_square(squareData) {
  let squareId = squareData.squareId;
  let squareObject = document.getElementById(squareId);
  squareObject.style.backgroundColor = squareData.color;
  if (gameMod === "normal_mod"){
    // let squareP = document.getElementById(squareId).getElementsByTagName("p")[0];
    squareObject.innerText = squareData.clicked;
  }

}


function makesqu(squares, totalSquares) {
  // console.log("start makesqu function")
  gameBoard.innerHTML = "";
  let squaresCounter = 1
  // container.classList.add("border-shadow");

  // Calculate the dimensions of the squares
  // const rows = Math.ceil(Math.sqrt(totalSquares * (boardHeight / boardWidth)));
  // const cols = Math.ceil(totalSquares / rows);
  // const squareWidth = Math.floor(boardWidth / cols); // subtract here for the width gap
  // const squareHeight = Math.floor(boardHeight / rows);

  // container.style.gridTemplateColumns = `repeat(${cols}, ${squareWidth}px)`;
  // container.style.gridTemplateRows = `repeat(${rows}, ${squareHeight}px)`;
  for (let colc = 1; colc <= totalSquares/26; colc++){
    let rowDiv = document.createElement("div")
    rowDiv.classList.add("row")
    for (let rowc = 1; rowc <= 26; rowc++) {
      let squareDiv = document.createElement("div");
      squareDiv.classList.add("square")
      squareDiv.setAttribute("id",squaresCounter)
      let click_number = squares[squaresCounter]["clicked"];

      // let p = document.createElement("p");
      // div.appendChild(p);
      // div.className = "cell";
      // div.id = i;
      if (click_number != 0) {
        squareDiv.innerText = click_number;
      }

      // div.tag = i;
      // div.style.backgroundColor = squares[i]["color"];
      // div.style.width = `${squareWidth}px`;
      // div.style.height = `${squareHeight}px`;

      squaresCounter++
      squareDiv.addEventListener("click", (e) => {
        // const user_color_rgb =
        //   document.getElementById(playerColor).style.backgroundColor;

        if (rgbToHex(String(squareDiv.style.backgroundColor)) !== playerColor) {
          squareDiv.style.backgroundColor = playerColor;
          let prev_click = clickHandle(squareDiv);
          squareDiv.innerText = prev_click + 1;

          const PayLoad = {
            method: "update_ball",
            data: {
              squareId: squareDiv.id,
              color: playerColor,
              clicked: prev_click + 1,
            },
          };
          ws.send(JSON.stringify(PayLoad));
        }
      });
      rowDiv.appendChild(squareDiv);
    }
    gameBoard.appendChild(rowDiv)
  }
}
// TODO: in compelete mode i should end the game if all squares are occupied

function makesqu_compelete(squares, totalSquares) {
  // console.log("start makesqu compelete mod function")
  gameBoard.innerHTML = "";
  let squaresCounter = 1
  for (let colc = 1; colc <= totalSquares/26; colc++){
    let rowDiv = document.createElement("div")
    rowDiv.classList.add("row")
    for (let rowc = 1; rowc <= 26; rowc++) {
      let squareDiv = document.createElement("div");
      squareDiv.classList.add("square")
      squareDiv.setAttribute("id",squaresCounter)

      squaresCounter++
      squareDiv.addEventListener("click", (e) => {
        // const user_color_rgb =
        //   document.getElementById(playerColor).style.backgroundColor;

        if (squareDiv.style.backgroundColor === "") {
          // console.log("clicked and send data")
          squareDiv.style.backgroundColor = playerColor;


          const PayLoad = {
            method: "update_ball",
            data: {
              squareId: squareDiv.id,
              color: playerColor,
              // clicked has no value in compelete mod, but still sending it bc of consumer
              clicked: null,
            },
          };
          ws.send(JSON.stringify(PayLoad));
        }
      });
      rowDiv.appendChild(squareDiv);
    }
    gameBoard.appendChild(rowDiv)
  }
}

function displayMessage(message_text, message_type, player = null, player_color = null) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  if (message_type === "NTF"){
    messageDiv.innerHTML = `<span style="color: red;">[SERVER]</span>: ${message_text}`;
  }
  if (message_type === "MSG"){
    messageDiv.innerHTML = `<span style="color: ${player_color};" >${player}</span>: ${message_text}`;
  }

  messageDiv.classList.add('chat-message');
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput.value.trim() !== '') {
      // displayMessage(chatInput.value,playerName)
      const PayLoad = {
        method: "send_message",
        data: {
          message: chatInput.value,
          player: playerName,
          player_color: playerColor,
          game_id: gameId,
        },
      };
      ws_chat.send(JSON.stringify(PayLoad));
      chatInput.value = '';
  }
}

ws_chat.onmessage = (message) => {
  const message_data = JSON.parse(message.data)
  // console.log(message_data)

  if (message_data.method === "MSG"){
    // console.log(message_data.data.message)
    displayMessage(message_data.data.message, "MSG", message_data.data.player, message_data.data.player_color)
  }
  if (message_data.method === "NTF"){
    // console.log(message_data.data.message)
    displayMessage(message_data.data.message, "NTF")
  }
}
ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.method === "update_square") {
    update_square(data.data);
  }
  if (data.method === "send_results") {
    players_data = data.data.players;
    // console.log(players_data)
    // displayPlayers(players);
    round_results_formatted = `Round ${data.data.current_round} Results<hr>`;
    for (player in players_data) {
      // console.log(players_data[player])
      round_results_formatted += `<span style="color: ${players_data[player]["color"]};">${players_data[player]["name"]}</span> --> ${players_data[player]["occupied_last_round"]}<br>`;
    }
    round_results_formatted += "<hr>"
    displayMessage(round_results_formatted, "NTF")
    replaybtn.classList.remove("hide")
    // document.getElementById("dialog-body").innerHTML = nat; new
    // document.querySelector(".dialog-container").classList.add("active"); new
  }
  if (data.method === "start_game") {
    squares = data.data.squares;
    // document.getElementById("wait").innerHTML = ""; new
    // container.classList.add("border-shadow");
    squares_number = Object.keys(squares).length
    if(data.data.game_mod === "compelete_mod"){
      makesqu_compelete(squares,squares_number)
    }
    if(data.data.game_mod === "normal_mod"){
      makesqu(squares,squares_number)
    }
    gameBoard.classList.remove("done");
    game_countdown(60);
  }
  if (data.method === "update_players") {
    players = data.data.players;
    displayPlayers(players);
    // if (playerName in players && players[playerName].is_ready  === true && data.data.game_running === false) {
    //   const readyJoinedPlayersCount = Object.values(players).filter(player => player.hasOwnProperty('is_ready') && player.is_ready).length;
    //   server_wait_msg = `New Player Joined. `;
    //   if(data.data.map_players_size - readyJoinedPlayersCount != 0){
    //     server_wait_msg += `<span style="color: green;">${data.data.map_players_size - readyJoinedPlayersCount}</span> Left to Join`
    //   }
    //   displayMessage(server_wait_msg,"[SERVER]","#FF0000")
    // }
  }
  if (data.method === "get_ready"){
    // console.log("we recieve get ready")
    // let WaitMesage = document.createElement("h2"); new
    // let WaitDiv = document.getElementById("wait");  new
    // WaitDiv.innerHTML = ""; new
    if (data.data.start_get_ready === true) {
      displayMessage("Players Count Completed, Game will Start in 10 seconds", "NTF")
      // container.classList.remove("border-shadow");
      // container.style.gridTemplateColumns = null; new
      // container.style.gridTemplateRows = null; new
      // WaitDiv.innerHTML = ""; new
      // WaitMesage.innerHTML = `
      //   <p>Players Count Completed, Game will Start in</p>
      //   <span style="color: green;">10 Seconds</span>`; new
      // WaitDiv.appendChild(WaitMesage); new
      ready_countdown(10)
    }
    if ( !(playerName in data.data.players) ){
      window.location.replace(`${http_scheme}//${window.location.host}`)
    }
  }
};
