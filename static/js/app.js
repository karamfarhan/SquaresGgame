let playerName = JSON.parse(document.getElementById("name").textContent);
let gameId = JSON.parse(document.getElementById("game_id").textContent);
let playerColor = JSON.parse(document.getElementById("color").textContent);
let container = document.querySelector(".board-border");
let playerInform = document.querySelector(".information");
let timer = document.getElementById("timer");
var http_scheme = window.location.protocol
function checkEvt() {
  let evTypep = window.performance.getEntriesByType("navigation")[0].type;
  if (evTypep == "reload") {
    window.location.replace(`${http_scheme}//${window.location.host}`);
  }
}
checkEvt();

var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
const ws = new WebSocket(`${ws_scheme}://${window.location.host}/ws/game/${gameId}/${playerName}/`);
while (container.firstChild) container.removeChild(container.firstChild);

function displayPlayers(players) {
  playerInform.innerHTML = "";
  let ul = document.createElement("ul");

  for (const player in players) {
    let li = document.createElement("li"),
    spanName = document.createElement("span"),
    spanColor = document.createElement("span");
    spanSquares = document.createElement("span");
    li.classList.add("menu-btn")
    li.classList.add("mt-2");

    spanName.className = players[player].name;
    spanColor.className = players[player].color;
    // spanSquares.className = players[player].name;
    spanColor.setAttribute("id", players[player].color);

    spanName.innerHTML = players[player].name;
    spanSquares.innerHTML = players[player].all_time_occupied
    if (players[player].is_ready === true){
      spanName.style.color = "green";
    }else{
      spanName.style.color = "red";
    }
    spanName.classList.add("player-name");
    spanColor.classList.add("player-circle-color");
    spanColor.style.backgroundColor = players[player].color;
    li.appendChild(spanName);
    li.appendChild(spanSquares)
    li.appendChild(spanColor);
    ul.appendChild(li);
  }
  playerInform.appendChild(ul);
}

// function RestGame() {
//   return fetch(`${http_scheme}//${window.location.host}/result/?game_id=${gameId}`)
//     .then((response) => {})
//     .then((responseData) => {})
//     .catch((error) => console.warn(error));
// }

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
  const allSquares = document.querySelectorAll(".cell");

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

//pop up
let reloadBtn = document.querySelector(".refresh");
let exitBtn = document.querySelector(".exit");
exitBtn.addEventListener("click", () => {
  window.href;
});

reloadBtn.addEventListener("click", () => {
  const PayLoad = {
    method: "restart_game",
    data: {
      game_id: gameId,
      name: playerName,
      color: playerColor,
    },
  };
  var alert = document.querySelector(".dialog-container");
  ws.send(JSON.stringify(PayLoad));
  container.classList.remove("done");
  alert.classList.remove("active");
  container.innerHTML = "";
  playerInform.innerHTML = "";
});

function game_countdown(seconds) {

  function tick() {
    seconds--;
    timer.innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
    if (seconds > 0) {
      setTimeout(tick, 1000);
    }
    else {
      container.classList.add("done");
      timer.innerHTML = "";
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
      // nat = ``;
      // for (result in results_data) {
      //   nat += `<span class="player-circle-color" style="background-color: ${result};"></span> --> ${data[result]} <hr>`;
      // }
      // document.getElementById("dialog-body").innerHTML = nat;
      // document.querySelector(".dialog-container").classList.add("active");
    }
  }
  tick();
}

function ready_countdown(seconds) {
  // console.log("we launched the ready countdown")
  function tick() {
    seconds--;
    timer.innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
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

function clickHandle(p) {
  if (p.innerHTML == "") {
    return 0;
  } else {
    return parseInt(p.innerHTML);
  }
}

function update_square(squareData) {
  let squareId = squareData.squareId;
  let squareObject = document.getElementById(squareId);
  let squareP = document.getElementById(squareId).getElementsByTagName("p")[0];

  squareObject.style.backgroundColor = squareData.color;
  squareP.innerHTML = squareData.clicked;
}

function makesqu(squares) {
  container.innerHTML = "";
  for (let i = 1; i < Object.keys(squares).length + 1; i++) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    let click_number = squares[i]["clicked"];
    div.appendChild(p);
    div.className = "cell";
    div.id = i;
    if (click_number != 0) {
      p.innerHTML = click_number;
    }

    div.tag = i;
    div.style.backgroundColor = squares[i]["color"];
    div.addEventListener("click", (e) => {
      const user_color_rgb =
        document.getElementById(playerColor).style.backgroundColor;

      if (div.style.backgroundColor !== user_color_rgb) {
        div.style.backgroundColor = playerColor;
        let prev_click = clickHandle(p);
        p.innerHTML = prev_click + 1;

        const PayLoad = {
          method: "update_ball",
          data: {
            squareId: div.tag,
            color: playerColor,
            clicked: prev_click + 1,
          },
        };
        ws.send(JSON.stringify(PayLoad));
      }
    });
    container.appendChild(div);
  }
}

// version 2 of makesqu function

// function makesqu(squares) {
//   container.innerHTML = "";
//   let totalSquares = Object.keys(squares).length;
//   let columns = Math.floor(Math.sqrt(totalSquares));
//   let rows = Math.ceil(totalSquares / columns);
//   let cellSize = Math.min(container.clientWidth / columns, container.clientHeight / rows) - 2; // Adjust for gap

//   container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
//   container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

//   for (let i = 1; i <= totalSquares; i++) {
//     let div = document.createElement("div");
//     let p = document.createElement("p");
//     let click_number = squares[i]["clicked"];
//     div.appendChild(p);
//     div.className = "cell";
//     div.id = i;
//     if (click_number != 0) {
//       p.innerHTML = click_number;
//     }

//     div.tag = i;
//     div.style.backgroundColor = squares[i]["color"];
//     div.style.width = `${cellSize}px`;
//     div.style.height = `${cellSize}px`;

//     div.addEventListener("click", (e) => {
//       const user_color_rgb = document.getElementById(playerColor).style.backgroundColor;

//       if (div.style.backgroundColor !== user_color_rgb) {
//         div.style.backgroundColor = playerColor;
//         let prev_click = clickHandle(p);
//         p.innerHTML = prev_click + 1;

//         const PayLoad = {
//           method: "update_ball",
//           data: {
//             squareId: div.tag,
//             color: playerColor,
//             clicked: prev_click + 1,
//           },
//         };
//         ws.send(JSON.stringify(PayLoad));
//       }
//     });
//     container.appendChild(div);
//   }
// }


ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.method === "update_square") {
    update_square(data.data);
  }
  if (data.method === "send_results") {
    players_data = data.data.players;
    // console.log(players_data)
    // displayPlayers(players);
    nat = ``;
    for (player in players_data) {
      // console.log(players_data[player])
      nat += `<span class="text-dark">${players_data[player]["name"]}</span> --> ${players_data[player]["occupied_last_round"]}  <span class="player-circle-color" style="background-color: ${players_data[player]["color"]};"></span> <hr>`;
    }
    document.getElementById("dialog-body").innerHTML = nat;
    document.querySelector(".dialog-container").classList.add("active");
  }
  if (data.method === "start_game") {
    squares = data.data.squares;
    document.getElementById("wait").innerHTML = "";
    container.classList.add("border-shadow");
    makesqu(squares);
    game_countdown(60);
  }
  if (data.method === "update_players") {
    let WaitMesage = document.createElement("h2");
    let WaitDiv = document.getElementById("wait");
    WaitDiv.innerHTML = "";
    players = data.data.players;
    console.log(players)
    displayPlayers(players);
    console.log(players[playerName].is_ready  === true)
    if (playerName in players && players[playerName].is_ready  === true) {
      container.classList.remove("border-shadow");
      WaitDiv.innerHTML = "";
      WaitMesage.innerHTML = `
        <p>Wait the players to join, share the game code with them</p>
        <span style="color: green;">${gameId}</span>`;
      WaitDiv.appendChild(WaitMesage);
    }
  }
  if (data.method === "get_ready"){
    // console.log("we recieve get ready")
    let WaitMesage = document.createElement("h2");
    let WaitDiv = document.getElementById("wait");
    WaitDiv.innerHTML = "";
    if (data.data.start_get_ready === true) {
      container.classList.remove("border-shadow");
      WaitDiv.innerHTML = "";
      WaitMesage.innerHTML = `
        <p>Players Count Completed, Game will Start in</p>
        <span style="color: green;">10 Seconds</span>`;
      WaitDiv.appendChild(WaitMesage);
    }
    if ( !(playerName in data.data.players) ){
      window.location.replace(`${http_scheme}//${window.location.host}`)
    }
    ready_countdown(10)
  }
};
