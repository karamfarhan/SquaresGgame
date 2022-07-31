import json
import urllib.parse

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib import messages
from django.core.cache import cache
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse

from .game_handlers import NicknameTaken, add_player_to_game, creat_game

channel_layer = get_channel_layer()
# Create your views here.


def home(request):
    context = {}
    return render(request, "game/home.html", context=context)


def join(request):
    context = {}
    if request.method == "POST":
        game_id = request.POST.get("game")
        name = request.POST.get("name")
        color = request.POST.get("color")
        game = cache.get(f"game:{game_id}")

        if game:
            try:
                add_player_to_game(game, name, color)
                cache.set(f"game:{game_id}", game)
            except NicknameTaken:
                messages.add_message(
                    request, messages.ERROR, "The name has been taken, pick other name"
                )
                return HttpResponseRedirect(request.path_info)

        else:
            game = creat_game(game_id)
            add_player_to_game(game, name, color)
            cache.set(f"game:{game_id}", game)
        context["game_id"] = game_id
        context["name"] = name
        context["color"] = color
        url = "{}?{}".format(reverse("game:game"), urllib.parse.urlencode(context))
        return redirect(url)
    return render(request, "game/join.html")


def game(request):
    context = {}
    context["name"] = request.GET.get("name")
    context["game_id"] = request.GET.get("game_id")
    context["color"] = request.GET.get("color")
    return render(request, "game/game.html", context=context)
