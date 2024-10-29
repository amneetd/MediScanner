import cv2
import pytesseract

# Path to your image
image_path = "./images/pill_bottle2.jpg"

# Load the image
img = cv2.imread(image_path)

# Convert to grayscale (optional, but often improves OCR accuracy)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Apply thresholding (optional, helps with text extraction)
thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# Perform OCR using Tesseract
text = pytesseract.image_to_string(thresh)

# Find the DIN number (this part requires some logic depending on the image)
#  We'll assume DIN is always preceded by "DIN" and is numeric
din_number = None
lines = text.splitlines()
for line in lines:
    if "DIN" in line:
        parts = line.split()
        for part in parts:
            if part.isdigit():
                din_number = part
                break
    if din_number:
        break


# Print the result
if din_number:
    print(f"DIN Number found: {din_number}")
else:
    print("DIN Number not found.")

print(lines)
# Optionally display the processed image (for debugging)
cv2.imshow("Processed Image", thresh)
cv2.waitKey(0)
cv2.destroyAllWindows()