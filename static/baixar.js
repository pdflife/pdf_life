
document.getElementById('downloadButton').style.display = 'block';
baixarPDF();

function baixarPDF() {
  nome_arquivo = localStorage.getItem('name')
  var formData = new FormData();
  formData.append('name_file', nome_arquivo);

  fetch('/download_pdf', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.blob())
  .then(blob => {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nome_arquivo; 
    a.click();
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error('Erro:', error);
  });
}

