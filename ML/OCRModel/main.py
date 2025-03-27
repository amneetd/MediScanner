from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ocr import process_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/ocr/")
async def get_ocr_result(file: UploadFile = File(...)):
    contents = await file.read()
    result = process_image(contents)
    return {"code": result}