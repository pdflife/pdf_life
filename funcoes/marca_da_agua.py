import fitz
from PIL import Image

def marcando_agua(pdf, imagem):
    pdf_bytes = pdf.read()
    doc = fitz.open("pdf",pdf_bytes) 
    img_bytes = imagem.read()

    for page_index in range(len(doc)): 
        page = doc[page_index] 

        page.insert_image(page.bound(),stream=img_bytes, overlay=False)

    return doc