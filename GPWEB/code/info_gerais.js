var infoGeraisRef = database.ref('infoGerais');

//informações gerais
var infoGerais_mensagemElement = document.getElementById('infoGerais_mensagem');
var infoGerais_tempoMedioElement = document.getElementById('infoGerais_tempoMedio');

//monitora as informações gerais
infoGeraisRef.on('value', (snapshot) =>{
const data = snapshot.val();
infoGerais_mensagemElement.innerHTML = data.mensagemPersonalizada;
infoGerais_tempoMedioElement.innerHTML = data.tempoMedioDePreparo + 'min';
});

