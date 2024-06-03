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


class GameIsFull(Exception):
    """Handles what to do if the game Full of players"""
