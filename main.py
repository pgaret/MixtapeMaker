import os
from flask import Flask, render_template, request, url_for, redirect, flash
import flask_login
import pdb
import json
import pymongo
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
import jwt
# import boto3
#
# s3 = boto3.resource('s3')

app = Flask(__name__)
app.secret_key = 'Qx%3Zv@y#m%8Ez@+wUFgH5_enQAgtX'

is_prod = os.environ.get('IS_HEROKU', None)

if is_prod:
    uri = 'mongodb://pgaret:Playlister2017@ds151289.mlab.com:51289/heroku_hpzk22fl'
else:
    uri = 'mongodb://localhost:27017/playlister'

client = MongoClient(uri)
db = client.get_default_database()

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(email):
    if db.users.find({'email': email}).count() == 0:
        return None
    user = User()
    user.id = email
    return user

def login_user(email):
    the_user = user_loader(email)
    if the_user:
        flask_login.login_user(the_user)
        if flask_login.current_user.is_active:
            return 'Good'
    return 'Bad'

@app.route("/")
def index():
    print("Index page")
    return render_template('index.html')

@app.route("/playlists", methods=['POST'])
def add_playlist():
    playlistName = json.loads(request.data.decode(encoding='UTF-8'))['playlistName']
    if db.playlists.find({'name': playlistName}).count() == 0:
        db.playlists.insert({'name': playlistName, 'users': [flask_login.current_user.id], 'videos': []})
        return dumps(db.playlists.find({}, {'_id':1}).limit(1).sort('_id', pymongo.DESCENDING))
    else:
        return redirect(url_for('index'), 205)

@app.route("/playlists/<playlist_id>", methods=['POST'])
def edit_playlist(playlist_id):
    videoId = json.loads(request.data.decode(encoding='UTF-8'))['videoId']
    videoName = json.loads(request.data.decode(encoding='UTF-8'))['videoName']
    if db.playlists.find({'_id': ObjectId(playlist_id)}).count() > 0:
        db.playlists.update(
            { '_id': ObjectId(playlist_id)},
            { '$push': { 'videos': {'name': videoName, 'ytId': videoId} } }
        )
        return dumps(db.playlists.find({'_id': ObjectId(playlist_id)}, {'videos': 1}))
    else:
        return redirect(url_for('index'), 205)

@app.route("/playlists/<playlist_id>/<video_name>", methods=['DELETE'])
def remove_video(playlist_id, video_name):
    if db.playlists.find({'_id': ObjectId(playlist_id)}).count() > 0:
        db.playlists.update(
            { '_id': ObjectId(playlist_id)},
            { '$pull': { 'videos': {'name': video_name}}}
        )
        return redirect(url_for('index'), 200)
    else:
        return redirect(url_for('index'), 205)

@app.route("/users", methods=['POST'])
def add_user():
    email = json.loads(request.data.decode(encoding='UTF-8'))['email']
    if db.users.find({'email': email}).count() == 0:
        password = json.loads(request.data.decode(encoding='UTF-8'))['password']
        password = jwt.encode({'password': password}, os.environ.get('SECRET', 'DEV'), algorithm='HS256')
        db.users.insert({'email': email, 'password': password})
        login_user(email)
        return redirect(url_for('index'), 200)
    else:
        return redirect(url_for('index'), 205)

@app.route("/sessions", methods=['POST'])
def create_session():
    email = json.loads(request.data.decode(encoding='UTF-8'))['email']
    password = jwt.encode({'password': json.loads(request.data.decode(encoding='UTF-8'))['password']}, os.environ.get('SECRET', 'DEV'), algorithm='HS256')
    if db.users.find({'email': email, 'password': password}).count() == 1:
        login_user(email)
        return dumps(db.playlists.find({'users': { '$all': [email]}}, {'name': 1, 'videos': 1, '_id': 1}))
    else:
        return redirect(url_for('index'), 205)

@app.route('/signout', methods=['POST', 'GET'])
def logout_user():
    flask_login.logout_user()
    return redirect(url_for('index'), 200)

@app.route('/protected')
@flask_login.login_required
def private_zone():
    return 'Logged in as: '+flask_login.current_user.id


if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
