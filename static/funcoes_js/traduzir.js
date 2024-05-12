
const traduzir = document.querySelector("#traduzir")
const preview = document.querySelector("#preview")
const input = document.querySelector('#inputFile')

var languages = {'afrikaans': 'af', 'albanian': 'sq', 'amharic': 'am', 'arabic': 'ar', 'armenian': 'hy', 'assamese': 'as', 'aymara': 'ay', 'azerbaijani': 'az', 'bambara': 'bm', 'basque': 'eu', 'belarusian': 'be', 'bengali': 'bn', 'bhojpuri': 'bho', 'bosnian': 'bs', 'bulgarian': 'bg', 'catalan': 'ca', 'cebuano': 'ceb', 'chichewa': 'ny', 'chinese (simplified)': 'zh-CN', 'chinese (traditional)': 'zh-TW', 'corsican': 'co', 'croatian': 'hr', 'czech': 'cs', 'danish': 'da', 'dhivehi': 'dv', 'dogri': 'doi', 'dutch': 'nl', 'english': 'en', 'esperanto': 'eo', 'estonian': 'et', 'ewe': 'ee', 'filipino': 'tl', 'finnish': 'fi', 'french': 'fr', 'frisian': 'fy', 'galician': 'gl', 'georgian': 'ka', 'german': 'de', 'greek': 'el', 'guarani': 'gn', 'gujarati': 'gu', 'haitian creole': 'ht', 'hausa': 'ha', 'hawaiian': 'haw', 'hebrew': 'iw', 'hindi': 'hi', 'hmong': 'hmn', 'hungarian': 'hu', 'icelandic': 'is', 'igbo': 'ig', 'ilocano': 'ilo', 'indonesian': 'id', 'irish': 'ga', 'italian': 'it', 'japanese': 'ja', 'javanese': 'jw', 'kannada': 'kn', 'kazakh': 'kk', 'khmer': 'km', 'kinyarwanda': 'rw', 'konkani': 'gom', 'korean': 'ko', 'krio': 'kri', 'kurdish (kurmanji)': 'ku', 'kurdish (sorani)': 'ckb', 'kyrgyz': 'ky', 'lao': 'lo', 'latin': 'la', 'latvian': 'lv', 'lingala': 'ln', 'lithuanian': 'lt', 'luganda': 'lg', 'luxembourgish': 'lb', 'macedonian': 'mk', 'maithili': 'mai', 'malagasy': 'mg', 'malay': 'ms', 'malayalam': 'ml', 'maltese': 'mt', 'maori': 'mi', 'marathi': 'mr', 'meiteilon (manipuri)': 'mni-Mtei', 'mizo': 'lus', 'mongolian': 'mn', 'myanmar': 'my', 'nepali': 'ne', 'norwegian': 'no', 'odia (oriya)': 'or', 'oromo': 'om', 'pashto': 'ps', 'persian': 'fa', 'polish': 'pl', 'portuguese': 'pt', 'punjabi': 'pa', 'quechua': 'qu', 'romanian': 'ro', 'russian': 'ru', 'samoan': 'sm', 'sanskrit': 'sa', 'scots gaelic': 'gd', 'sepedi': 'nso', 'serbian': 'sr', 'sesotho': 'st', 'shona': 'sn', 'sindhi': 'sd', 'sinhala': 'si', 'slovak': 'sk', 'slovenian': 'sl', 'somali': 'so', 'spanish': 'es', 'sundanese': 'su', 'swahili': 'sw', 'swedish': 'sv', 'tajik': 'tg', 'tamil': 'ta', 'tatar': 'tt', 'telugu': 'te', 'thai': 'th', 'tigrinya': 'ti', 'tsonga': 'ts', 'turkish': 'tr', 'turkmen': 'tk', 'twi': 'ak', 'ukrainian': 'uk', 'urdu': 'ur', 'uyghur': 'ug', 'uzbek': 'uz', 'vietnamese': 'vi', 'welsh': 'cy', 'xhosa': 'xh', 'yiddish': 'yi', 'yoruba': 'yo', 'zulu': 'zu'}

function addOptions(selectElement, options) {
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      var option = document.createElement('option');
      option.value = options[key];
      option.textContent = key;
      selectElement.appendChild(option);
    }
  }
}

var selectElement = document.getElementById('languageSelect');
var selectElement_two = document.getElementById('languageSelect_two');

addOptions(selectElement, languages);
addOptions(selectElement_two, languages);

function displaySelectedValue(form) {
  var selectedIndex = selectElement.selectedIndex;
  var selectedOption = selectElement.options[selectedIndex];
  var selectedLanguage = selectedOption.textContent;
  var selectedLanguageCode = selectedOption.value;

  var selectedIndex_two = selectElement_two.selectedIndex;
  var selectedOption_two = selectElement_two.options[selectedIndex_two];
  var selectedLanguage_two = selectedOption_two.textContent;
  var selectedLanguageCode_two = selectedOption_two.value;

  form.append('De', selectedLanguageCode);
  form.append('Para', selectedLanguageCode_two);
}

selectElement.addEventListener('change', displaySelectedValue);
selectElement_two.addEventListener('change', displaySelectedValue)

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

function enviarArquivo() {
  var input = document.getElementById("inputFile");
  
  if (!input.files || !input.files[0]) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  } 

  const file = inputFile.files[0];
  const nome_arquivo = inputFile.files[0].name;
  localStorage.setItem('name', 'traduzido.pdf')

  const formData = new FormData(); 
  formData.append('file', file); 
  formData.append('nome_arquivo', 'traduzido.pdf');
  displaySelectedValue(formData);

  $.ajax({
    url:'/traduzindo',
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
  }, 10);
    
};


function final(ultimoelemento){
  fetch('/visualizar_pdf', {
    method:'POST',
  })
  .then(response =>{
    window.location.href = 'visualizar_pdf' + '/' + ultimoelemento
  })
}

