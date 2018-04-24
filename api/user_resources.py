from flask import jsonify
from flask_restful import Resource, reqparse
from user_models import User, RevokedToken
from schemas import UserSchema
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

parser = reqparse.RequestParser()
parser.add_argument('email', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)

class UserSignUp(Resource):
    def post(self):
        data = parser.parse_args()
        if User.find_by_email(data['email']):
            return {'message': 'User {} already exists'. format(data['email'])}
        new_user = User(
            email = data['email'],
            username = data['username'],
            password = User.generate_hash(data['password'])
        )
        try:
            new_user.save_to_db()
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': User.find_by_email(data['email']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        except:
            return {'message': 'Something went wrong'}, 500


class UserSignIn(Resource):
    def post(self):
        data = parser.parse_args()
        current_user = User.query.filter_by(email = data['email']).first()
        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['email'])}
        if User.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity = data['email'])
            refresh_token = create_refresh_token(identity = data['email'])
            return {
                'message': 'Loggedin as {}'.format(current_user.email),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            return {'message': 'Wrong credentials'}


class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedToken(jti = jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedToken(jti = jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}


class GetUser(Resource):
    def get(self, user_id):
        return User.find_by_id(user_id)

class CurrentUser(Resource):
    @jwt_required
    def get(self):
        return UserSchema(only=("id",), many=True).dump(User.query.filter_by(email = get_jwt_identity()))

class AllUsers(Resource):
    def get(self):
        return UserSchema(many=True).dump(User.query.all())

    def delete(self):
        return User.delete_all()


class SecretResource(Resource):
    @jwt_required
    def get(self):
        return {
            'answer': 42
        }
