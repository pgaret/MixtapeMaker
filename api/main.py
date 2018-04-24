# import os
# from flask import Flask, render_template, request, url_for, redirect, flash
# from flask_restful import Api
# import flask_login
# import pdb
# import json
# import pymongo
# import requests
# from pymongo import MongoClient
# from bson.json_util import dumps
# from bson.objectid import ObjectId
# import jwt
# import views, models, resources
#
# app = Flask(__name__)
# api = Api(app)

from flask import Flask, request, jsonify
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
from flask_jwt_extended import JWTManager
import logging
app = Flask(__name__)
CORS(app)


app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'some-secret-string'
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

api = Api(app)
jwt = JWTManager(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

@app.before_first_request
def create_tables():
    db.create_all()

association_table = db.Table('association', db.Model.metadata,
    db.Column('playlists_id', db.Integer, db.ForeignKey('playlists.id')),
    db.Column('users_id', db.Integer, db.ForeignKey('users.id'))
)

import views
import user_models, user_resources
import playlist_models, playlist_resources
import video_models, video_resources

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return user_models.RevokedToken.is_jti_blacklisted(jti)

api.add_resource(user_resources.UserSignUp, '/signup')
api.add_resource(user_resources.UserSignIn, '/signin')
api.add_resource(user_resources.UserLogoutAccess, '/logout/access')
api.add_resource(user_resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(user_resources.TokenRefresh, '/token/refresh')

api.add_resource(user_resources.AllUsers, '/users')
api.add_resource(user_resources.GetUser, '/users/<int:user_id>')
api.add_resource(user_resources.CurrentUser, '/user')

api.add_resource(user_resources.SecretResource, '/secret')

api.add_resource(playlist_resources.NewPlaylist, '/playlists')
api.add_resource(playlist_resources.AllPlaylists, '/playlists')
api.add_resource(playlist_resources.GetPlaylist, '/playlists/<int:playlist_id>')

api.add_resource(video_resources.NewVideo, '/videos')
api.add_resource(video_resources.AllVideos, '/videos')
api.add_resource(video_resources.GetVideo, '/videos/<int:user_id>')


# app.secret_key = 'Qx%3Zv@y#m%8Ez@+wUFgH5_enQAgtX'
#
# is_prod = os.environ.get('IS_HEROKU', None)
#
# if is_prod:
#     uri = 'mongodb://pgaret:Playlister2017@ds151289.mlab.com:51289/heroku_hpzk22fl'
# else:
#     uri = 'mongodb://localhost:27017/playlister'
#
# client = MongoClient(uri)
# db = client.get_default_database()
#
# login_manager = flask_login.LoginManager()
# login_manager.init_app(app)
#
# class User(flask_login.UserMixin):
#     pass
#
# @login_manager.user_loader
# def user_loader(email):
#     print(email)
#     if db.users.find({'email': email}).count() == 0:
#         return None
#     user = User()
#     user.id = email
#     return user
#
# def login_user(email):
#     the_user = user_loader(email)
#     if the_user:
#         flask_login.login_user(the_user)
#         if flask_login.current_user.is_active:
#             return 'Good'
#     return 'Bad'
#
# @app.route("/")
# def index():
#     print("Index page")
#     return {'hello': 'world'}
#
# @app.route("/youtube?videoName=<video_name>")
# def search_youtube(video_name=""):
#     API_KEY= 'AIzaSyDCpSBcCWvzr4mqRS5b6LwYFwD6C9Nx_z4'
#     requestStr = "https://www.googleapis.com/youtube/v3/search?q="+video_name+"&part=snippet&key="+API_KEY+"&type=video"
#     r = requests.get(requestStr)
#     return {'results': r.json()}
#
# @app.route("/setlists/artists/<artist_name>", methods=['GET'])
# def search_setlist_artist(artist_name):
#     headers = {'x-api-key': 'cebc3a4b-f2ba-495c-ad3f-0d503f88a747', 'Accept': 'application/json'}
#     requestStr = 'https://api.setlist.fm/rest/1.0/search/artists?artistName='+artist_name
#     print(requestStr)
#     r = requests.get(requestStr, headers=headers)
#     return {'results': r.json()}
#
#
# @app.route("/playlists", methods=['GET'])
# @app.route("/playlists/<user_id>", methods=['GET'])
# @set_renderers(BrowsableAPIRenderer)
# def get_playlists(user_id=None):
#     print(flask_login.current_user)
#     if (user_id):
#         return dumps(db.playlists.find())
#     else:
#         return dumps(db.playlists.find())
#
# @app.route("/playlists", methods=['POST'])
# def add_playlist():
#     playlistName = request.data['name']
#     if db.playlists.find({'name': playlistName}).count() == 0:
#         id = db.users.find({'email': flask_login.current_user.id}, {'_id': 1}).next()['_id']
#         db.playlists.insert({'name': playlistName, 'users': [id], 'videos': []})
#         return dumps(db.playlists.find().limit(1).sort('_id', pymongo.DESCENDING))
#     else:
#         return {"Error": "This playlist name is already taken"}
#
# @app.route('/playlists/search/')
# @app.route('/playlists/search/<key>', methods=['GET'])
# def find_playlist(key=None):
#     if key:
#         videos = db.playlists.find({'$and': [{'name': { '$regex': key }}, {'users':{'$ne': flask_login.current_user.id}}]}, {'_id': 1, 'name': 1, 'videos': 1, 'users': 1})
#     else:
#         videos = db.playlists.find({'users':{'$ne': flask_login.current_user.id}}, {'_id': 1, 'name': 1, 'videos': 1, 'users': 1})
#     return dumps(videos)
#
# @app.route('/playlists/<pl_id>/<user_id>', methods=['PUTS'])
# def add_user_to_pl(pl_id, user_id):
#     if db.playlists.find({'_id': ObjectId(pl_id)}).count() > 0:
#         email = db.users.find({'_id': ObjectId(user_id)}).next()['email']
#         db.playlists.update(
#             { '_id': ObjectId(pl_id)},
#             { '$push': { 'users': email } }
#         )
#         return dumps(db.playlists.find({'_id': ObjectId(pl_id)}))
#     else:
#         return redirect(url_for('index'), 205)
#
# @app.route("/playlists/<playlist_id>", methods=['POST'])
# def edit_playlist(playlist_id):
#     videoId = request.data['videoId']
#     videoName = request.data['videoName']
#     if db.playlists.find({'_id': ObjectId(playlist_id)}).count() > 0:
#         db.playlists.update(
#             { '_id': ObjectId(playlist_id)},
#             { '$push': { 'videos': {'name': videoName, 'ytId': videoId} } }
#         )
#         return dumps(db.playlists.find({'_id': ObjectId(playlist_id)}, {'videos': 1}))
#     else:
#         return redirect(url_for('index'), 205)
#
# @app.route("/playlists/<playlist_id>/<video_name>", methods=['DELETE'])
# def remove_video(playlist_id, video_name):
#     if db.playlists.find({'_id': ObjectId(playlist_id)}).count() > 0:
#         db.playlists.update(
#             { '_id': ObjectId(playlist_id)},
#             { '$pull': { 'videos': {'name': video_name}}}
#         )
#         return redirect(url_for('index'), 200)
#     else:
#         return redirect(url_for('index'), 205)
#
# @app.route("/users", methods=['GET'])
# def get_users():
#     return dumps(db.users.find({}, {"_id": 1, "email": 1}))
#
# @app.route("/users", methods=['POST'])
# def add_user():
#     email = request.data['email']
#     if db.users.find({'email': email}).count() == 0:
#         password = request.data['password']
#         if is_prod or not is_prod:
#             password = jwt.encode({'password': password}, os.environ.get('SECRET', 'DEV'), algorithm='HS256')
#         db.users.insert({'email': email, 'password': password})
#         login_user(email)
#         return dumps(db.users.find({'email': email}, {"_id": 1, "email": 1}))
#     else:
#         return {"Error": "Email already taken"}
#
# @app.route("/sessions", methods=['POST'])
# def create_session():
#     email = request.data['email']
#     if db.users.find({'email': email}).count() == 1:
#         password = request.data['password']
#         db_pw = db.users.find({'email': email}).next()['password']
#         if is_prod or not is_prod:
#             db_pw = jwt.decode(db_pw, os.environ.get('SECRET', 'DEV'), algorithm='HS256')['password']
#         if db_pw == password:
#             login_user(email)
#             return dumps(db.users.find({'email': email}, {'_id': 1, 'email': 1}))
#     return {"Error": "That user does not exist in the system"}
#
# @app.route('/signout', methods=['POST', 'GET'])
# def logout_user():
#     flask_login.logout_user()
#     return redirect(url_for('index'), 200)
#
# @app.route('/protected')
# @flask_login.login_required
# def private_zone():
#     return 'Logged in as: '+flask_login.current_user.id

#
# if __name__ == '__main__':
#     app.debug = True
#     port = int(os.environ.get("PORT", 5000))
#     api.run(host='0.0.0.0', port=port)
