from deep_translator import GoogleTranslator

def traduzir_texto(texto, de, para):

    traduzido = GoogleTranslator(source=de, target=para).translate(texto)

    if traduzido == None:
        return texto
    else:
        return traduzido
