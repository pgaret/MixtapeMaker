from django.db import models
from django.contrib.auth.models import User

class Video(models.Model):
    youtubeID = models.CharField(max_length=100)
    name = models.CharField(max_length=100)

class Playlist(models.Model):
    name = models.CharField(max_length=100)
    videos = models.ManyToManyField(Video, related_name="videos", blank="true")

class User(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, parent_link="true")
    name = models.CharField(max_length=100)
    playlists = models.ManyToManyField(Playlist, related_name="playlists", blank="true")
