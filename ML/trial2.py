import easyocr
import cv2
reader = easyocr.Reader(['en']) # this needs to run only once to load the model into memory
image = cv2.imread('./photos/DIN02360837.png')
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 170, 255, cv2.THRESH_BINARY)
result = reader.readtext(thresh,detail = 0)
print(result)