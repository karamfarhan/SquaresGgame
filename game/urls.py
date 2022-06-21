from django.urls import path
from . views import home,game ,join
urlpatterns = [
    path('',home,name="home"),
    path('join/',join,name='join'),
    path('game/',game,name="game")
]
