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


def creat_game(game_id: str, player_num: int, map_size: str, game_mod: str = "normal_mod") -> Dict:
    squares = {str(i + 1): {"color": "", "clicked": 0} for i in range(MAP_SIZE_OPTIONS[map_size]["num_of_squares"])}
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
    # if game["is_resulted"]:
    #     return None
    game["is_started"] = False
    game["is_resulted"] = True
    game["current_round"] += 1

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
    send_results = False
    prn = data["player_name"]  # prn = player results name
    if prn in game["players"] and not game["players"][prn]["last_round_result_collected"]:
        game["players"][prn]["occupied_last_round"] = data["player_results"]
        game["players"][prn]["all_time_occupied"] += data["player_results"]
        game["players"][prn]["last_round_result_collected"] = True

    results_recieved = sum(player["last_round_result_collected"] for player in game["players"].values())
    # print("players recieved results count: ", results_recieved)
    if results_recieved == len(game["players"]):
        # sort players by results
        game["players"] = {
            k: v
            for k, v in sorted(game["players"].items(), key=lambda item: item[1]["all_time_occupied"], reverse=True)
        }
        send_results = True
    return game, send_results


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
