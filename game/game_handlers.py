class GameNotFound(Exception):
    """Handles what to do if a game not found"""

    pass


class NicknameTaken(ValueError):
    """Handles what to do if a player name  is taken"""

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


def add_player_to_game(game: dict, player_name: str, player_colro: str) -> dict:
    if player_name in game["players"]:
        raise NicknameTaken()

    game["players"][player_name] = {
        "name": player_name,
        "color": player_colro,
        "clicked": 0,
    }
    return game
