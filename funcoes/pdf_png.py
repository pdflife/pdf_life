import fitz
import os
from flask import jsonify


def convertendo(arquivo, paginas):

    pdf_bytes= arquivo.read()
    doc = fitz.open("pdf", pdf_bytes)  
    l = []
    global progress
    progress = 0
    if paginas == 0:
        for pag in range(len(doc)):
            page = doc.load_page(pag)
            pix = page.get_pixmap()  
            l.append(pix)

    else:
        for pagina in paginas: 
            if 0 <= pagina < len(doc):  
                page = doc.load_page(pagina-1)
                pix = page.get_pixmap() 
                l.append(pix)

    nova_subpasta_path = os.path.join('uploads',  'pdf_life_imagens')

    if not os.path.exists(nova_subpasta_path):
        os.makedirs(nova_subpasta_path)

    for index, imagem in enumerate(l):
        caminho_imagem = os.path.join(nova_subpasta_path, f"page-{index + 1}.png")
        imagem.save(caminho_imagem)
        
        progress = str(int(((index) / len(doc)) * 100))

    return 'Success'