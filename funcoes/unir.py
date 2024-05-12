import fitz

def unindo_pdf(arquivo_1, arquivo_2):
    pdf_bytes_one = arquivo_1.read()
    doc_a = fitz.open('pdf', pdf_bytes_one)
    
    pdf_bytes_two = arquivo_2.read()
    doc_b = fitz.open('pdf', pdf_bytes_two)

    doc_a.insert_pdf(doc_b) 

    return doc_a