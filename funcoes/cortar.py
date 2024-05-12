import fitz

def cortando(arquivo, de, ate):
    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf", pdf_bytes) 
    doc.delete_pages(from_page=(de-1), to_page=(ate-1)) 

    return doc