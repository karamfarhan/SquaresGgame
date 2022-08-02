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


class GameFisnished(Exception):
    """Handles what to do if the game is finished"""

    pass


class GameResulted(Exception):
    """Handles what to do if the game is resulted"""

    pass


def creat_game(game_id: str, squares_num: int = 180) -> dict:
    squares = {f"{i+1}": {"color": "", "clicked": 0} for i in range(squares_num)}
    game = {
        "game_id": game_id,
        "is_started": False,
        "is_finished": False,
        "is_resulted": False,
        "squares": squares,
        "players": {},
    }
    return game


def restart_game(game: dict) -> dict:
    game["is_started"] = False
    game["is_resulted"] = True

    game["players"] = {}
    for square in game["squares"].values():
        square["color"] = ""
        square["clicked"] = 0
    print("restart game workd 5")
    return game


def get_game_results(game: dict) -> dict:
    print("get game result 2")
    if game["is_resulted"]:
        raise GameResulted()

    players = game["players"]
    squares = game["squares"]
    players_result = {
        f"{player}": {"name": player, "color": players[player]["color"], "squares": 0}
        for player in players.keys()
    }
    for square in squares.values():
        for player in players_result.values():
            if square["color"] == player["color"]:
                player["squares"] += 1
    print("get game result worked 3")
    print(players_result)
    return players_result


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
