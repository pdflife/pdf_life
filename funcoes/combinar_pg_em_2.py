import fitz

def combinar_em_2(arquivo):

    pdf_bytes = arquivo.read()
    src = fitz.open("pdf",pdf_bytes)
    doc = fitz.open()  # empty output PDF

    width = 842  # A4 landscape width
    height = 595  # A4 landscape height
    r = fitz.Rect(0, 0, width, height)

    # define the 4 rectangles per page
    # Define os 2 retângulos por página
    r1 = fitz.Rect(0, 0, width / 2, height)  # retângulo esquerdo
    r2 = fitz.Rect(width / 2, 0, width, height)  # retângulo direito

    #r3 = r1 + (0, r1.height, 0, r1.height)  # bottom left
    #r4 = fitz.Rect(r1.br, r.br)  # bottom right

    # put them in a list
    r_tab = [r1, r2]

    # now copy input pages to output
    for spage in src:
        if spage.number % 2 == 0:  # create new output page
            page = doc.new_page(-1,
                        width = width,
                        height = height)
        # insert input page into the correct rectangle
        page.show_pdf_page(r_tab[spage.number % 2],  # select output rect
                        src,  # input document
                        spage.number)  # input page number

    # by all means, save new file using garbage collection and compression
    return doc