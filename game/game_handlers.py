from typing import Dict, List
from uuid import uuid4


class GameNotFound(Exception):
    """Handles what to do if a game not found"""


class NameTaken(ValueError):
    """Handles what to do if a player name  is taken"""


class NameLong(ValueError):
    """Your Name is too long, must be under 8 letters"""


class ColorTaken(ValueError):
    """Handles what to do if a color is taken"""


class GameStarted(Exception):
    """Handles what to do if a player tries to join when the game has started"""


class GameFisnished(Exception):
    """Handles what to do if the game is finished"""


class GameResulted(Exception):
    """Handles what to do if the game is resulted"""


class GameIsFulled(Exception):
    """Handles what to do if the game Full of players"""


MAX_NAME_LENGTH = 8
MAP_SIZE_OPTIONS = {
    "312": {
        "rows_count": 12,  # number of rows in the board
        "cols_count": 26,  # number of columns in the board
        "class_name": "medium-size",  # css class name for 312 size (change name if changed in css)
        "num_of_squares": 312,  # number of squares in the board
        "middle_position_to_display_char": {"row": 4, "col": 11},  # middle position of the board
        "play_time": 60,  # play time in seconds for this size
        "ready_time": 9,  # ready time in seconds for this size
    },
    "1375": {
        "rows_count": 25,
        "cols_count": 55,
        "class_name": "large-size",
        "num_of_squares": 1375,
        "middle_position_to_display_char": {"row": 10, "col": 26},
        "play_time": 60,
        "ready_time": 9,
    },
}


def creat_game(game_id: str, player_num: int, map_size: int, game_mod: str = "normal_mod") -> Dict:
    squares = {str(i + 1): {"color": "", "clicked": 0} for i in range(map_size)}
    game = {
        "game_id": game_id,
        "game_mod": game_mod,
        "map_size": map_size,
        "map_size_data": MAP_SIZE_OPTIONS[str(map_size)],
        # "rows_count": MAP_SIZE_OPTIONS[map_size]["rows_count"],
        # "cols_count": MAP_SIZE_OPTIONS[map_size]["cols_count"],
        "is_started": False,
        "is_finished": False,
        "is_resulted": False,
        "current_round": 1,
        "map_players_size": player_num,
        "squares": squares,
        "players": {},
    }
    return game


def restart_game(game: Dict) -> Dict:
    # if game["is_resulted"]:
    #     return None
    game["is_started"] = False
    game["is_resulted"] = True
    # game["current_round"] += 1

    # game["players"] = {}
    for player in game["players"].values():
        player["is_ready"] = False
    for square in game["squares"].values():
        square["color"] = ""
        square["clicked"] = 0
        # square["occupied"] = 0
        # square["is_ready"] = False
    return game


def add_player_to_game(game: Dict, player_name: str, player_color: str) -> Dict:
    taken_colors = {player["color"] for player in game["players"].values()}
    # TODO: you might don't need to raise the errors here but in view func,only break the function,
    if game["is_started"]:
        raise GameStarted()
    if len(game["players"].keys()) == game["map_players_size"]:
        raise GameIsFulled()
    if player_name in game["players"]:
        raise NameTaken()
    if len(player_name) > MAX_NAME_LENGTH:
        raise NameLong()
    if player_color in taken_colors:
        raise ColorTaken()

    game["players"][player_name] = {
        "name": player_name,
        "color": player_color,
        "occupied_last_round": 0,
        "all_time_occupied": 0,
        "last_round_result_collected": False,
        "is_ready": True,
    }
    return game


def reset_player_in_game(game: Dict, player_name: str) -> Dict:
    player = game["players"].get(player_name)
    if player:
        game["players"][player_name]["is_ready"] = True
        game["players"][player_name]["last_round_result_collected"] = False
    return game


def get_add_results_for_player(game: Dict, data: Dict) -> Dict:
    for player in game["players"].values():
        result_num = data["player_results"].get(player["color"], 0)
        if not player["last_round_result_collected"]:
            player["occupied_last_round"] = result_num
            player["all_time_occupied"] += result_num
            player["last_round_result_collected"] = True
    return game


def generate_game_id():
    game_id = uuid4()
    return str(game_id)[:5].upper()


async def input_handler(data: Dict) -> List[bool]:
    """
    Main chat handler

    If the function is a command, run it
    If it isn't, pass the message to the message handler
    """
    data["message"]
    is_command = False

    if not is_command:
        return [True]
