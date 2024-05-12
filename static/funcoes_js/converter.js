
const traduzir = document.querySelector("#botao")
const preview = document.querySelector("#preview")
const input = document.querySelector('#inputFile')

input.addEventListener('change', function(){
  nome_arquivo = input.files[0].name;
  document.getElementById('preview').style.display= 'block';
  document.getElementById('tela').style.display= 'block';
  document.getElementById("botao").style.display = 'block';
  document.getElementById('janela').style.display = 'none';
  document.getElementById('valores_inputs').style.display = 'block';
})

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
  const todo_doc = document.getElementsByName("todo_doc");

  const formData = new FormData();
  
  if (!input.files || !input.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
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
    url:'/convertendo',
    type:'POST',
    processData: false, 
    contentType: false, 
    data: formData, 
    success: function(response){
      //ocultar botao
      document.getElementById("botao").style.display = 'none';

      var blob = new Blob([response])
      var url = URL.createObjectURL(blob)
      ultimoelemento = url.split('/').pop();
      final(ultimoelemento);
    }
    });

    
    var intervalID = setInterval(() => {
      $.ajax({
          url: '/contagem', 
          type: 'GET',
          success: function(progresso) {              
              atualizarProgresso(progresso);
              if (progresso === "100") {
                  clearInterval(intervalID);
                  document.getElementById('result').innerHTML=""
              }
          },
          error: function(xhr, status, error) {
              console.error('Erro ao buscar o progresso:', error);
              clearInterval(intervalID); 
          }
      });
  }, 100);    
};


function final(ultimoelemento){
  fetch('/visualizar_pasta', {
    method:'POST',
  })
  .then(response =>{
    window.location.href = 'visualizar_pasta' + '/' + ultimoelemento
  })
}

