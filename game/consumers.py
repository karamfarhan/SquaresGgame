from channels.generic.websocket import AsyncWebsocketConsumer
import json


class GameConsumer(AsyncWebsocketConsumer):
    ## conect
    async def connect(self):
        ## join the group
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        await self.channel_layer.group_add(
            self.game_id,
            self.channel_name
        )

        
        await self.accept()
    ## disconnect
    async def disconnect(self, close_code):
        ## Leave room group
        await self.channel_layer.group_discard(
            self.game_id,
            self.channel_name
        )
    ## receive message 
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data = text_data_json['data']

        ## Send message to room group
        await self.channel_layer.group_send(
            self.game_id,
            {
                'type': 'send_game',
                'data': data
            }
        )

    async def send_game(self, event):
        data = event['data']

        ## Send message to WebSocket
        await self.send(text_data=json.dumps({
            'method':'update',
            'data': data
        }))