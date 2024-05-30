from django.urls import path

from .views import create_game_view, game, home, join, rest_game

app_name = "game"
urlpatterns = [
    path("", home, name="home"),
    path("join/", join, name="join"),
    path("game/", game, name="game"),
    path("create/", create_game_view, name="create"),
    path("result/", rest_game, name="result"),
]
