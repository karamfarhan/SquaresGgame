let form = document.getElementById("creat-game-form");
let neonBox = document.querySelector(".neon-box");
var http_scheme = window.location.protocol;
form.addEventListener("submit", (e) => {
  e.preventDefault();
//   console.log(document.querySelector('input[name="players"]:checked'))
  let player_num = document.querySelector('input[name="players"]:checked').value;
  let map_size = document.querySelector('input[name="map-size"]:checked').value;
  let game_mod = document.querySelector('input[name="game-mode"]:checked').value;
  let url = `${http_scheme}//${window.location.host}/create/?player_num=${player_num}&map_size=${map_size}&game_mod=${game_mod}`;

  fetch(url)
    .then(response => response.text())
    .then(result => {
      result_response = JSON.parse(result);
      if (result_response.success === true) {
        form.style.display = "none";
        let responseDiv = document.createElement("div");
        responseDiv.setAttribute("id", "response-text")
        responseDiv.innerHTML = `Room Created! Copy Room ID, And press Join Existing Room. Room ID: <span>${result_response.game_id}</span>`;
        neonBox.appendChild(responseDiv)
      } else{
        location.reload();
      }
    })
    .catch(error => console.warn(error));
});
