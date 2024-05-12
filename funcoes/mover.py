import fitz

def mover_paginas(arquivo, movimentos):
    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf",pdf_bytes)  
    for movimento in movimentos:
        origem, destino = movimento
        if 0 <= origem < len(doc) and 0 <= destino < len(doc):  
            doc.move_page(origem, destino)  
        else:
            continue

    return doc
