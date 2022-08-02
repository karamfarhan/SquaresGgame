import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache


class GameConsumer(AsyncWebsocketConsumer):
    ## conect
    async def connect(self):
        ## join the group
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        await self.channel_layer.group_add(
            self.game_id,
            self.channel_name,
        )

        game = await cache.aget(f"game:{self.game_id}")
        if len(game["players"].keys()) >= 2:
            game["is_started"] = True
            await self.channel_layer.group_send(self.game_id, {"type": "Send_Game", "data": game})
        else:
            players = game["players"]
            await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": players})

        await self.accept()

    ## disconnect
    async def disconnect(self, close_code):
        ## Leave room group
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    ## receive message
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json["data"]

        ## Send message to room group
        if text_data_json["method"] == "update_ball":
            game = await cache.aget(f"game:{self.game_id}")
            game["squares"][f'{data["squareId"]}']["color"] = data["color"]
            game["squares"][f'{data["squareId"]}']["clicked"] = data["clicked"]
            await cache.aset(f"game:{self.game_id}", game)
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "Update_Square",
                    "data": {
                        "squareId": data["squareId"],
                        "color": data["color"],
                        "clicked": data["clicked"],
                    },
                },
            )

    async def Send_Game(self, event):
        data = event["data"]

        ## Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "send_game", "data": data}))

    async def Update_Square(self, event):
        data = event["data"]

        ## Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "update_square", "data": data}))
    async def Update_Players(self, event):
        data = event["data"]

        ## Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "update_players", "data": data}))
