import os
import base64
from flask import Flask, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/trigger', methods=['POST'])
def trigger_camera():
    try:
        # Run Camera.py from the Scanner folder
        subprocess.run(['python', 'Camera.py'], check=True)
        
        # After Camera.py has run, list and encode the captured images
        images_folder = "ScannedMedication"
        images_data = []
        
        # Loop through all image files in the folder (assuming .jpg, .jpeg, .png)
        for filename in os.listdir(images_folder):
            file_path = os.path.join(images_folder, filename)
            if os.path.isfile(file_path) and filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                with open(file_path, "rb") as image_file:
                    # Encode file contents to base64
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    images_data.append({
                        "filename": filename,
                        "data": encoded_string
                    })
        
        # Return the images as part of the JSON response
        return jsonify({'status': 'success', 'images': images_data}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
