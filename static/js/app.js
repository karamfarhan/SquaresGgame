let playerName = JSON.parse(document.getElementById("name").textContent);
let gameId = JSON.parse(document.getElementById("game_id").textContent);
let color = JSON.parse(document.getElementById("color").textContent);
let container = document.querySelector(".board-border");
let playerInform = document.querySelector(".information");
let timer = document.getElementById("timer");

function checkEvt() {
  let evTypep = window.performance.getEntriesByType("navigation")[0].type;
  if (evTypep == "reload") {
    window.location.replace(`http://${window.location.host}`);
  }
}
checkEvt();

const ws = new WebSocket(
  `ws://${window.location.host}/ws/game/${gameId}/${playerName}/`
);
while (container.firstChild) container.removeChild(container.firstChild);

function displayPlayers(players) {
  playerInform.innerHTML = "";
  let ul = document.createElement("ul");

  for (const key in players) {
    let li = document.createElement("li"),
      spanName = document.createElement("span"),
      spanColor = document.createElement("span");

    li.classList.add("menu-btn");
    li.classList.add("mt-2");

    spanName.className = players[key].name;
    spanColor.className = players[key].color;
    spanColor.setAttribute("id", players[key].color);

    spanName.innerHTML = players[key].name;
    spanName.style.color = "white";
    spanName.classList.add("player-name");
    spanColor.classList.add("player-circle-color");
    spanColor.style.backgroundColor = players[key].color;
    li.appendChild(spanName);
    li.appendChild(spanColor);
    ul.appendChild(li);
  }
  playerInform.appendChild(ul);
}

function getvals() {
  return fetch(`http://localhost:8000/result/?game_id=${gameId}`)
    .then((response) => {})
    .then((responseData) => {})
    .catch((error) => console.warn(error));
}

function countResluts() {
  const allSquares = document.querySelectorAll(".cell");

  let LastResult = {};

  for (square of allSquares) {
    let sqcolor = square.style.backgroundColor;
    if (sqcolor != "") {
      LastResult[String(sqcolor)] = LastResult[String(sqcolor)] + 1 || 1;
    }
  }
  return LastResult;
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
      color: color,
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
      getvals();
      let data = countResluts();
      nat = ``;
      for (result in data) {
        nat += `<span class="player-circle-color" style="background-color: ${result};"></span> --> ${data[result]} <hr>`;
      }
      document.getElementById("dialog-body").innerHTML = nat;
      document.querySelector(".dialog-container").classList.add("active");
    }
  }
  tick();
}

function ready_countdown(seconds) {
  console.log("we launched the ready countdown")
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
      console.log("we send the start game method to backend")
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
        document.getElementById(color).style.backgroundColor;

      if (div.style.backgroundColor !== user_color_rgb) {
        div.style.backgroundColor = color;
        let prev_click = clickHandle(p);
        p.innerHTML = prev_click + 1;

        const PayLoad = {
          method: "update_ball",
          data: {
            squareId: div.tag,
            color: color,
            clicked: prev_click + 1,
          },
        };
        ws.send(JSON.stringify(PayLoad));
      }
    });
    container.appendChild(div);
  }
}

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.method === "update_square") {
    update_square(data.data);
  }
  if (data.method === "send_game") {
    squares = data.data.squares;
    players = data.data.players;
    displayPlayers(players);
    if (data.data.is_started === true) {
      document.getElementById("wait").innerHTML = "";
      container.classList.add("border-shadow");
      makesqu(squares);
    }
  }
  if (data.method === "start_timer") {
    game_countdown(60);
  }
  if (data.method === "update_players") {
    let WaitMesage = document.createElement("h2");
    let WaitDiv = document.getElementById("wait");
    WaitDiv.innerHTML = "";
    players = data.data.players;
    displayPlayers(players);
    if (data.data.waiting === true && playerName in players) {
      container.classList.remove("border-shadow");
      WaitDiv.innerHTML = "";
      WaitMesage.innerHTML = `
        <p>Wait the players to join, share the game code with them</p>
        <span style="color: green;">${gameId}</span>`;
      WaitDiv.appendChild(WaitMesage);
    }
  }
  if (data.method === "get_ready"){
    console.log("we recieve get ready")
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
    ready_countdown(10)
  }
};
