import fitz

def convertendo(arquivo, paginas):

    pdf_bytes= arquivo.read()
    doc = fitz.open("pdf", pdf_bytes)  
    l = []
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

    return l