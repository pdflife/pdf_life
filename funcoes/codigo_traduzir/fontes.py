def font(font):

    fontes = {
    'courier': 'Courier',
    'courier-oblique': 'Courier-Oblique',
    'courier-bold': 'Courier-Bold',
    'courier-boldoblique': 'Courier-BoldOblique',
    'helvetica': 'Helvetica',
    'helvetica-oblique': 'Helvetica-Oblique',
    'helvetica-bold': 'Helvetica-Bold',
    'helvetica-boldoblique': 'Helvetica-BoldOblique',
    'times-roman': 'Times-Roman',
    'times-italic': 'Times-Italic',
    'times-bold': 'Times-Bold',
    'times-bolditalic': 'Times-BoldItalic',
    'symbol': 'Symbol',
    'zapfdingbats': 'ZapfDingbats',
    'helv': 'Helvetica',
    'heit': 'Helvetica-Oblique',
    'hebo': 'Helvetica-Bold',
    'hebi': 'Helvetica-BoldOblique',
    'cour': 'Courier',
    'coit': 'Courier-Oblique',
    'cobo': 'Courier-Bold',
    'cobi': 'Courier-BoldOblique',
    'tiro': 'Times-Roman',
    'tibo': 'Times-Bold',
    'tiit': 'Times-Italic',
    'tibi': 'Times-BoldItalic',
    'symb': 'Symbol',
    'zadb': 'ZapfDingbats'
    }


    for chaves, items in fontes.items():
        if font == items:
            return chaves
        else:
            return "helv"