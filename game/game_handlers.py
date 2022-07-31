from uuid import uuid4


class GameNotFound(Exception):
    """Handles what to do if a game not found"""

    pass


class NameTaken(ValueError):
    """Handles what to do if a player name  is taken"""

    pass


class ColorTaken(ValueError):
    """Handles what to do if a color is taken"""

    pass


class GameStarted(Exception):
    """Handles what to do if a player tries to join when the game has started"""

    pass


def creat_game(game_id: str, squares_num: int = 180) -> dict:
    squares = {f"{i+1}": {"color": "", "clicked": 0} for i in range(squares_num)}
    game = {
        "game_id": game_id,
        "is_started": False,
        "is_finished": False,
        "squares": squares,
        "players": {},
    }
    return game


def add_player_to_game(game: dict, player_name: str, player_color: str) -> dict:
    taken_colors = [player["color"] for player in game["players"].values()]
    if game["is_started"]:
        raise GameNotFound()
    if player_name in game["players"]:
        raise NameTaken()
    if player_color in taken_colors:
        raise ColorTaken()

    game["players"][player_name] = {
        "name": player_name,
        "color": player_color,
        "clicked": 0,
    }
    return game


def generate_game_id():
    game_id = uuid4()
    return str(game_id)[:7]
