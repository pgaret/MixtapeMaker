from django.shortcuts import render
from rest_framework import viewsets
from maker.models import User, Playlist, Video
from maker.serializers import UserSerializer, VideoSerializer, PlaylistSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class = UserSerializer

class VideoViewSet(viewsets.ModelViewSet):
    queryset=Video.objects.all()
    serializer_class = VideoSerializer

class PlaylistViewSet(viewsets.ModelViewSet):
    queryset=Playlist.objects.all()
    serializer_class = PlaylistSerializer
