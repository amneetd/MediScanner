from paddleocr import PaddleOCR
import re
import os
import cv2
import logging
import numpy as np


ocr = PaddleOCR(lang='en',use_angle_cls=True,use_dilation=True) 
logging.getLogger("ppocr").setLevel(logging.WARNING)


potential=[]
potential_confidence=[]

DIN_PATTERN =[ 
    r"DIN\d{8}\b",
    r"DIN:\d{8}\b",
    r".*?IN\d{8}\b",
    r"D.*?N\d{8}\b"]
NPN_PATTERN = [
    r"NPN\d{8}\b" , 
    r"PN\d{8}\b" , 
    r".*?NN\d{8}\b"  ]



def preprocess_image(image):
    #rotate
    rotate90=cv2.rotate( image, cv2.ROTATE_90_CLOCKWISE)
    rotate180=cv2.rotate( image, cv2.ROTATE_180)
    rotate270=cv2.rotate( image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    inverted = cv2.bitwise_not(gray)
    image_collection=[image,inverted,rotate90,rotate180,rotate270]
    return image_collection



def extract_text(image):
    options = []
    for im in image:
        result = ocr.ocr(im, cls=False)
        for idx in range(len(result)):
            res = result[idx]
            if res:
                for line in res:
                    options.append(line[1])
    return options

def classify_text(options):
    for op in options:
        text_nospace = op[0].replace(" ", "")
        sliced_text = text_nospace[:12]

        for pattern in DIN_PATTERN:
            din_match = re.search(pattern, sliced_text)
            if din_match:
                digits = re.search(r"\d{8}", din_match.group())
                potential.append(f"DIN{digits.group()}")
                potential_confidence.append(op[1])

        for pattern in NPN_PATTERN:
            npn_match = re.search(pattern, sliced_text)
            if npn_match:
                digits = re.search(r"\d{8}", npn_match.group())
                potential.append(f"NPN{digits.group()}")
                potential_confidence.append(op[1])



def confident_answer():
    number="None"
    if potential_confidence:
        max_index = potential_confidence.index(max(potential_confidence))
        number=potential[max_index]
    return number
    


def decode_image(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)    
    if image is None:
        raise ValueError("Could not decode image")

    return image


def process_image(imagebytes):
    for im in imagebytes:
        image=decode_image(im)
        preprocessed_images = preprocess_image(image)
        extracted_text = extract_text(preprocessed_images)
        classify_text(extracted_text)

    confidentanswer= confident_answer()
    potential_confidence.clear()
    potential.clear()
    return confidentanswer
            





