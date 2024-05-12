
const traduzir = document.querySelector("#botao")
const preview = document.querySelector("#preview")
const input = document.querySelector('#inputFile')

input.addEventListener('change', function(){
  nome_arquivo = input.files[0].name;
  document.getElementById('preview').style.display= 'block';
  document.getElementById("botao").style.display = 'block';
  document.getElementById('janela').style.display = 'none';
  document.getElementById('valores_inputs').style.display = 'block';})

function previewFile(){
  const preview = document.querySelector("#preview");
  const file = document.querySelector("#inputFile").files[0];

  obj_url = URL.createObjectURL(file);
  preview.setAttribute("data", obj_url);
  document.getElementById("inputFile").style.display = 'none';
}

function atualizarProgresso(progress) {
  document.getElementById("result").innerHTML = "Carregando... " + progress + "%";
}

function aoSelecionarInput (event) {
  const inputClicado = event.target

  function removeSelecao () {
      inputClicado.checked = false
  }

  inputClicado.addEventListener('click', removeSelecao, { once: true })
}

function enviarArquivo() {
  var input = document.getElementById("inputFile");
  var angulos = document.getElementsByName("angulos");
  const todo_doc = document.getElementsByName("todo_doc");
  const formData = new FormData(); 
  
  if (!input.files || !input.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  } 

  for (var i = 0; i < angulos.length; i++) {
    if (angulos[i].checked) {
      const ang = angulos[i].value;
      formData.append('angulo', ang);
    }
  }
 
  if (todo_doc[0].checked) {
    const valor = todo_doc[0].value;
    formData.append('todo_doc', valor);
  }
  if(!todo_doc[0].checked){
    formData.append('todo_doc', 1);
  }

  const file = inputFile.files[0];
  const nome_arquivo = inputFile.files[0].name;
  const paginas = document.getElementById("inputValue").value;

  localStorage.setItem('name', nome_arquivo);
  
  formData.append('file', file); 
  formData.append('nome_arquivo', nome_arquivo); 
  formData.append('paginas', paginas);
  
  $.ajax({
    url:'/rotacionando',
    type:'POST',
    processData: false, 
    contentType: false, 
    data: formData, 
    success: function(response){
      document.getElementById("botao").style.display = 'none';

      var blob = new Blob([response])
      console.log(blob)
      var url = URL.createObjectURL(blob)
      console.log(url)
      ultimoelemento = url.split('/').pop();
      console.log(ultimoelemento);
      final(ultimoelemento);
    }
    });
};


function final(ultimoelemento){
  fetch('/visualizar_pdf', {
    method:'POST',
  })
  .then(response =>{
    window.location.href = 'visualizar_pdf' + '/' + ultimoelemento
  })
}

