import fitz  

def extract_images_from_pdf(arquivo):

    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf",pdf_bytes)
    imagens =[]

    for page_number in range(len(doc)):
        page = doc.load_page(page_number)  
        image_list = page.get_images()
    
    for img in image_list:
        image_bytes = doc.extract_image(img[0])
        imagens.append(image_bytes["image"])

    return imagens

