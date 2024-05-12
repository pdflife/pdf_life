
const traduzir = document.querySelector("#botao")
const preview = document.querySelector("#preview")
const input = document.querySelector('#inputFile')

input.addEventListener('change', function(){
  nome_arquivo = input.files[0].name;
  document.getElementById('preview').style.display= 'block';
  document.getElementById("labelEsconder").style.display = 'none';
  document.getElementById('vizualizar_marca').style.display= 'block';

})

function previewFile(){
  const preview = document.querySelector("#preview");
  const file = document.querySelector("#inputFile").files[0];

  obj_url = URL.createObjectURL(file);
  preview.setAttribute("data", obj_url);
  document.getElementById("inputFile").style.display = 'none';
  document.getElementById("vizualizar_marca").style.display = 'block';
  confirmation();
}

var inputImage = document.querySelector("#inputImage");
inputImage.addEventListener('change', function(event) {
  var file = event.target.files[0];

  document.getElementById("labelEsconder_dois").style.display = 'none';

  var reader = new FileReader();
  reader.onload = function(e) {
      var imagem = new Image();
      imagem.onload = function() {
          var novaLargura = 300; 
          redimensionarImagem(imagem, novaLargura, function(imagemRedimensionadaUrl) {
              const imagemRedimensionada = document.getElementById('imagem');
              imagemRedimensionada.setAttribute('src',imagemRedimensionadaUrl );
              document.getElementById('vizualizar_marca').style.display= 'block';

              confirmation();              
          });
      };
      imagem.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function redimensionarImagem(imagem, novaLargura, callback) {
  var proporcao = novaLargura / imagem.width;
  var novaAltura = imagem.height * proporcao;

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = novaLargura;
  canvas.height = novaAltura;

  ctx.drawImage(imagem, 0, 0, novaLargura, novaAltura);

  var imagemRedimensionadaUrl = canvas.toDataURL(); 

  callback(imagemRedimensionadaUrl);
}

function confirmation(){
  if (document.querySelector("#inputFile").files[0] && document.querySelector("#inputImage").files[0])
    {
      document.getElementById("janela").style.display = 'none';
      document.getElementById("botao").style.display = 'block';
      document.getElementById('valores_inputs').style.display = 'block';
    }
}


function atualizarProgresso(progress) {
  document.getElementById("result").innerHTML = "Carregando... " + progress + "%";
}

function enviarArquivo() {
  var input = document.getElementById("inputFile");
  var input_image = document.getElementById('inputImage')
  
  if (!input.files || !input.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  } 

  const file = inputFile.files[0];
  const image = input_image.files[0];
  const nome_arquivo = inputFile.files[0].name;

  localStorage.setItem('name', nome_arquivo)

  const formData = new FormData(); 
  formData.append('file', file); 
  formData.append('image', image);
  formData.append('nome_arquivo', nome_arquivo); 
  
  $.ajax({
    url:'/marcando',
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

