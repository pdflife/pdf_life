import fitz

def extraindo(arquivo, paginas):

    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf", pdf_bytes) 

    for pagina in paginas:
        if 0 <= pagina < len(doc):
            continue
        else:
            paginas.remove(pagina)

    doc.select(paginas)

    return doc
    

