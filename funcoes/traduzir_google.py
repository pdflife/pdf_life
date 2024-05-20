from deep_translator import GoogleTranslator
import fitz


def traduzir_texto(texto, de, para):

    traduzido = GoogleTranslator(source=de, target=para).translate(texto)

    if traduzido == None:
        return texto
    else:
        return traduzido


def traduzindo_cod(arquivo, de, para):
    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf", pdf_bytes)
    doc_novo = fitz.open()
    n = 0
    global progress
    progress = 0
    for page in doc:
        nova_pagina = doc_novo._newPage(width=page.rect.width, height=page.rect.height)       

        if page.get_text("dict")["blocks"]==[]:
            new = doc.load_page(n)
            if new.get_images():
                a = new.get_image_info(xrefs=True)
                b=a[0]['xref']
                bbox = a[0]["bbox"]
        
                imagem = doc.extract_image(b)
                bytes_imagem = imagem['image']
                rect = fitz.Rect(bbox)
                nova_pagina.insert_image(rect, stream = bytes_imagem)


        else:
            for type in page.get_text("dict")["blocks"]:

                if type["type"] == 1:
                    # Obter os bytes da imagem
                    image_bytes = type["image"]
                    
                    ponto = fitz.Rect(type["bbox"])
                    nova_pagina.insert_image(ponto, stream = image_bytes)
                                
                elif type["type"] == 0:
                    for linhas in type["lines"]:
                        for span in linhas["spans"]:
                            fsize = span["size"]
                            origin = fitz.Point(span["origin"])
                            rect = fitz.Rect(span["bbox"]) 
                            flags = span["flags"]
                            fonte = "times-roman"
                            text = span["text"]
                            color = span["color"]
                            
                            traduzido  = traduzir_texto(text, de, para)
                            
                            nova_pagina.insert_text(origin, traduzido, fontname=fonte, fontsize=fsize )  


        n += 1
        progress = str(int((n*100)/len(doc)))
        
        
    
    return doc_novo