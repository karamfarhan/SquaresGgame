from django.urls import path

from .views import game, home, join

app_name = "game"
urlpatterns = [
    path("", home, name="home"),
    path("join/", join, name="join"),
    path("game/", game, name="game"),
]
