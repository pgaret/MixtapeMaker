from main import db

class Video(db.Model):
    __tablename__ = 'videos'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120), unique = True, nullable = False)
    youtubeId = db.Column(db.String(120), unique = True, nullable = False)
    playlistId = db.Column(db.Integer, db.ForeignKey('playlists.id'))

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, id):
        def to_json(x):
            return {
                'id': x.id,
                'name': x.name,
                'youtubeId': x.youtubeId,
                'playlistId': x.playlistId
            }
        return {'video': to_json(cls.query.filter_by(id = id).first())}

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'id': x.id,
                'name': x.name,
                'youtubeId': x.youtubeId
                # 'playlistId': x.playlistId
            }
        return {'videos': list(map(lambda x: to_json(x), Video.query.all()))}

    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}
