import fitz

def remover(arquivo, paginas):
    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf", pdf_bytes) 
    
    for pagina in paginas:
        if 0 <= pagina < len(doc):
            doc.delete_page(pagina - 1)
    
    return doc 

