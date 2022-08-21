<p align="center">

![Logo](/assets/logo.png)
</p>

<p align="center">
    <em>Squares, a game is a multiplayer game, made with Django.</em>
</p>
<p align="center">

<a href="https://github.com/karamfarhan/channels-multi-player-simple-game/blob/main/LICENCE" target="_blank"><img src="https://img.shields.io/github/license/karamfarhan/channels-multi-player-simple-game" alt="LICENCE">
</a>
<a href="https://github.com/karamfarhan/channels-multi-player-simple-game/actions/workflows/lint.yaml" target="_blank"><img src="https://github.com/karamfarhan/channels-multi-player-simple-game/actions/workflows/lint.yaml/badge.svg" alt="Lint">
  </a>
</p>

---


squares game play and make fun.

squares game is a multiplayer game, made with Django.


## Table of contents

- [Table of contents](#table-of-contents)
- [Preview](#preview)
  - [Lobby](#lobby)
  - [Join](#join)
  - [Active game](#active-game)
  - [Result page](#result-page)
- [How to play?](#how-to-play)
- [Dev installation](#dev-installation)
  - [Using docker:](#using-docker)
  - [install locally:](#install-locally)
- [Technologies used](#technologies-used)

## Preview

<note>

**Note**: `The game is still under development, you might see bugs, just make issue`

</note>

### Lobby
choose how much players you want by typing a number and click creat game
![Alt Text](/assets/create-game-players-number.png)
copy the game code and send it to your freind
![Alt Text](/assets/create-game-done.png)
### Join
put the game code and choose name and color
![Alt Text](/assets/join-game.png)
### Active game
play and take as much as squares you can
![Alt Text](/assets/play5-dashboard.png)

### Result page
game results after time is up
![Alt Text](/assets/play-again.png)


## How to play?

Go to [squaresgamego](https://squaresgamego.herokuapp.com) and choose a nickname to get started!

- `Creating a game` - put players number you want in the game and Press "creat game" to generate a new game code, which you can share with your friends
- `Joining a game` - Enter the game code of an existing game and also take a name and color for youself then press `JOIN`
- `Waitng players` - You will be waitng the playes to join until the game players complet
- `Playing` - Try to take as many squares  as possible and make them under you control, and the others will doe the same thing to take the squares back
- `Winning` - You will be the winner if you got the biggest number of the squares
- `Player again` - After the time is finished , you will see the results card, and  you can click "play again" to play again

## Dev installation

### Using docker:
```shell
docker-compose up --build
```
Note: You need to have the desktop Docker app, download it from https://docs.docker.com/get-docker/

### install locally:

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

> Now you need to change the configeration slightly different(we will change them to use the storage and the ram Locally )

3 - Go to the `settings.py ` files and change `CHANNEL_LAYERS` and `CACHES` To


```
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
        "TIMEOUT": 300,
        "OPTIONS": {
            "MAX_ENTRIES": 1000,
        },
    }
}
```


4 - install the requirements file
```
pip install -r requirements.txt

```
5 - run the project by running
```
python manage.py runserver
```
6 - open this link on your browser `localhost:8000`.<br />
## Technologies used



- Django Channels for the backend, allowing it to communicate over both HTTP and WebSockets
- Javascript with Django template to communicate with WebSockets on the backend
- Redis as a Cache and as a layers for channels
- Docker as a main packaging system, which makes development OS-agnostic and simplified the setup process


<note>

**Note**: `If you would like to contribute to this project follow  [contribute](https://github.com/karamfarhan/channels-multi-player-simple-game/blob/main/CONTRIBUTING.md)

</note>



TO CONTACT ME SEND EMAIL ON forprokm@gmail.com
