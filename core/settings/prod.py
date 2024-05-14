from .base import *

# TODO: when setting DEBUG to False (as it should be when production) the server crashes,should fix it
# Making DEBUG False in prodcutnon
DEBUG = True
# SECURITY WARNING: don't run with debug turned on in production!
ALLOWED_HOSTS = ["squaresgamego.herokuapp.com", "squaresggame-production.up.railway.app"]
# ADDing additional middlewares for production
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
# Setting redis config
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [os.environ.get("REDIS_URL", "redis://localhost:6379")],
        },
    },
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": [os.environ.get("REDIS_URL", "redis://localhost:6379")],
        "TIMEOUT": 300,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "MAX_ENTRIES": 1000,
        },
    }
}
# Setting the static config for production
STATIC_ROOT = os.path.join(BASE_DIR, "static")
# STATICFILES_DIRS = []

# Setting up whitenoise and csrf config
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
CSRF_TRUSTED_ORIGINS = ["https://squaresgamego.herokuapp.com", "https://squaresggame-production.up.railway.app"]
