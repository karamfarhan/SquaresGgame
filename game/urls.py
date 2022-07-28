from django.urls import path

from .views import game, home, join

urlpatterns = [
    path("", home, name="home"),
    path("join/", join, name="join"),
    path("game/", game, name="game"),
]
