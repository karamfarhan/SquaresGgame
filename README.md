<p align="center">

![Logo](/assets/logo.png)
</p>

<p align="center">
    <em>Squares,is a multiplayer game, made with Django.</em>
</p>
<p align="center">

<a href="https://github.com/karamfarhan/SquaresGgame/blob/main/LICENCE" target="_blank"><img src="https://img.shields.io/github/license/karamfarhan/SquaresGgame" alt="LICENCE">
</a>
<a href="https://github.com/karamfarhan/SquaresGgame/actions/workflows/lint.yaml" target="_blank"><img src="https://github.com/karamfarhan/SquaresGgame/actions/workflows/lint.yaml/badge.svg" alt="Lint">
  </a>
</p>
<p align="center">
    <h1>v1.0.0</h1>
</p>
---

## Table of contents

- [](#)
- [Table of contents](#table-of-contents)
- [Preview](#preview)
  - [Lobby](#lobby)
  - [Join](#join)
  - [Waiting lobby](#waiting-lobby)
  - [Active game](#active-game)
  - [Result page](#result-page)
- [How to play?](#how-to-play)
- [Dev installation](#dev-installation)
  - [install and run locally:](#install-and-run-locally)
  - [Run Using docker:](#run-using-docker)
- [Technologies used](#technologies-used)

## Preview

<note>

**Note**: `The game is still under development, you might see bugs, just make issue`

</note>

### Lobby
choose the number of players and the map size of the game
![Alt Text](/assets/create-game-players-number.png)
copy the game code and send it to your freinds
![Alt Text](/assets/create-game-done.png)
### Join
put the game code and choose name and color then hit enter game
![Alt Text](/assets/join-game.png)
### Waiting lobby
wait untill all players join
![Alt Text](/assets/wait-players.png)
when all players joined, 10 seconds countdown will start
![Alt Text](/assets/ready-countdwon.png)
### Active game
60 sec timer will start ,play and occupy as much squares as you can before the time ends
![Alt Text](/assets/play5-dashboard.png)

### Result page
game results after time is up will pup up, play again by pressing play again, so your name will change from red to green to show that you are ready to play again
![Alt Text](/assets/play-again.png)


## How to play?

Go to [squaresgamego](https://squaresgamego.herokuapp.com) and choose a nickname to get started!

- `Creating a game` - choose players number and map size you want in the game and Press "creat game" to generate a new game code, which you can share with your friends
- `Joining a game` - Enter the game code of an existing game and also choose a name and color for youself then press `enter game`
- `Waitng players` - Wait untill all players join
- `Playing` - Try to occupy as many squares as possible before the 60 seconds countdown finish and make them under you control,other players will do the same thing to take the squares back
- `Winning` - The winner is the player who occupied the most squares
- `Play again` - After the time is finished , you will see the results card for the round, and  you can click "play again" to get ready to play the next round

## Dev installation

### install and run locally:

Open the terminal inside the app directory :

1 - create venv
```
python -m venv venv_name
```
2 - Activate your venv :<br>
   - Windows  
        ```
        venv_name\scripts\activate.bat
        ```
   - Linux,Mac  
        ```
        source venv_name/bin/activate
        ```


4 - install the requirements file
```
pip install -r requirements.txt

```
5 -  make sure to set `DJANGO_SETTINGS_MODULE=core.settings.dev` in `.env` file and other values are set , like `SECRET_KEY`

6 - run the project by running
```
python manage.py runserver
```
7 - open this link on your browser `localhost:8000`.<br />


### Run Using docker:
1 - move the `Dockerfile` and `docker-compose.yml` files to the root directory

2 - Go to the `dev.py` files and change `CHANNEL_LAYERS` and `CACHES` To

```
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("lochalhost:6379", 6379)],
        },
    },
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://localhost:6379/1",
        "TIMEOUT": 300,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "MAX_ENTRIES": 1000,
        },
    }
}
```

3 -  make sure to set `DJANGO_SETTINGS_MODULE=core.settings.dev` in `.env` file and other values are set , like `SECRET_KEY`

4 - run `docker-compose up --build` in your terminal

**Note**: You need to have the desktop Docker app, download it from https://docs.docker.com/get-docker/

## Technologies used

- Django Channels for the backend, allowing it to communicate over both HTTP and WebSockets
- Javascript with Django template to communicate with WebSockets on the backend
- Redis as a Cache and as a layers for channels
- Docker as a main packaging system, which makes development OS-agnostic and simplified the setup process


<note>

**Note**: `If you would like to contribute to this project follow  [contribute](https://github.com/karamfarhan/channels-multi-player-simple-game/blob/main/CONTRIBUTING.md)

</note>



TO CONTACT ME SEND EMAIL ON forprokm@gmail.com
