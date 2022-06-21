# multi-player-simple-game with channels!
> How to run the app on your localhost

1 - download the zip file and unpack it

OPEN TERMINAL :

2 - create venv
```
python -m venv venv_name
```
3 - activate your venv :
   windows ```venv_name\scripts\activate.bat```
   linux,mac ```source venv_name/bin/activate```

> Now you need to run put channel layers configration

> if you have redis server running in docker or in external server put this code
> if the redis server running on docker container put `"host":[("127.0.0.1", 6379)]` in hosts
```
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [REDIS_URL],
        },
    },
}
```
> if you want to user your memory to run  channel layers  put this code <br/>

```
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
```


4 - install the requirements file ```pip install -r requirements.txt```.<br />
9 - run the project by running ```python manage.py runserver```.<br />
10 - open your browser and go to the link (localhost:8000).<br />



TO CONTACT ME SEND EMAIL ON www.karam777krm@gmail.com