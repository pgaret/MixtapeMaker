from main import ma
from user_models import User
from playlist_models import Playlist
from video_models import Video

class VideoSchema(ma.ModelSchema):
    class Meta:
        model = Video

class PlaylistSchema(ma.ModelSchema):
    class Meta:
        model = Playlist
    videos = ma.Nested(VideoSchema, many=True)

class UserSchema(ma.ModelSchema):
    class Meta:
        model = User
        exclude = ("password",)
    playlists = ma.Nested(PlaylistSchema, many=True)
