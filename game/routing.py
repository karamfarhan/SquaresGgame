from django.urls import re_path

from .consumers import ChatConsumer, GameConsumer

websocket_urlpatterns = [
    re_path(r"ws/game/(?P<game_id>\w+)/(?P<name>\w+)/$", GameConsumer.as_asgi()),
    re_path(
        r"ws/chat/(?P<game_id>\w+)/(?P<player>\w+)/$",
        ChatConsumer.as_asgi(),
    ),
]
