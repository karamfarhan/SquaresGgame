import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache

from .game_handlers import reset_player_in_game


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
        # TODO: should see if must accept connection before if statemets, you should investigate
        print(f"{self.player_name} is connected #A1")
        game = await cache.aget(f"game:{self.game_id}")
        # if game excist
        if game:
            print(f"{self.game_id} game found in cache #A2")
            # check if the players are all joined
            num_ready_players = sum(player["is_ready"] for player in game["players"].values())
            if num_ready_players == game["start_at_player"]:
                print(f"{self.game_id} game's players are compeleted #A3")
                data = {"players": game["players"], "start_get_ready": True}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
                await self.channel_layer.group_send(self.game_id, {"type": "Get_Ready", "data": data})
            else:
                print(f"Adding New Player to {self.game_id} #A4")
                data = {"players": game["players"]}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})

        await self.accept()

    # disconnect
    async def disconnect(self, close_code):
        # TODO: should be updating the game data in cache and calling Update_Players method
        # TODO: Only if removing him was success
        # Leave room group
        game = await cache.aget(f"game:{self.game_id}")
        try:
            del game["players"][self.player_name]
            print(f"Removed a {self.player_name} from {self.game_id} #B1")
        except Exception:
            print(f"{self.player_name} Not Found in{self.game_id} To remove #B2")
        await cache.aset(f"game:{self.game_id}", game)
        print(f"Updating {self.game_id} in Cache after deleting {self.player_name} #B3")
        data = {"players": game["players"]}
        await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    # receive message
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json["data"]

        # Send message to room group
        if text_data_json["method"] == "update_ball":
            square_data = {
                "squareId": data["squareId"],
                "color": data["color"],
                "clicked": data["clicked"],
                # "lastColor":data["lastColor"]
            }
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "Update_Square",
                    "data": square_data,
                },
            )
        elif text_data_json["method"] == "restart_game":
            print("Restart game method Called in receiveing #C1")
            game = await cache.aget(f"game:{self.game_id}")
            print(f"{self.game_id} Found in cache #C2")
            try:
                game = reset_player_in_game(game, data["name"])
                print(f"added {data['name']} to {self.game_id} #C3")
            except ValueError:
                await self.channel_layer.group_discard(self.game_id, self.channel_name)
                print(f"NOT added {data['name']} to {self.game_id} #C4")
            game["is_resulted"] = False
            await cache.aset(f"game:{self.game_id}", game)
            num_ready_players = sum(player["is_ready"] for player in game["players"].values())
            if num_ready_players == game["start_at_player"]:
                print(f"{self.game_id} game's players are compeleted #C4")
                data = {"players": game["players"], "start_get_ready": True}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
                await self.channel_layer.group_send(self.game_id, {"type": "Get_Ready", "data": data})
            else:
                print(f"Adding new Player in {self.game_id}, Not compeleted #C5")
                data = {"players": game["players"]}
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
        elif text_data_json["method"] == "start_game":
            print("Start game method Called in receiveing #D1")
            game = await cache.aget(f"game:{self.game_id}")
            if game["is_started"] is False and data["go_start_game"] is True:
                print(f"{self.game_id} is found and go_start_game == True #D2")
                # turn the game on and start it
                game["is_started"] = True
                await cache.aset(f"game:{self.game_id}", game)
                await self.channel_layer.group_send(self.game_id, {"type": "Start_Game", "data": game})

    async def Update_Square(self, event):
        data = event["data"]
        # print(f"Sending [Update_Square] Method")
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "update_square", "data": data}))

    async def Update_Players(self, event):
        data = event["data"]
        print("Sending [Update_Players] Method")
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "update_players", "data": data}))

    async def Start_Game(self, event):
        data = event["data"]
        print("Sending [Start_Game] Method")
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "start_game", "data": data}))

    async def Get_Ready(self, event):
        data = event["data"]
        print("Sending [Get_Ready] Method")
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "get_ready", "data": data}))
