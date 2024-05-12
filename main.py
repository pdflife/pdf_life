from flask import Flask, request, render_template, send_file, jsonify
import os
import time
import fitz
import shutil
import threading
from zipfile import ZipFile

from funcoes.traduzir_google import traduzir_texto
from funcoes.rotacao import rotacao
from funcoes.remover import remover
from funcoes.cortar import cortando
from funcoes.pdf_png import convertendo
from funcoes.extrair import extraindo
from funcoes.inverter import invertendo_pdf
from funcoes.combinar_pg_em_2 import combinar_em_2
from funcoes.adicionar_pg_branca import inserir_pag_branco
from funcoes.mover import mover_paginas
from funcoes.marca_da_agua import marcando_agua
from funcoes.extrair_imagens import extract_images_from_pdf
from funcoes.unir import unindo_pdf

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

global progress
progress = 0

def delete_file(filename):
    time.sleep(100) 
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        if os.path.isfile(filepath):
            os.remove(filepath)
        elif os.path.isdir(filepath):
            shutil.rmtree(filepath)

    except Exception as e:
        return e

@app.route('/')
def index():
    return render_template('main.html')


@app.route('/progresso', methods=['GET'])
def progresso():

    # Aqui você pode gerar o progresso da sua tarefa
    progresso = progress

    # Retorna o progresso como JSON
    return jsonify({'progresso': progresso})


@app.route('/traduzir')
def traduzir_html():
    return render_template('funcoes/traduzir.html')

@app.route('/teste')
def teste():
    return render_template('teste.html')

@app.route('/traduzindo', methods=['POST'])
def traduzindo():
    arquivo = request.files['file']
    de = request.form['De']
    para = request.form['Para']
    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf", pdf_bytes)
    doc_novo = fitz.open()
    n = 0
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
        global progress
        progress = str(int((n*100)/len(doc)))
        progresso()

    nome_arquivo = "traduzido.pdf"

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc_novo.save(caminho_arquivo)  

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()
    
    return 'Success'
    

@app.route('/rotacionar')
def rotacionar():
    return render_template('funcoes/rotacionar.html')
@app.route('/rotacionando', methods=['POST'])
def rotacionado():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']
    paginas = request.form['paginas']
    angulo = int(request.form['angulo'])
    todo_doc = int(request.form['todo_doc'])

    if (todo_doc == 0):
        doc = rotacao(arquivo, todo_doc, angulo)
    else:
        paginas_lista_str = paginas.split(',')
        paginas_lista_int = [int(numero_str) for numero_str in paginas_lista_str]

        doc = rotacao(arquivo, paginas_lista_int, angulo)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)  

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()
    
    return 'Success'

@app.route('/remover')
def remov():
    return render_template('funcoes/remover.html')
@app.route('/removendo', methods=['POST'])
def removendo():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']
    paginas = request.form['paginas']
    paginas_lista_str = paginas.split(',')
    paginas_lista_int = [int(numero_str) for numero_str in paginas_lista_str]

    pdf_bytes = arquivo.read()
    doc = fitz.open("pdf", pdf_bytes) 
    
    for pagina in paginas_lista_int:
        if 0 <= pagina < len(doc):
            doc.delete_page(pagina - 1)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)  

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()
    
    return 'Success'

@app.route('/cortar')
def cortar():
    return render_template('funcoes/cortar.html')
@app.route("/cortando", methods=['POST'])
def cort():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']
    de = int(request.form['de'])
    ate = int(request.form['ate'])
   
    doc = cortando(arquivo, de, ate)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)  

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()
    
    return 'Success'

@app.route('/converter')
def converter():
    return render_template('funcoes/converter.html')
@app.route("/convertendo", methods=['POST'])
def convert():

    global progress
    progress = "0"
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']
    paginas = request.form['paginas']
    todo_doc = int(request.form['todo_doc'])

    if nome_arquivo.lower().endswith('.pdf'):  
        nome_arquivo = nome_arquivo[:-4]  
    else:
        nome_arquivo = nome_arquivo

    if (todo_doc == 0):
        doc = convertendo(arquivo, todo_doc)
    else:
        paginas_lista_str = paginas.split(',')
        paginas_lista_int = [int(numero_str) for numero_str in paginas_lista_str]

        doc = convertendo(arquivo, paginas_lista_int)

    nova_subpasta_path = os.path.join(app.config['UPLOAD_FOLDER'],  nome_arquivo)

    if not os.path.exists(nova_subpasta_path):
        os.makedirs(nova_subpasta_path) 

    for index, imagem in enumerate(doc):
        caminho_imagem = os.path.join(nova_subpasta_path, f"page-{index + 1}.png")
        imagem.save(caminho_imagem)
        
        progress = str(int(((index) / len(doc)) * 100))
        progresso()

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()
    
    return 'Success'

@app.route('/extrair')
def extrair():
    return render_template('funcoes/extrair.html')
@app.route('/extraindo', methods=['POST'])
def extraing():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']
    paginas = request.form['paginas']

    paginas_lista_str = paginas.split(',')
    paginas_lista_int = [int(numero_str) - 1 for numero_str in paginas_lista_str]

    doc = extraindo(arquivo, paginas_lista_int)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo) 

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()

    return 'Success'

@app.route('/Inverter')
def inverter():
    return render_template('funcoes/inverter.html')
@app.route('/invertendo', methods=['POST'])
def invertendo():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']

    doc = invertendo_pdf(arquivo)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)
    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()

    return 'Success'

@app.route('/combinar_2')
def combinar_dois():
    return render_template('funcoes/combinar_dois.html')
@app.route('/combinando_2', methods=['POST'])
def combinando_dois():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']

    doc = combinar_em_2(arquivo)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo, garbage=3, deflate=True)

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()

    return 'Success'

@app.route('/pagina_branca')
def pagina_branca():
    return render_template('funcoes/pg_branca.html')
@app.route('/adicionando_pag_branca', methods=['POST'])
def adicionando_pag_branca():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']
    paginas = request.form['paginas']
    paginas_lista_str = paginas.split(',')
    paginas_lista_int = [int(numero_str) - 1 for numero_str in paginas_lista_str]

    doc = inserir_pag_branco(arquivo, paginas_lista_int)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)  

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()
    
    return 'Success'

@app.route('/mover')
def mover():
    return render_template('funcoes/mover.html')
@app.route('/movendo', methods=['POST'])
def movendo():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']
    lista_pag = list(request.form['lista_pag'].split(','))  
    lista = [(int(lista_pag[i])-1, int(lista_pag[i + 1])-1) for i in range(0, len(lista_pag), 2)]

    doc = mover_paginas(arquivo, lista)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)
    
    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()

    return 'Success'

@app.route('/marca-da-agua')
def marca_da_agua():
    return render_template('funcoes/marca_da_agua.html')
@app.route('/marcando', methods=['POST'])
def marcando():
    arquivo = request.files['file']
    imagem = request.files['image']
    nome_arquivo = request.form['nome_arquivo']

    doc = marcando_agua(arquivo, imagem)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)

    threading.Thread(target=delete_file, args=(nome_arquivo, )).start()

    return 'Success'

@app.route('/extrair_img')
def extrair_img():
    return render_template('funcoes/extrair_img.html')
@app.route('/extraindo_img', methods=['POST'])
def extraindo_img():
    arquivo = request.files['file']
    nome_arquivo = request.form['nome_arquivo']

    if nome_arquivo.lower().endswith('.pdf'):  
        nome_arquivo = nome_arquivo[:-4]  
    else:
        nome_arquivo = nome_arquivo
    

    doc = extract_images_from_pdf(arquivo)

    nova_subpasta_path = os.path.join(app.config['UPLOAD_FOLDER'],  nome_arquivo)

    if not os.path.exists(nova_subpasta_path):
        os.makedirs(nova_subpasta_path) 

    for index, imagem in enumerate(doc):
        caminho_imagem = os.path.join(nova_subpasta_path, f"page-{index + 1}.png")
        with open(caminho_imagem, "wb") as image_file:
            image_file.write(imagem)

    threading.Thread(target=delete_file, args=(nome_arquivo,)).start()
    
    return 'Success'

@app.route('/unir')
def unir():
    return render_template('funcoes/unir.html')
@app.route('/unindo', methods=['POST'])
def unindo():
    arquivo = request.files['file']
    arquivo_two = request.files['file_two']
    nome_arquivo = "unido.pdf"

    doc = unindo_pdf(arquivo, arquivo_two)

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'],nome_arquivo)
    doc.save(caminho_arquivo)

    threading.Thread(target=delete_file, args=(nome_arquivo, )).start()

    return 'Success'



@app.route('/download_pdf', methods=['POST'])
def download_pdf():
    nome_arquivo = request.form['name_file']
    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'], nome_arquivo)
    try:
        return send_file(caminho_arquivo, as_attachment=True)
    except Exception as e:
        return 'Error'

@app.route('/download_path', methods=['POST'])
def download_path():
    nome_arquivo = request.form['name_file']
    if nome_arquivo.lower().endswith('.pdf'):  
        nome_arquivo = nome_arquivo[:-4] 
    else:
        nome_arquivo = nome_arquivo

    caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'], nome_arquivo)
    
    zip_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{nome_arquivo}.zip')
    with ZipFile(zip_file_path, 'w') as zipf:
        for root, dirs, files in os.walk(caminho_arquivo):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, caminho_arquivo))
    
    threading.Thread(target=delete_file, args=(f'{nome_arquivo}.zip',)).start()

    try:
        return send_file(zip_file_path, as_attachment=True)
    except Exception as e:
        return 'Error'

@app.route('/visualizar_pdf/<ultimo_elemento>')
def visualizar(ultimo_elemento):
    return render_template('baixar.html')

@app.route('/visualizar_pasta/<ultimo_elemento>')
def visualizar_pasta(ultimo_elemento):
    return render_template('baixar_pasta.html')

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
