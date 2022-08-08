from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/game/(?P<game_id>\w+)/(?P<name>\w+)/$", consumers.GameConsumer.as_asgi()),
    # path("ws/game/<str:game_id>/", consumers.GameConsumer.as_asgi()),
]
