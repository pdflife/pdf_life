// Função para carregar os versículos a partir de um arquivo externo
function carregarVersiculosDoArquivo() {
    // Cria uma nova requisição AJAX
    var xhr = new XMLHttpRequest();
    // Define o método e o URL da requisição
    xhr.open('GET', 'static/versiculos.txt', true);
    // Define o tipo de resposta esperada
    xhr.responseType = 'text';

    // Função a ser chamada quando a requisição for bem sucedida
    xhr.onload = function() {
        // Verifica se a requisição foi bem sucedida
        if (xhr.status === 200) {
            // Converte o texto da resposta para um objeto JSON
            var data = JSON.parse(xhr.responseText);
            // Chama a função para exibir um versículo aleatório, passando os dados carregados do arquivo
            exibirVersiculoAleatorio(data);
        } else {
            console.error('Erro ao carregar o arquivo.');
        }
    };

    // Função a ser chamada em caso de erro na requisição
    xhr.onerror = function() {
        console.error('Erro ao carregar o arquivo.');
    };

    // Envia a requisição
    xhr.send();
}

// Função para exibir um versículo aleatório a partir dos dados carregados do arquivo
function exibirVersiculoAleatorio(versiculos) {
    // Seleciona um índice aleatório do array de versículos
    var indice = Math.floor(Math.random() * versiculos.length);
    // Obtém o versículo e a localização correspondentes ao índice selecionado
    var versiculoAleatorio = versiculos[indice].versiculo;
    var localizacaoAleatoria = versiculos[indice].localizacao;
    // Exibe o versículo e a localização na página HTML
    document.getElementById("versiculo").innerHTML = "<p>" + versiculoAleatorio + "</p>";
    document.getElementById("localizacao").innerHTML = "<p>" + localizacaoAleatoria + "</p>";
}

// Chama a função para carregar os versículos a partir do arquivo quando a página carrega
window.onload = carregarVersiculosDoArquivo;
