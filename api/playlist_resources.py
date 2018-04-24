from main import request
from flask_restful import Resource, reqparse
from playlist_models import Playlist
from user_models import User
from schemas import PlaylistSchema, UserSchema
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

parser = reqparse.RequestParser()
parser.add_argument('name', help = 'This field cannot be blank', required = True)

class NewPlaylist(Resource):
    @jwt_required
    def post(self):
        data = parser.parse_args()
        current_user = get_jwt_identity()
        new_pl = Playlist(
            name = data['name'],
            users = [User.query.filter_by(email = get_jwt_identity()).first()]
            )
        try:
            new_pl.save_to_db()
            return {'message': 'Playlist {} was created'.format(data['name'])}
        except:
            return {'message': 'Something went wrong'}, 500

class GetPlaylist(Resource):
    def get(self, playlist_id):
        return Playlist.find_by_id(playlist_id)

class AllPlaylists(Resource):
    def get(self):
        return PlaylistSchema(many=True).dump(Playlist.query.all())

    def delete(self):
        return Playlist.delete_all()
