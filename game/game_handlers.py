from uuid import uuid4


class GameNotFound(Exception):
    """Handles what to do if a game not found"""


class NameTaken(ValueError):
    """Handles what to do if a player name  is taken"""


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


def creat_game(game_id: str, player_num: int, squares_num: int = 180) -> dict:
    squares = {f"{i+1}": {"color": "", "clicked": 0} for i in range(squares_num)}
    game = {
        "game_id": game_id,
        "is_started": False,
        "is_finished": False,
        "is_resulted": False,
        "start_at_player": player_num,
        "squares": squares,
        "players": {},
    }
    return game


def restart_game(game: dict) -> dict:
    if game["is_resulted"]:
        raise GameResulted()
    game["is_started"] = False
    game["is_resulted"] = True

    game["players"] = {}
    for square in game["squares"].values():
        square["color"] = ""
        square["clicked"] = 0
    return game


def get_game_results(game: dict) -> dict:
    if game["is_resulted"]:
        raise GameResulted()

    players = game["players"]
    squares = game["squares"]
    players_result = {
        f"{player}": {"name": player, "color": players[player]["color"], "squares": 0} for player in players.keys()
    }
    for square in squares.values():
        for player in players_result.values():
            if square["color"] == player["color"]:
                player["squares"] += 1

    sorted_player_result = dict(sorted(players_result.items(), key=lambda item: item[1]["squares"], reverse=True))

    return sorted_player_result


def add_player_to_game(game: dict, player_name: str, player_color: str) -> dict:
    taken_colors = [player["color"] for player in game["players"].values()]
    if game["is_started"]:
        raise GameStarted()
    if len(game["players"].keys()) >= game["start_at_player"]:
        raise GameIsFulled()
    if player_name in game["players"]:
        raise NameTaken()
    if player_color in taken_colors:
        raise ColorTaken()

    game["players"][player_name] = {"name": player_name, "color": player_color, "clicked": 0, "occupied": 0}
    return game


def generate_game_id():
    game_id = uuid4()
    return str(game_id)[:7]
