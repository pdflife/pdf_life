import fitz

def invertendo_pdf(arquivo):
    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf",pdf_bytes)
    lastPage = doc.page_count - 1
    for i in range(lastPage):
        doc.move_page(lastPage, i) 

    return doc
    doc.save('invertido.pdf')