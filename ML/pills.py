
import cv2
import os
import re
import pytesseract
import numpy as np
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


    #Todo: make copies of image preprocessed in different way, cycle through them



    return dilated

# Extract text using TesseractOCR
def extract_text(image):
    config = '--psm 11  '
    text = pytesseract.image_to_string(image, lang='eng', config=config)
    # Find the DIN number (this part requires some logic depending on the image)
    #  We'll assume DIN is always preceded by "DIN" and is numeric
    number = "None"
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
    results = []
    for filename in os.listdir(TEST_IMAGES_PATH):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(TEST_IMAGES_PATH, filename)
            preprocessed_image = preprocess_image(image_path)
            extracted_text = extract_text(preprocessed_image)
            #print(f"Extracted text: {extracted_text}")
            classification = classify_text(extracted_text)

            # Append results
            true_label = os.path.splitext(filename)[0]  # True label is the file name without extension
            formatted_label = re.sub(r"(NPN)(\d{8})", r"\1 \2", true_label) 
            results.append((filename, formatted_label, classification))

            # Print for debugging
            print(f"File: {filename} | True: {formatted_label} | Predicted: {classification}")

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




























