
const traduzir = document.querySelector("#botao")
const preview = document.querySelector("#preview")
const input = document.querySelector('#inputFile')
const inputFile_two = document.querySelector('#inputFile_two')

input.addEventListener('change', function(){
  nome_arquivo = input.files[0].name;
  document.getElementById("labelEsconder").style.display = 'none';
  document.getElementById('primeiro_arquivo').style.display= 'block';
  confirmation();
})

inputFile_two.addEventListener('change', function(){
  document.getElementById("labelEsconder_dois").style.display = 'none'
  document.getElementById('segundo_arquivo').style.display= 'block';
  confirmation();
})

function confirmation(){
  if (document.querySelector("#inputFile").files[0] && document.querySelector("#inputFile_two").files[0])
    {
      document.getElementById('valores_inputs').style.display = 'block';
      document.getElementById('janela').style.display = 'none';
    }
}

function previewFile(){
  const preview = document.querySelector("#preview");
  const file = document.querySelector("#inputFile").files[0];

  obj_url = URL.createObjectURL(file);
  preview.setAttribute("data", obj_url);
  document.getElementById("inputFile").style.display = 'none';
}

function previewFile_two(){
  document.getElementById('preview_two').style.display= 'block';
  document.getElementById("labelEsconder_dois").style.display = 'none';

  const preview = document.querySelector("#preview_two");
  const file = document.querySelector("#inputFile_two").files[0];

  obj_url = URL.createObjectURL(file);
  preview.setAttribute("data", obj_url);
  document.getElementById("inputFile_two").style.display = 'none';
}



function enviarArquivo() {
  var input = document.getElementById("inputFile");
  var input_two = document.getElementById('inputFile_two')
  
  if (!input.files || !input.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  } 

  if (!input_two.files || !input_two.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  } 

  const file = inputFile.files[0];
  const file_two = input_two.files[0];
  const nome_arquivo = inputFile.files[0].name;

  localStorage.setItem('name', 'unido.pdf')

  const formData = new FormData(); 
  formData.append('file', file); 
  formData.append('file_two', file_two);
  formData.append('nome_arquivo', nome_arquivo); 

  document.getElementById('vizualizar_dois_arquivo').style.display='none';
  document.getElementById('valores_inputs').style.display='none';
  document.getElementById('loader').style.display='block';
  
  $.ajax({
    url:'/unindo',
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

  fetch('/visualizar_pdf', {
    method:'POST',
  })
  .then(response =>{
    window.location.href = 'visualizar_pdf' + '/' + ultimoelemento
  })
}

