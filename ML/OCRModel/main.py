from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from ocr import process_image  # Your OCR processing function

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/ocr/")
async def get_ocr_result(file: List[UploadFile] = File(...)):
    try:
        imagesbytes_list = []
        for fil in file:
            imagesbytes_list.append(await fil.read())
        result = process_image(imagesbytes_list)
        # Return a JSON response including the CORS header
        return JSONResponse(
            content={"code": result},
            headers={"Access-Control-Allow-Origin": "*"}
        )
    except Exception as e:
        # Log the exception if needed, then return an error with CORS header
        return JSONResponse(
            content={"error": str(e)},
            status_code=500,
            headers={"Access-Control-Allow-Origin": "*"}
        )