var username = JSON.parse(document.getElementById("user_name").textContent);
var gameId = JSON.parse(document.getElementById("game_id").textContent);
var color = JSON.parse(document.getElementById("color").textContent);
console.log("work");
const ws = new WebSocket(`ws://${window.location.host}/ws/game/${gameId}/`);
while (divBoard.firstChild) divBoard.removeChild(divBoard.firstChild);

for (let i = 0; i < 98; i++) {
  const b = document.createElement("button");
  b.id = "ball" + (i + 1);
  b.tag = i + 1;
  // b.textContent = i+1
  b.style.width = "100px";
  b.style.height = "100px";
  b.addEventListener("click", (e) => {
    b.style.background = color;
    const payLoad = {
      method: "play",
      data: {
        clientId: username,
        gameId: gameId,
        ballId: b.tag,
        color: color,
      },
    };
    ws.send(JSON.stringify(payLoad));
  });
  divBoard.appendChild(b);
}

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.method === "update") {
    const color = data.data.color;
    const b = data.data.ballId;
    const ballObject = document.getElementById("ball" + b);
    ballObject.style.backgroundColor = color;
  }
};
