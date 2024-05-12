
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

function atualizarProgresso(progress) {
  document.getElementById("result").innerHTML = "Carregando... " + progress + "%";
}

function enviarArquivo() {
  var input = document.getElementById("inputFile");
  
  if (!input.files || !input.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  } 

  const file = inputFile.files[0];
  const nome_arquivo = inputFile.files[0].name;
  const de = document.getElementById("de").value;
  const ate = document.getElementById("ate").value;

  localStorage.setItem('name', nome_arquivo)

  const formData = new FormData(); 
  formData.append('file', file); 
  formData.append('nome_arquivo', nome_arquivo); 
  formData.append('de', de);
  formData.append('ate', ate);
  
  document.getElementById('preview').style.display='none';
  document.getElementById('valores_inputs').style.display='none';
  document.getElementById('loader').style.display='block';

  $.ajax({
    url:'/cortando',
    type:'POST',
    processData: false,
    contentType: false, 
    data: formData, 
    success: function(response){
      document.getElementById("botao").style.display = 'none';

      var blob = new Blob([response])
      var url = URL.createObjectURL(blob)
      ultimoelemento = url.split('/').pop();
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

