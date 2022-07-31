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
        await self.channel_layer.group_send(
            self.game_id, {"type": "Game_Send", "data": game}
        )

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
        if text_data_json["method"] == "play":
            print("play")

        elif text_data_json["method"] == "update_ball":
            game = await cache.aget(f"game:{self.game_id}")
            game["squares"][f'{data["ballId"]}']["color"] = data["color"]
            game["squares"][f'{data["ballId"]}']["clicked"] = data["clicked"]
            await cache.aset(f"game:{self.game_id}", game)
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "Updat_Ball",
                    "data": {
                        "ballId": data["ballId"],
                        "color": data["color"],
                        "clicked": data["clicked"],
                    },
                },
            )

    async def Game_Send(self, event):
        data = event["data"]

        ## Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "Game_Send", "data": data}))

    async def Updat_Ball(self, event):
        data = event["data"]

        ## Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "update_ball", "data": data}))
