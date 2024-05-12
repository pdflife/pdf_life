import fitz

def inserir_pag_branco(arquivo, paginas):
    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf",pdf_bytes) 

    pagina = doc.load_page(0) 
    largura = pagina.rect.width  
    altura = pagina.rect.height  

    for pagina in paginas:
        if 0<=pagina <= len(doc):
            page = doc.new_page(pagina, 
                                width = largura, 
                                height = altura)
    
    return doc