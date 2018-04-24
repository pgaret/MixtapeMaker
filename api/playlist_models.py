from main import db, ma, relationship, association_table
from user_models import User

class Playlist(db.Model):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120), unique = True, nullable = False)
    users = relationship("User", secondary=association_table, backref="playlists", lazy="joined")
    videos = db.relationship("Video", backref="playlist", lazy='joined')

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, id):
        def to_json(x):
            return {
                'id': x.id,
                'name': x.name,
                'videos': x.videos
            }
        return {'playlist': to_json(cls.query.filter_by(id = id).first())}

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'id': x.id,
                'name': x.name,
                # 'videos': x.videos
            }
        return {'playlists': list(map(lambda x: to_json(x), Playlist.query.all()))}

    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}
