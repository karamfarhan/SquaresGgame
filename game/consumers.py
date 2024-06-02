import asyncio
import datetime
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache

from .game_handlers import get_add_results_for_player, reset_player_in_game, restart_game

lock = asyncio.Lock()


class GameConsumer(AsyncWebsocketConsumer):
    # TODO: in connect def i should study if i should accept after the logic or before the logic
    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.player_name = self.scope["url_route"]["kwargs"]["name"]
        await self.channel_layer.group_add(self.game_id, self.channel_name)
        await self.accept()

        game = await cache.aget(f"game:{self.game_id}")
        if game:
            await self.update_game_status(game)

    async def disconnect(self, close_code):
        game = await cache.aget(f"game:{self.game_id}")
        if game and self.player_name in game["players"]:
            del game["players"][self.player_name]
            await cache.aset(f"game:{self.game_id}", game)
            # data = {
            #     "players": game["players"],
            #     "game_running": game["is_started"],
            #     "map_players_size": game["map_players_size"],
            # }
            await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": game})
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json["data"]
        method = text_data_json["method"]
        # Different Version - Better ==> Changed
        if method == "update_square":
            await self.handle_update_square(data)

        elif method == "restart_game":
            await self.handle_restart_game(data)

        elif method == "start_game":
            await self.handle_start_game(data)

        elif method == "player_results":
            async with lock:
                print("lock the handle_player_results")
                await self.handle_player_results(data)

    async def handle_update_square(self, data):
        square_data = {
            "squareId": data["squareId"],
            "color": data["color"],
            "clicked": data["clicked"],
        }
        await self.channel_layer.group_send(
            self.game_id,
            {"type": "Update_Square", "data": square_data},
        )

    # Different Version - Better ==> Changed ? Could be error
    async def handle_restart_game(self, data):
        game = await cache.aget(f"game:{self.game_id}")
        if game:
            try:
                game = reset_player_in_game(game, data["name"])
            except ValueError:
                await self.channel_layer.group_discard(self.game_id, self.channel_name)
                return

            game["is_resulted"] = False
            await cache.aset(f"game:{self.game_id}", game)
            await self.update_game_status(game)

    async def handle_start_game(self, data):
        game = await cache.aget(f"game:{self.game_id}")
        if game and not game["is_started"] and data["go_start_game"]:
            game["is_started"] = True
            await cache.aset(f"game:{self.game_id}", game)
            await self.channel_layer.group_send(self.game_id, {"type": "Start_Game", "data": game})

    async def handle_player_results(self, data):
        print(f"handle_player_results CALLED by {data['player_name']}")
        game = await cache.aget(f"game:{self.game_id}")
        if game:
            game, send_ressults = get_add_results_for_player(game, data)
            await cache.aset(f"game:{self.game_id}", game)
            if send_ressults:
                print(f"game is resulted by last player:  {data['player_name']}, SENDING RESULTS")
                game = restart_game(game)
                await cache.aset(f"game:{self.game_id}", game)
                # send only the necessary data, because i don't want to send the whole game
                data_to_send = {
                    "players": game["players"],
                    "current_round": game["current_round"],
                    "game_mod": game["game_mod"],
                }
                await self.channel_layer.group_send(self.game_id, {"type": "Send_Results", "data": data_to_send})
                # Different Version - Better ==> Changed
                await self.update_game_status(game)

    async def update_game_status(self, game):
        # i am not sending the whole game, because i don't want to send squares with
        # update players (unnecessary load), that is why structure the send data in this way
        num_ready_players = sum(player["is_ready"] for player in game["players"].values())
        # data = {
        #     "players": game["players"],
        #     "game_running": game["is_started"],
        #     "map_players_size": game["map_players_size"],
        # }
        await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": game})
        if num_ready_players == game["map_players_size"]:
            game["start_get_ready"] = True
            # data["squares"] = game["squares"]
            # data["game_mod"] = game["game_mod"]
            await self.channel_layer.group_send(self.game_id, {"type": "Get_Ready", "data": game})

    # Different Version - Rethink ==> Not sure
    async def Update_Square(self, event):
        await self.send_event("update_square", event)

    async def Update_Players(self, event):
        await self.send_event("update_players", event)

    async def Start_Game(self, event):
        await self.send_event("start_game", event)

    async def Get_Ready(self, event):
        await self.send_event("get_ready", event)

    async def Send_Results(self, event):
        await self.send_event("send_results", event)

    async def send_event(self, method, event):
        await self.send(text_data=json.dumps({"method": method, "data": event["data"]}))


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.player = self.scope["url_route"]["kwargs"]["player"]
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.room_group_name = f"chat-{self.game_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        left_to_join = ""
        game = await cache.aget(f"game:{self.game_id}")
        if game:
            if len(game["players"]) < game["map_players_size"]:
                left_to_join = f" ({game['map_players_size'] - len(game['players'])}) Left To Join"
        if self.player in game["players"]:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "Send_Notification",
                    "data": {
                        "message": f"{self.player} Joined The Game.{left_to_join}",
                        "player": self.player,
                        "player_color": None,
                        "cmd": None,
                        "date": None,
                    },
                },
            )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "Send_Notification",
                "data": {
                    "message": f"{self.player} Disconnected From The Game",
                    "player": self.player,
                    "player_color": None,
                    "cmd": None,
                    "date": None,
                },
            },
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Different Version - Rethink --> Stay
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json["data"]
        method = text_data_json["method"]

        if method == "send_message":
            await self.handle_send_message(data)

    async def handle_send_message(self, data):
        message = data["message"]
        player = data["player"]
        player_color = data["player_color"]
        date_now = datetime.datetime.now().strftime("%I:%M %p")

        is_regular_message = [True]
        if is_regular_message[0]:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "Send_Messages",
                    "data": {
                        "message": message,
                        "player": player,
                        "player_color": player_color,
                        "date": date_now,
                    },
                },
            )
        else:
            cmd = is_regular_message[1]
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "Send_Notification",
                    "data": {
                        "message": message,
                        "player": player,
                        "player_color": player_color,
                        "cmd": cmd,
                        "date": date_now,
                    },
                },
            )

    async def Send_Messages(self, event):
        await self.send_event("MSG", event)

    async def Send_Notification(self, event):
        await self.send_event("NTF", event)

    async def send_event(self, method, event):
        await self.send(text_data=json.dumps({"method": method, "data": event["data"]}))
