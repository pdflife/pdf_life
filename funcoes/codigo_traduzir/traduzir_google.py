from deep_translator import GoogleTranslator

def traduzir_texto(texto):

    traduzido = GoogleTranslator(source="pt", target="en").translate(texto)

    if traduzido == None:
        return texto
    
    else:
        return traduzido
