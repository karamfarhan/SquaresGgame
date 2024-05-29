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


def creat_game(game_id: str, player_num: int, map_size: int, game_mod: str = "normal") -> dict:
    squares = {f"{i+1}": {"color": "", "clicked": 0} for i in range(map_size)}
    game = {
        "game_id": game_id,
        "game_mod": game_mod,
        "is_started": False,
        "is_finished": False,
        "is_resulted": False,
        "current_round": 1,
        "map_players_size": player_num,
        "squares": squares,
        "players": {},
    }
    return game


def restart_game(game: dict) -> dict:
    # if game["is_resulted"]:
    #     return None
    game["is_started"] = False
    game["is_resulted"] = True
    # game["current_round"] += 1

    # game["players"] = {}
    for player in game["players"]:
        game["players"][player]["is_ready"] = False
    for square in game["squares"].values():
        square["color"] = ""
        square["clicked"] = 0
        # square["occupied"] = 0
        # square["is_ready"] = False
    return game


def add_player_to_game(game: dict, player_name: str, player_color: str) -> dict:
    taken_colors = [player["color"] for player in game["players"].values()]
    # TODO: you might don't need to raise the errors here but in view func,only break the function,
    if game["is_started"]:
        raise GameStarted()
    if len(game["players"].keys()) == game["map_players_size"]:
        raise GameIsFulled()
    if player_name in game["players"]:
        raise NameTaken()
    if len(player_name) > 7:
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


def reset_player_in_game(game: dict, player_name: str) -> dict:
    game["players"][player_name]["is_ready"] = True
    game["players"][player_name]["last_round_result_collected"] = False
    return game


def get_add_results_for_player(game: dict, data: dict) -> tuple:
    for player in game["players"].values():
        for result_color, result_num in data["player_results"].items():
            if player["color"] == result_color and player["last_round_result_collected"] is False:
                player["occupied_last_round"] = result_num
                player["all_time_occupied"] += result_num
                player["last_round_result_collected"] = True
        # if last_...collected is still False, that means player has no results(didn't click on any square)
        # so we set his last round to 0
        if player["last_round_result_collected"] is False:
            player["occupied_last_round"] = 0
            player["last_round_result_collected"] = True
    return game


def generate_game_id():
    game_id = uuid4()
    return str(game_id)[:5].upper()


async def input_handler(data: dict) -> list[bool]:
    """
    Main chat handler

    If the function is a command, run it
    If it isn't, pass the message to the message handler
    """
    data["message"]
    is_command = False

    # for i in message.lower().split():
    #     if i in commands:
    #         validator_response = command_validator(message)  # Validates if the message is a command

    #         if not validator_response[0]:
    #             return [True]

    #         data["cmd"] = validator_response[1]
    #         command_result = await command_handler(data)
    #         if command_result:
    #             return [False, validator_response[1]]
    #         else:
    #             return [True]

    if not is_command:
        return [True]
