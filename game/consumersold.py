import datetime
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache

from .game_handlers import get_add_results_for_player, reset_player_in_game, restart_game


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
        game = await cache.aget(f"game:{self.game_id}")
        # if game excist
        if game:
            # check if the players are all joined
            num_ready_players = sum(player["is_ready"] for player in game["players"].values())
            data = {
                "players": game["players"],
                "game_running": game["is_started"],
                "map_players_size": game["map_players_size"],
            }
            if num_ready_players == game["map_players_size"]:
                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
                data["start_get_ready"] = True
                await self.channel_layer.group_send(self.game_id, {"type": "Get_Ready", "data": data})
            else:
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
        except KeyError:
            pass
        await cache.aset(f"game:{self.game_id}", game)
        data = {
            "players": game["players"],
            "game_running": game["is_started"],
            "map_players_size": game["map_players_size"],
        }
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
            game = await cache.aget(f"game:{self.game_id}")
            try:
                game = reset_player_in_game(game, data["name"])

            except ValueError:
                await self.channel_layer.group_discard(self.game_id, self.channel_name)

            game["is_resulted"] = False
            await cache.aset(f"game:{self.game_id}", game)
            num_ready_players = sum(player["is_ready"] for player in game["players"].values())
            data = {
                "players": game["players"],
                "game_running": game["is_started"],
                "map_players_size": game["map_players_size"],
            }
            # print(game)
            if num_ready_players == game["map_players_size"]:

                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})
                data["start_get_ready"] = True
                await self.channel_layer.group_send(self.game_id, {"type": "Get_Ready", "data": data})
            else:

                await self.channel_layer.group_send(self.game_id, {"type": "Update_Players", "data": data})

        elif text_data_json["method"] == "start_game":

            game = await cache.aget(f"game:{self.game_id}")
            if game["is_started"] is False and data["go_start_game"] is True:
                # turn the game on and start it
                game["is_started"] = True
                await cache.aset(f"game:{self.game_id}", game)
                await self.channel_layer.group_send(self.game_id, {"type": "Start_Game", "data": game})
        elif text_data_json["method"] == "player_results":

            # print(data)
            game = await cache.aget(f"game:{self.game_id}")
            game = get_add_results_for_player(game, data)
            # if send_results_to_client:
            game = restart_game(game)
            await cache.aset(f"game:{self.game_id}", game)
            await self.channel_layer.group_send(self.game_id, {"type": "Send_Results", "data": game})
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "Update_Players",
                    "data": {
                        "players": game["players"],
                        "game_running": game["is_started"],
                        "map_players_size": game["map_players_size"],
                    },
                },
            )
            # await cache.aset(f"game:{self.game_id}", game)

    async def Update_Square(self, event):
        data = event["data"]
        # print(f"Sending [Update_Square] Method")
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

    async def Send_Results(self, event):
        data = event["data"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"method": "send_results", "data": data}))


# Chat Consumer, Chat WS Connection Handler


class ChatConsumer(AsyncWebsocketConsumer):
    # Connect
    async def connect(self):
        self.player = self.scope["url_route"]["kwargs"]["player"]
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.room_group_name = f"chat-{self.game_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        # Add the user to the game-chat group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "Send_Notification",
                "data": {
                    "message": f"{self.player} Joined The Game",
                    "player": self.player,
                    "player_color": None,
                    "cmd": None,
                    "date": None,
                },
            },
        )
        await self.accept()

    # Disconnect
    async def disconnect(self, code):
        # Remove the user from the game-chat group
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

    # Receive messages from frontend websocket connection
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["data"]["message"]
        player = text_data_json["data"]["player"]
        player_color = text_data_json["data"]["player_color"]
        text_data_json["data"]["game_id"]

        if text_data_json["method"] == "send_message":
            # print("MESSAGE RECIEVED",message)
            # Send the message to the game-chat group based on the Message type
            # data = {
            #     "message": message,
            #     "player": player,
            #     "player_color": player_color,
            #     "game_id": game_id,
            # }
            # is_regular_message = input_handler(data)
            is_regular_message = [True]
            date_now = datetime.datetime.now().strftime("%I:%M %p")

            if is_regular_message[0] is True:
                # Regular Message => Send it as it is
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
                # print("MESSAGE SENT TO ALL PLAYERS")
            else:
                cmd = is_regular_message[1]
                # Command Message => Send a notification
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

    # Handlers
    # Receive message from group

    # Regular Message Handler
    async def Send_Messages(self, event):
        # print("Send_Messages Handler Called")
        data = event["data"]
        # Send message to WebSocket connection on the frontend
        await self.send(
            text_data=json.dumps(
                {
                    "method": "MSG",
                    "data": data,
                }
            )
        )

    # Notification Handler
    async def Send_Notification(self, event):
        # print("Send_Notification Handler Called")
        data = event["data"]
        await self.send(
            text_data=json.dumps(
                {
                    "method": "NTF",
                    "data": data,
                }
            )
        )
