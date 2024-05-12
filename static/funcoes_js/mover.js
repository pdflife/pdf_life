
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

let listaValores = [];

function salvarValores() {
  const inputValue = document.getElementById("inputValue").value;
  const inputValue_two = document.getElementById("inputValue_two").value;

  if (inputValue.trim() === "" || inputValue_two.trim() === "") {
    alert("Por favor, insira valores em ambos os campos.");
    return;
  }

  const valoresUm = inputValue.split(",");
  const valoresDois = inputValue_two.split(",");
  if (valoresUm.length != valoresDois.length) {
    alert("Faltado valores");
    return;
  }

  for (let i = 0; i < Math.min(valoresUm.length, valoresDois.length); i++) {
    listaValores.push([valoresUm[i], valoresDois[i]]);
  }
  
  exibirValoresNaTela();
}

function exibirValoresNaTela() {
  const valoresSalvosDiv = document.getElementById("valoresSalvos");
  valoresSalvosDiv.innerHTML = "<p>Alterações salvos:</p>";
  listaValores.forEach(par => {
    valoresSalvosDiv.innerHTML += `<p>${par[0]} -> ${par[1]}</p>`;
  });
  console.log(listaValores);
}

function excluirValores() {
  if (listaValores.length > 0) {
      listaValores.pop();
      exibirValoresNaTela();
  } else {
      alert("A lista está vazia. Não há pares para excluir.");
  }
}

function enviarArquivo() {
  var input = document.getElementById("inputFile");
  
  if (!input.files || !input.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  } 

  const file = inputFile.files[0];
  const nome_arquivo = inputFile.files[0].name;
  localStorage.setItem('name', nome_arquivo)

  const formData = new FormData(); 
  formData.append('file', file); 
  formData.append('nome_arquivo', nome_arquivo);
  formData.append('lista_pag', listaValores);
  
  $.ajax({
    url:'/movendo',
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

