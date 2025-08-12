from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
import jwt
from dotenv import load_dotenv
from functools import wraps

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///webos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
socketio = SocketIO(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    google_id = db.Column(db.String(100), unique=True)
    files = db.relationship('File', backref='owner', lazy=True)
    settings = db.relationship('UserSettings', backref='user', uselist=False)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(255), nullable=False)
    size = db.Column(db.Integer)
    type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class UserSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dark_mode = db.Column(db.Boolean, default=False)
    wallpaper = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('desktop'))
    return redirect(url_for('login'))

@app.route('/login')
def login():
    if current_user.is_authenticated:
        return redirect(url_for('desktop'))
    return render_template('login.html')

@app.route('/desktop')
@login_required
def desktop():
    return render_template('desktop.html')

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data or 'securityCode' not in data:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
            
        # Verify security code
        if data['securityCode'] != '12345':
            return jsonify({'status': 'error', 'message': 'Invalid security code'}), 401

        user = User.query.filter_by(username=data['username']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            login_user(user)
            return jsonify({'status': 'success', 'token': generate_token(user)})
        
        return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/auth/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'status': 'success'})

@app.route('/api/auth/check-status')
def check_login_status():
    return jsonify({'authenticated': current_user.is_authenticated})

@app.route('/api/files', methods=['GET'])
@login_required
def get_files():
    files = File.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': f.id,
        'filename': f.filename,
        'path': f.path,
        'size': f.size,
        'type': f.type,
        'created_at': f.created_at.isoformat()
    } for f in files])

@app.route('/api/files/upload', methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No file selected'}), 400
    
    # Save file and create database entry
    # This is a placeholder - implement actual file saving logic
    return jsonify({'status': 'success', 'message': 'File uploaded successfully'})

# WebSocket Events
@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        emit('status', {'message': 'Connected'})

@socketio.on('notification')
def handle_notification(data):
    emit('notification', data, broadcast=True)

# Helper Functions
def generate_token(user):
    return jwt.encode(
        {'user_id': user.id, 'exp': datetime.utcnow().timestamp() + 3600},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, port=5002)