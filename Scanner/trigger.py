from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/trigger', methods=['POST'])
def trigger_photos():
    try:
        # Assuming 'clientPi.py' is the script that sends the photos.
        # subprocess.run executes the script. Adjust the command if needed.
        subprocess.run(['python', 'clientPi.py'], check=True)
        return jsonify({'status': 'success', 'message': 'Photos sent.'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    # Make sure the server is accessible on your local network.
    app.run(host='0.0.0.0', port=5002)
