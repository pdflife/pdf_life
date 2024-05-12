
document.getElementById('downloadButton').style.display = 'block';

function baixarPDF() {
  nome_arquivo = localStorage.getItem('name')
  nome_arquivo = nome_arquivo.replace('.pdf', '');
  console.log(nome_arquivo)
  var formData = new FormData();
  formData.append('name_file', nome_arquivo);

  fetch('/download_path', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.blob())
  .then(blob => {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nome_arquivo + '.zip'; 
    a.click();    
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
}

