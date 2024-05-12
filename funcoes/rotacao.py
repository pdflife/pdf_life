import fitz

def rotacao(pdf_file, paginas, angulo):
    pdf_bytes = pdf_file.read()    
    doc = fitz.open("pdf", pdf_bytes)

    if paginas == 0:
        for pag in range(len(doc)):
            pag = doc[pag]
            pag.set_rotation(angulo)
    else:
        for pag in paginas:
            if 0<= pag <= len(doc):
                page = doc[pag-1]  
                page.set_rotation(angulo)  

    return doc