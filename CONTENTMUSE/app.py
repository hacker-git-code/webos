from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        file = request.files['file']
        platform = request.form.get('platform')
        style = request.form.get('style')
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Placeholder for API processing
            # In production, this would call OpenAI/Replicate APIs
            processed_result = {
                'caption': f"Sample caption for {platform} in {style} style",
                'hashtags': ['#contentmuse', '#ai', '#socialmedia'],
                'original_url': f'uploads/{filename}',
                'processed_url': f'uploads/{filename}',  # Placeholder
                'suggested_time': '6PM'
            }
            
            return render_template('results.html', result=processed_result)
    
    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)