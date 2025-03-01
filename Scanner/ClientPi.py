import os
import requests

# Folder containing the images to send
folder_path = "ScannedPhotos"

# URL for the server's upload endpoint; make sure the port and route match the server.
server_url = 'http://192.168.4.240:5001/upload'

# List only common image file types; adjust as needed.
image_extensions = ('.jpg', '.jpeg', '.png')

# Get list of image files in the folder
files_list = [f for f in os.listdir(folder_path) if f.lower().endswith(image_extensions)]

if not files_list:
    print("No image files found in", folder_path)
else:
    for filename in files_list:
        file_path = os.path.join(folder_path, filename)
        print("Sending", filename, "...")
        with open(file_path, 'rb') as f:
            # Send the file as form-data with key 'file'
            files = {'file': (filename, f, 'multipart/form-data')}
            try:
                response = requests.post(server_url, files=files)
                print(f"Server responded for {filename}:", response.json())
            except Exception as e:
                print("Error sending", filename, ":", e)
