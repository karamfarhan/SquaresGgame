from django.shortcuts import render,redirect
from django.urls import reverse
import urllib.parse
# Create your views here.

def home(request):
    context = {}
    return render(request,'game/home.html',context=context)


def join(request):
    context = {}
    if request.method == "POST":
        game_id = request.POST.get("game")
        user_name = request.POST.get('username')
        color = request.POST.get('color')
        context['game_id'] = game_id
        context['user_name'] = user_name
        context['color'] = color
        print(context)
        url = '{}?{}'.format(reverse('game'), urllib.parse.urlencode(context))
        return redirect(url)
    return render(request,'game/join.html')


def game(request):
    context = {}
    context['user_name'] = request.GET.get('user_name')
    context['game_id'] =  request.GET.get('game_id')
    context['color'] =  request.GET.get('color')
    return render(request,'game/game.html',context=context)