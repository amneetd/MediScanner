from paddleocr import PaddleOCR,draw_ocr
from PIL import Image
import re
import os
import cv2
import logging
ocr = PaddleOCR(lang='en') # need to run only once to download and load model into memory
logging.getLogger("ppocr").setLevel(logging.WARNING)

DIN_PATTERN = r"DIN\d{8}\b"
NPN_PATTERN = r"NPN\d{8}\b"  
TEST_IMAGES_PATH = './photos'


def preprocess_image(image_path):
    image = cv2.imread(image_path)
    rotate90=cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    rotate180=cv2.rotate(image, cv2.ROTATE_180)
    rotate270=cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    image_collection=[image,rotate90,rotate180,rotate270]
    return image_collection



def extract_text(image):
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

def classify_text(text):
    text_nospace=text.replace(" ", "")
    print(text_nospace[ :11])
    din_match = re.search(DIN_PATTERN, text_nospace[ :11])
    npn_match = re.search(NPN_PATTERN, text_nospace[ :11])
    if din_match:
        return din_match.group()
    elif npn_match:
        return npn_match.group()
    else:
        return "None"








def process_test_images():
    y_true, y_pred = [], [] 
    for filename in os.listdir(TEST_IMAGES_PATH):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(TEST_IMAGES_PATH, filename)
            preprocessed_images = preprocess_image(image_path)
            extracted_text = extract_text(preprocessed_images)
            classification = classify_text(extracted_text)
            
            true_label = os.path.splitext(filename)[0]
            formatted_label = re.sub(r"(DIN|NPN)(\d{8})", r"\1 \2", true_label)
            
            y_true.append(formatted_label)
            y_pred.append(classification)
            print(f"File: {filename} | True: {formatted_label} | Predicted: {classification}")
    


    
if __name__ == "__main__":
    process_test_images()
