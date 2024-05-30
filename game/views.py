import urllib.parse

from channels.layers import get_channel_layer
from django.contrib import messages
from django.core.cache import cache
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse

from .game_handlers import (
    ColorTaken,
    GameIsFulled,
    GameStarted,
    NameLong,
    NameTaken,
    add_player_to_game,
    creat_game,
    generate_game_id,
    restart_game,
)

channel_layer = get_channel_layer()

# Create your views here.


def home(request):
    context = {}
    return render(request, "game/home.html", context=context)


## Not updated, see it later
def join(request):
    if request.method == "POST":
        game_id = request.POST.get("game")
        name = request.POST.get("name").replace(" ", "")
        color = request.POST.get("color")
        game = cache.get(f"game:{game_id}")
        if game:
            try:
                updated_game = add_player_to_game(game, name, color)
                cache.set(f"game:{game_id}", updated_game)
                return redirect(
                    reverse("game:game")
                    + "?"
                    + urllib.parse.urlencode(
                        {
                            "game_id": game_id,
                            "name": name,
                            "color": color,
                            "game_mod": updated_game["game_mod"],
                        }
                    )
                )
            except GameStarted:
                messages.error(request, "The game has started.")
            except GameIsFulled:
                messages.error(request, "The game is full.")
            except NameTaken:
                messages.error(request, "The name is taken, pick another name.")
            except NameLong:
                messages.error(request, "The name is too long, pick a name under 8 letters.")
            except ColorTaken:
                messages.error(request, "The color is taken, pick another color.")
        else:
            messages.error(request, "There is no game hosted with this ID.")

        return HttpResponseRedirect(request.path_info)

    return render(request, "game/join.html")


def game(request):
    context = {
        "name": request.GET.get("name"),
        "game_id": request.GET.get("game_id"),
        "color": request.GET.get("color"),
        "game_mod": request.GET.get("game_mod"),
    }
    return render(request, "game/game.html", context=context)


def rest_game(request):
    game_id = request.GET.get("game_id")
    game = cache.get(f"game:{game_id}")
    if game:
        game_restarted = restart_game(game)
        cache.set(f"game:{game_id}", game_restarted)
    return JsonResponse({})


# test atomi cpushes
def create_game_view(request):
    # if request.method == 'POST':
    player_num = int(request.GET.get("player_num", 2))
    map_size = int(request.GET.get("map_size", 312))
    game_mod = request.GET.get("game_mod", "normal_mod")
    game_id = generate_game_id()
    try:
        game = creat_game(game_id, player_num, map_size, game_mod)
        cache.set(f"game:{game_id}", game)
    except Exception as e:
        messages.add_message(request, messages.ERROR, f"Error Happend While Creating Game. {e}")
        return JsonResponse({"success": False})
    return JsonResponse({"success": True, "game_id": game_id})


# return JsonResponse({'success': False, 'message': 'Invalid request method'})
