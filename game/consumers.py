import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache

from .game_handlers import add_player_to_game


class GameConsumer(AsyncWebsocketConsumer):
    # conect
    async def connect(self):
        # join the group
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.player_name = self.scope["url_route"]["kwargs"]["name"]
        await self.channel_layer.group_add(
            self.game_id,
            self.channel_name,
        )
        game = await cache.aget(f"game:{self.game_id}")
        # if game excist
        if game:
            # check if the players are all joined
            if len(game["players"].keys()) == game["start_at_player"]:
                data = {"players": game["players"], "start_get_ready": True}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
                await self.channel_layer.group_send(self.game_id, {"type": "Get_Ready", "data": data})
            else:
                data = {"players": game["players"]}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
        print("last")

        await self.accept()

    # disconnect
    async def disconnect(self, close_code):
        # Leave room group
        game = await cache.aget(f"game:{self.game_id}")
        try:
            del game["players"][self.player_name]
        except Exception:
            pass
        await cache.aset(f"game:{self.game_id}", game)
        data = {"players": game["players"]}
        await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    # receive message
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json["data"]

        # Send message to room group
        if text_data_json["method"] == "update_ball":
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "Update_Square",
                    "data": {
                        "squareId": data["squareId"],
                        "color": data["color"],
                        "clicked": data["clicked"],
                        # "lastColor":data["lastColor"]
                    },
                },
            )
        elif text_data_json["method"] == "restart_game":
            game = await cache.aget(f"game:{self.game_id}")
            try:
                game = add_player_to_game(game, data["name"], data["color"])
            except ValueError:
                await self.channel_layer.group_discard(self.game_id, self.channel_name)
            game["is_resulted"] = False
            await cache.aset(f"game:{self.game_id}", game)
            if len(game["players"].keys()) == game["start_at_player"]:
                data = {"players": game["players"], "start_get_ready": True}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
                await self.channel_layer.group_send(self.game_id, {"type": "Get_Ready", "data": data})
            else:
                data = {"players": game["players"]}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
        elif text_data_json["method"] == "start_game":
            game = await cache.aget(f"game:{self.game_id}")
            if game["is_started"] is False and data["go_start_game"] is True:
                print("#3")
                # turn the game on and start it
                game["is_started"] = True
                await cache.aset(f"game:{self.game_id}", game)
                await self.channel_layer.group_send(self.game_id, {"type": "Start_Game", "data": game})

    async def Update_Square(self, event):
        data = event["data"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "update_square", "data": data}))

    async def Update_Players(self, event):
        data = event["data"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "update_players", "data": data}))

    async def Start_Game(self, event):
        data = event["data"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "start_game", "data": data}))

    async def Get_Ready(self, event):
        data = event["data"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "get_ready", "data": data}))
