class GameNotFound(Exception):
    """Handles what to do if a game is not found"""


class NameTaken(ValueError):
    """Handles what to do if a player name is taken"""


class NameLong(ValueError):
    """Your Name is too long, must be under 8 letters"""


class ColorTaken(ValueError):
    """Handles what to do if a color is taken"""


class GameStarted(Exception):
    """Handles what to do if a player tries to join when the game has started"""


class GameFinished(Exception):
    """Handles what to do if the game is finished"""


class GameResulted(Exception):
    """Handles what to do if the game is resulted"""


class GameIsFull(Exception):
    """Handles what to do if the game is full of players"""


def create_game(game_id: str, player_num: int, map_size: int, game_mod: str = "normal") -> dict:
    squares = {f"{i+1}": {"color": "", "clicked": 0} for i in range(map_size)}
    return {
        "game_id": game_id,
        "game_mod": game_mod,
        "is_started": False,
        "is_finished": False,
        "is_resulted": False,
        "current_round": 1,
        "players": {},
        "player_num": player_num,
        "map_players_size": player_num,
        "squares": squares,
    }


def restart_game(game):
    for player in game["players"]:
        reset_player_in_game(game, player)

    game["is_started"] = False
    game["is_finished"] = False
    game["is_resulted"] = False
    return game


def reset_player_in_game(game, player):
    if player in game["players"]:
        game["players"][player]["score"] = 0
        game["players"][player]["ready"] = False
    return game


def get_add_results_for_player(game, data):
    player = data.get("name")
    if player in game["players"]:
        game["players"][player]["score"] += data.get("score", 0)
    return game


def join_game(game, name, color):
    if game["is_started"]:
        raise GameStarted()
    if name in game["players"]:
        raise NameTaken()
    if len(name) > 8:
        raise NameLong()
    if color in [player["color"] for player in game["players"].values()]:
        raise ColorTaken()
    if len(game["players"]) >= game["player_num"]:
        raise GameIsFull()

    game["players"][name] = {"color": color, "score": 0, "ready": False}
    return game


def update_square(game, square_id, color, clicked):
    if square_id in game["squares"]:
        game["squares"][square_id] = {"color": color, "clicked": clicked}
    return game


def set_player_ready(game, player_name, is_ready):
    if player_name in game["players"]:
        game["players"][player_name]["is_ready"] = is_ready
    return game


def start_game(game):
    game["is_started"] = True
    return game


def end_game(game):
    game["is_finished"] = True
    return game


def get_game_results(game):
    results = {player: game["players"][player]["score"] for player in game["players"]}
    game["is_resulted"] = True
    return results, game
