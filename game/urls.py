from django.urls import path

from .views import creat_game_view, game, get_result, home, join

app_name = "game"
urlpatterns = [
    path("", home, name="home"),
    path("join/", join, name="join"),
    path("game/", game, name="game"),
    path("create/", creat_game_view, name="creat"),
    path("result/", get_result, name="result"),
]
