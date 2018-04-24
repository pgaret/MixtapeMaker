from main import request
from flask_restful import Resource, reqparse
from video_models import Video
from schemas import VideoSchema
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

parser = reqparse.RequestParser()
parser.add_argument('name', help = 'This field cannot be blank', required = True)
parser.add_argument('youtubeId', help = 'This field cannot be blank', required = True)

class NewVideo(Resource):
    def post(self):
        data = parser.parse_args()
        new_pl = Video(
            name = data['name'],
            youtubeId = data['youtubeId'],
            playlistId = data['playlistId']
        )
        try:
            new_pl.save_to_db()
            return {'message': 'Video {} was created'.format(data['name'])}
        except:
            return {'message': 'Something went wrong'}, 500

class GetVideo(Resource):
    def get(self):
        print(request.args)
        video = Video.find_by_id(id = request.args.get('id'))

class AllVideos(Resource):
    def get(self):
        return VideoSchema(many=True).dump(Video.query.all())

    def delete(self):
        return Video.delete_all()
