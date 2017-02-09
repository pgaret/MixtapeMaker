from flask import Flask, render_template, request, url_for, redirect, flash
import flask_login
import pdb
import json
# from './user.py' import User
import pymongo
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
import jwt

app = Flask(__name__)
app.secret_key = 'Qx%3Zv@y#m%8Ez@+wUFgH5_enQAgtX'
client = MongoClient()
login_manager = flask_login.LoginManager()

login_manager.init_app(app)
db = client.playlister

class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(email):
    if db.users.find({'email': email}).count() == 0:
        return
    user = User()
    user.id = email
    return user

@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if db.users.find({'email': email}).count() == 0:
        return
    user = User()
    user.id = email
    user.authenticated = True if db.users.find({'email': email, 'password': password}).count() == 1 else False
    return user

def login_user(email):
    the_user = user_loader(email)
    if the_user:
        flask_login.login_user(the_user)
        return 'Good'
    else:
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
    # pdb.set_trace()
    if db.playlists.find({'_id': ObjectId(playlist_id)}).count() > 0:
        db.playlists.update(
            { '_id': ObjectId(playlist_id)},
            { '$push': { 'videos': {'name': videoName, 'ytId': videoId} } }
        )
        return dumps(db.playlists.find({'_id': ObjectId(playlist_id)}, {'videos': 1}))
    else:
        return redirect(url_for('index'), 205)

@app.route("/users", methods=['POST'])
def add_user():
    email = json.loads(request.data.decode(encoding='UTF-8'))['email']
    if db.users.find({'email': email}).count() == 0:
        password = json.loads(request.data.decode(encoding='UTF-8'))['password']
        db.users.insert({'email': email, 'password': password})
        login_user(email)
        return redirect(url_for('index'), 200)
    else:
        return redirect(url_for('index'), 205)

@app.route("/sessions", methods=['POST'])
def create_session():
    email = json.loads(request.data.decode(encoding='UTF-8'))['email']
    password = json.loads(request.data.decode(encoding='UTF-8'))['password']
    valid = login_user(email)
    if valid == 'Good':
        playlists = db.playlists.find({'users': { '$all': [email]}}, {'name': 1, 'videos': 1, '_id': 1})
        return dumps(playlists)
    else:
        return redirect(url_for('index'), 205)

@app.route('/signout', methods=['POST', 'GET'])
def logout_user():
    flask_login.logout_user()
    return redirect('/')

@app.route('/protected')
@flask_login.login_required
def private_zone():
    return 'Logged in as: '+flask_login.current_user.id


if __name__ == '__main__':
    app.run(debug=True)
