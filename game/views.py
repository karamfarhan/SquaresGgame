import json
import urllib.parse

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.cache import cache
from django.shortcuts import redirect, render
from django.urls import reverse

channel_layer = get_channel_layer()
# Create your views here.


def home(request):
    context = {}
    return render(request, "game/home.html", context=context)


def join(request):
    context = {}
    if request.method == "POST":
        game_id = request.POST.get("game")
        user_name = request.POST.get("username")
        color = request.POST.get("color")

        User = {"user_name": user_name, "user_color": color}

        if cache.get(game_id):

            Game = cache.get(game_id)
            Game["users"].append(User)
            print(Game)
            cache.set(game_id, Game)
            print("cached-UPDATE!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        else:
            Balls = {f"{i+1}": {"ball_color":"","ball_click":0} for i in range(180)}
            Game = {"game_id": game_id, "balls": Balls, "users": []}
            Game["users"].append(User)
            print(Game)
            cache.set(game_id, Game)
            print("cached-NEW!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        # you don't need to do that
        # async_to_sync(channel_layer.group_send)(game_id, {"type": "Game_Send", "data": Game})
        context["game_id"] = game_id
        context["user_name"] = user_name
        context["color"] = color
        print(context)
        url = "{}?{}".format(reverse("game"), urllib.parse.urlencode(context))
        return redirect(url)
    return render(request, "game/join.html")


def game(request):
    context = {}
    context["user_name"] = request.GET.get("user_name")
    context["game_id"] = request.GET.get("game_id")
    context["color"] = request.GET.get("color")
    return render(request, "game/game.html", context=context)
