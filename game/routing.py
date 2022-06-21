from django.urls import re_path,path

from . import consumers
websocket_urlpatterns = [
    path('ws/game/<str:game_id>/',consumers.GameConsumer.as_asgi()),
    # re_path(r'ws/game/(?P<game_id>\w+)/$', consumers.GameConsumer.as_asgi()),
]