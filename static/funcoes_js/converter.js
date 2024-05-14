
const traduzir = document.querySelector("#botao")
const preview = document.querySelector("#preview")
const input = document.querySelector('#inputFile')

input.addEventListener('change', function(){
  nome_arquivo = input.files[0].name;
  document.getElementById('preview').style.display= 'block';
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

function aoSelecionarInput (event) {
  const inputClicado = event.target

  function removeSelecao () {
      inputClicado.checked = false
  }

  inputClicado.addEventListener('click', removeSelecao, { once: true })
}

function atualizarProgresso(progress) {
  document.getElementById("result").innerHTML = "Carregando... " + progress + "%";
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
      formData.append('todo_doc', 0);
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

  document.getElementById('preview').style.display='none';
  document.getElementById('valores_inputs').style.display='none';
  document.getElementById('loader').style.display='block';

  verificarProgresso();

  $.ajax({
    url:'/convertendo',
    type:'POST',
    processData: false, 
    contentType: false, 
    data: formData, 
    success: function(response){
      var blob = new Blob([response])
      var url = URL.createObjectURL(blob)
      ultimoelemento = url.split('/').pop();
      final(ultimoelemento);
    }
    });
};


function final(ultimoelemento){
  fetch('/visualizar_pasta', {
    method:'POST',
  })
  .then(response =>{
    window.location.href = 'visualizar_pasta' + '/' + ultimoelemento
  })
};


function verificarProgresso() {
  $.ajax({
      url: '/progresso',
      type: 'GET',
      success: function(response) {
          var progresso = response.progresso;
          atualizarProgresso(progresso);
          
          // Verifica novamente o progresso após um curto intervalo de tempo
          setTimeout(verificarProgresso, 3000);
      },
      error: function(xhr, status, error) {
          console.error('Erro ao verificar o progresso:', error);
      }
  });
};
