from flask import Flask, send_from_directory, request, jsonify, session
from flask_socketio import SocketIO
import os
from functools import wraps

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.secret_key = 'your-secret-key-here'  # Required for session management
socketio = SocketIO(app)

# Simple user database
USERS = {
    'admin': {
        'password': 'admin',
        'name': 'Administrator'
    }
}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Serve application files
@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory('assets', path)

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username in USERS and USERS[username]['password'] == password:
        session['username'] = username
        return jsonify({'success': True, 'name': USERS[username]['name']})
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

# Logout endpoint
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'success': True})

# Check login status
@app.route('/api/check-login', methods=['GET'])
def check_login():
    if 'username' in session:
        username = session['username']
        return jsonify({'logged_in': True, 'username': username, 'name': USERS[username]['name']})
    return jsonify({'logged_in': False})

# Serve main application
@app.route('/')
def serve_app():
    return send_from_directory('templates', 'index.html')

if __name__ == '__main__':
    # Create necessary directories if they don't exist
    os.makedirs('static', exist_ok=True)
    os.makedirs('assets', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    # Run the server on port 5001
    socketio.run(app, debug=True, port=5001) 