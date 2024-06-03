from typing import Dict
from uuid import uuid4

from .exceptions import ColorTaken, GameIsFull, GameStarted, NameLong, NameTaken

# to get the middle_position_to_display_char.row = (rows_count - 5 "5 = num of rows a letter would take") // 2
# same goes for middle_position_to_display_char.col

MAX_NAME_LENGTH = 8
MAP_SIZE_OPTIONS = {
    "medium_size": {
        "rows_count": 13,  # number of rows in the board
        "cols_count": 29,  # number of columns in the board
        "class_name": "medium-size",  # css class name for 312 size (change name if changed in css)
        "num_of_squares": 376,  # number of squares in the board
        "middle_position_to_display_char": {"row": 4, "col": 13},  # middle position of the board
        "play_time": 60,  # play time in seconds for this size
        "ready_time": 9,  # ready time in seconds for this size
    },
    "large_size": {
        "rows_count": 17,
        "cols_count": 38,
        "class_name": "large-size",
        "num_of_squares": 646,
        "middle_position_to_display_char": {"row": 6, "col": 17},
        "play_time": 60,
        "ready_time": 9,
    },
}


def _create_squares(squares_num: str) -> Dict:
    return {str(i + 1): {"color": "", "clicked": 0} for i in range(squares_num)}


def _create_player(name: str, color: str) -> Dict:
    return {
        "name": name,
        "color": color,
        "occupied_last_round": 0,
        "all_time_occupied": 0,
        "last_round_result_collected": False,
        "is_ready": True,
    }


def _is_color_taken(game: Dict, color: str) -> bool:
    for player in game["players"].values():
        if player["color"] == color:
            return True
    return False


def creat_game(game_id: str, player_num: int, map_size: str, game_mod: str = "normal_mod") -> Dict:
    squares = _create_squares(MAP_SIZE_OPTIONS[map_size]["num_of_squares"])
    game = {
        "game_id": game_id,
        "game_mod": game_mod,
        "map_size": map_size,
        "map_size_data": MAP_SIZE_OPTIONS[map_size],
        "is_started": False,
        "is_finished": False,
        "is_resulted": False,
        "current_round": 0,
        "map_players_size": player_num,
        "squares": squares,
        "players": {},
    }
    return game


def restart_game(game: Dict) -> Dict:
    game["is_started"] = False
    game["is_resulted"] = True
    game["current_round"] += 1

    for player in game["players"].values():
        player["is_ready"] = False
    for square in game["squares"].values():
        square["color"] = ""
        square["clicked"] = 0

    return game


def add_player_to_game(game: Dict, player_name: str, player_color: str) -> Dict:
    # TODO: you might don't need to raise the errors here but in view func,only break the function,
    if game["is_started"]:
        raise GameStarted()
    if len(game["players"].keys()) == game["map_players_size"]:
        raise GameIsFull()
    if player_name in game["players"]:
        raise NameTaken()
    if len(player_name) > MAX_NAME_LENGTH:
        raise NameLong()
    if _is_color_taken(game, player_color):
        raise ColorTaken()
    created_player = _create_player(player_name, player_color)
    game["players"][player_name] = created_player
    return game


def reset_player_in_game(game: Dict, player_name: str) -> Dict:
    player = game["players"].get(player_name)
    if player:
        player["is_ready"] = True
        player["last_round_result_collected"] = False
    return game


def _sort_players_by_results(game: Dict) -> Dict:
    game["players"] = dict(
        sorted(game["players"].items(), key=lambda item: item[1]["all_time_occupied"], reverse=True)
    )
    return game


def _check_if_all_results_collected(game: Dict) -> bool:
    return all(player["last_round_result_collected"] for player in game["players"].values())


def get_add_results_for_player(game: Dict, data: Dict) -> Dict:
    send_results = False
    player = game["players"].get(data["player_name"])

    if player and not player["last_round_result_collected"]:
        player["occupied_last_round"] = data["player_results"]
        player["all_time_occupied"] += data["player_results"]
        player["last_round_result_collected"] = True

    if _check_if_all_results_collected(game):
        game = _sort_players_by_results(game)
        send_results = True

    return game, send_results


def generate_game_id():
    game_id = uuid4()
    return str(game_id)[:5].upper()


"""
Game Logic Implementation Approaches

1. OOP Approach (using `dataclasses`):
   Pros:
   - Clear and structured representation of game data using classes.
   - Encapsulates game logic and operations within the `Game` class.
   - Easy serialization and deserialization using `to_json` and `from_json` methods.
   - Provides type hints and validation through `dataclasses`.

   Cons:
   - Requires additional steps of converting game data between JSON and `Game` object.
   - May introduce some performance and memory overhead.

2. Functional Approach (using separate functions) CURRENT:
   Pros:
   - Avoids overhead of creating `Game` objects and serialization/deserialization.
   - Allows direct manipulation of game data stored as JSON.
   - More efficient in terms of performance and memory usage.
   - Simplifies the process of updating game state and storing it back in Redis.

   Cons:
   - Lacks the structure and organization provided by the OOP approach.
   - Requires passing game data as a parameter to each function.
   - Lacks type hints and validation provided by `dataclasses`.

Choose the approach based on your project's specific needs and priorities:
- If efficiency and simplicity are the main concerns, use the functional approach.
- If structure, maintainability, and code clarity are more important, and the performance impact is acceptable
  use the OOP approach with `dataclasses`.
"""


"""
 OOP Approach Implementation:

from dataclasses import dataclass, field
from typing import Dict, List, Optional
from uuid import uuid4
import json

@dataclass
class Player:
    name: str
    color: str
    occupied_last_round: int = 0
    all_time_occupied: int = 0
    last_round_result_collected: bool = False
    is_ready: bool = True

@dataclass
class Square:
    color: str = ""
    clicked: int = 0

@dataclass
class Game:
    game_id: str
    game_mod: str
    map_size: str
    map_size_data: Dict
    is_started: bool = False
    is_finished: bool = False
    is_resulted: bool = False
    current_round: int = 0
    map_players_size: int = 0
    squares: Dict[str, Square] = field(default_factory=dict)
    players: Dict[str, Player] = field(default_factory=dict)

    def restart_game(self):
        self.is_started = False
        self.is_resulted = True
        self.current_round += 1

        for player in self.players.values():
            player.is_ready = False
        for square in self.squares.values():
            square.color = ""
            square.clicked = 0

    def add_player(self, player_name: str, player_color: str):
        taken_colors = {player.color for player in self.players.values()}
        if self.is_started:
            raise GameStarted("Game has already started.")
        if len(self.players) >= self.map_players_size:
            raise GameIsFull("Game is full.")
        if player_name in self.players:
            raise NameTaken("Player name is already taken.")
        if len(player_name) > MAX_NAME_LENGTH:
            raise NameLong(f"Player name must be under {MAX_NAME_LENGTH} characters.")
        if player_color in taken_colors:
            raise ColorTaken("Player color is already taken.")

        self.players[player_name] = Player(player_name, player_color)

    def reset_player(self, player_name: str):
        player = self.players.get(player_name)
        if player:
            player.is_ready = True
            player.last_round_result_collected = False

    def get_add_results_for_player(self, data: Dict) -> bool:
        send_results = False
        prn = data["player_name"]
        player = self.players.get(prn)
        if player and not player.last_round_result_collected:
            player.occupied_last_round = data["player_results"]
            player.all_time_occupied += data["player_results"]
            player.last_round_result_collected = True

        results_received = sum(player.last_round_result_collected for player in self.players.values())
        if results_received == len(self.players):
            self.players = {
                k: v for k, v in sorted(self.players.items(), key=lambda item: item[1].all_time_occupied, reverse=True)
            }
            send_results = True
        return send_results

    @staticmethod
    def generate_game_id():
        return str(uuid4())[:5].upper()

    def to_json(self) -> str:
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

    @classmethod
    def from_json(cls, json_data: str) -> 'Game':
        data = json.loads(json_data)
        game = cls(**data)
        game.squares = {key: Square(**value) for key, value in data["squares"].items()}
        game.players = {key: Player(**value) for key, value in data["players"].items()}
        return game


"""
