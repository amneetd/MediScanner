# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from paddleocr import PaddleOCR,draw_ocr
from PIL import Image
import re
import os
import cv2
import logging
# ocr = PaddleOCR(lang='en') # need to run only once to download and load model into memory
logging.getLogger("ppocr").setLevel(logging.WARNING)
import numpy as np
import base64

initialize_app()


def preprocess_image(image_base64_representation):
    decoded_image = base64.b64decode(image_base64_representation)
    image_bytes_array = np.frombuffer(decoded_image, np.uint8)
    image = cv2.imdecode(image_bytes_array, cv2.IMREAD_COLOR)
    
    rotate90=cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    rotate180=cv2.rotate(image, cv2.ROTATE_180)
    rotate270=cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    image_collection=[image,rotate90,rotate180,rotate270]
    return image_collection


def extract_text(image):
    ocr = PaddleOCR(lang='en')
    number = "None"
    for im in image:
        result = ocr.ocr(im, cls=False)
    # Find the DIN number (this part requires some logic depending on the image)
    #  We'll assume DIN is always preceded by "DIN" and is numeric
        for idx in range(len(result)):
            res = result[idx]
            for line in res:
                if "DIN" in line[1][0] or "NPN" in line[1][0]:
                    number = line
                    break
    return number[1][0]




def process_test_images(received_image):
    received_image = received_image.split(",")[1]
    preprocessed_images = preprocess_image(received_image)
    extracted_text = extract_text(preprocessed_images)
    return extracted_text


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    )
)
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    print("\n\n")
    sent_image = req.get_json()["selectedFile"]
    the_extracted_identifier = process_test_images(sent_image)
    print(the_extracted_identifier)
    print("\n\n")
    return https_fn.Response(the_extracted_identifier)
