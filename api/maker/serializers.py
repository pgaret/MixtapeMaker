from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.serializers import PrimaryKeyRelatedField
from maker.models import Playlist, User, Video
import pdb

class PlaylistSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        playlist = Playlist.objects.create(name=validated_data['name'])
        self.context['request'].user.user.playlists.add(playlist)
        return playlist

    class Meta:
        model = Playlist
        fields = '__all__'

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class VideoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
