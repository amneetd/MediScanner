
import cv2
import os
import re
import pytesseract
import numpy as np
import sklearn
from sklearn.metrics import accuracy_score, recall_score, roc_auc_score
# Define path
TEST_IMAGES_PATH = "./photos"
OUTPUT_RESULTS_PATH = "/"

# Regex patterns for DIN and NPN numbers
DIN_PATTERN = r"DIN\s*\b\d{8}\b"
NPN_PATTERN = r"NPN\s*\b\d{8}\b"  


# Preprocess the image
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    dilated = cv2.dilate(thresh, kernel, iterations=1)
    gaussian_blur = cv2.GaussianBlur(gray, (5, 5), 0)
    adaptive_thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY, 11, 2)
    equalized = cv2.equalizeHist(gray)
    normalized = gray / 255.0


    image_collection=[image,thresh,gray,dilated, gaussian_blur,adaptive_thresh ]
    #Todo: make copies of image preprocessed in different way, cycle through them



    return image_collection


def extract_text(image):
    config = '--psm 11  '
    number = "None"
    for im in image:
        text = pytesseract.image_to_string(im, lang='eng', config=config)
    # Find the DIN number (this part requires some logic depending on the image)
    #  We'll assume DIN is always preceded by "DIN" and is numeric

    #print(f"Extracted text: {text}")
        lines = text.splitlines()
        for line in lines:
            if "DIN" in line or "NPN" in line:
                number = line
                break



    return number

# Identify DIN, NPN, or None
def classify_text(text):
    din_match = re.search(DIN_PATTERN, text)
    npn_match = re.search(NPN_PATTERN, text)

    if din_match:
        return din_match.group()
    elif npn_match:
        return npn_match.group()
    else:
        return "None"

# Process all test images
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
    
    # Convert labels into binary format for AUC calculation
    binary_y_true = [1 if label.startswith("DIN") or label.startswith("NPN") else 0 for label in y_true]
    binary_y_pred = [1 if label.startswith("DIN") or label.startswith("NPN") else 0 for label in y_pred]
    
    accuracy = accuracy_score(y_true, y_pred)
    sensitivity = recall_score(binary_y_true, binary_y_pred, zero_division=1)
    auc_score = roc_auc_score(binary_y_true, binary_y_pred)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Sensitivity (Recall): {sensitivity:.4f}")
    print(f"AUC Score: {auc_score:.4f}")

    # Save results
    #save_results(results)

# Save results to a file
#def save_results(results):
   # os.makedirs(OUTPUT_RESULTS_PATH, exist_ok=True)
    #results_file = os.path.join(OUTPUT_RESULTS_PATH, "results.csv")
    
    #with open(results_file, "w") as f:
     #   f.write("Filename,True_Label,Predicted_Label\n")
      #  for result in results:
       #     f.write(",".join(result) + "\n")
    #print(f"Results saved to {results_file}")

if __name__ == "__main__":
    process_test_images()




























