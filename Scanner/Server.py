from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Set up the destination directory relative to this script's location.
# This will resolve to one level up from the current directory, then ML/photos.
upload_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../ML/photos-test')
os.makedirs(upload_folder, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the file is in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Save the file in the specified directory with its original filename.
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    return jsonify({"status": "success", "filename": file.filename}), 200

if __name__ == '__main__':
    # Listen on all interfaces so the Pi can reach the server.
    app.run(host='0.0.0.0', port=5001)
