
let marcadors = [];
let elMeuMapa;

window.onload = function(){
    //Afegim un listener a l'element select per quan l'usuari seleccioni alguna opció
    let opcioSeleccionada = document.getElementById('seleccioBarri');
    opcioSeleccionada.addEventListener('change', inicialitzarElements);
    //Inicialitzem el mapa i fem la crida AJAX per crear els marcadors i finestres d'informació 
    inicialitzarMapa();
    inicialitzarElements();
};

//Inicialitzem i generem el nou mapa al div "mapaid"
function inicialitzarMapa(){
	elMeuMapa = L.map('mapaid').setView([41.3642, 2.1135], 14);
	let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});
	OpenStreetMap_Mapnik.addTo(elMeuMapa);
}

function inicialitzarElements(){
    //Accedim a la opció seleccionada per l'usuari (tant text com valor)
    let opcioSeleccionada = document.getElementById('seleccioBarri');
    let opcioSelText = opcioSeleccionada.options[opcioSeleccionada.selectedIndex].text;
    let opcioSelValue = document.getElementById('seleccioBarri').value;
    //Accedim al titol que mostra la selecció per modificar-la segons el que tria l'usuari
    let titolSeleccio = document.getElementById('titolSeleccio');

    //Fem la crida AJAX a l'URL corresponent per rebre el llistat d'escoles bressol
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = processarResposta;
    httpRequest.open('GET', 'https://opendata.l-h.cat/resource/fn79-ixb4.json', true);
    httpRequest.send(null);

    function processarResposta() {
        //Accedim a la resposta de la crida AJAX
        let resposta = JSON.parse(httpRequest.responseText);
        //Si la opció que està seleccionada es "tots", creem marcadors de totes les escoles bressol de la resposta
        if(opcioSelValue === "tots"){
            for (let i = 0; i < resposta.length; i++) {
                    marcadors.push(crearMarcador(resposta[i]));
            } 
            titolSeleccio.innerText = "Escoles bressol a tot L'Hospitalet";
        //Per qualsevol altra opció...
        } else { 
            //Eliminem els marcadors que hi puguin haver prèviament
            eliminarMarcadors();
            //Iterem per les escoles de la resposta d'AJAX i creem marcadors d'aquelles que coincideixen amb la opció seleccionada per l'usuari
            for (let i = 0; i < resposta.length; i++) {
                if(resposta[i].barri == opcioSelText){
                    marcadors.push(crearMarcador(resposta[i]));
                }
            }
            titolSeleccio.innerText = `Escoles bressol al barri ${opcioSelText}`
            //Si no hi ha cap escola al barri seleccionat, mostrem missatge
            if(marcadors.length == 0){
                alert(`No hi ha cap escola bressol al barri ${opcioSelText}`);
            }
        }
        //Afegim els marcadors al mapa
        afegirMarcadors();
    }
}

//Creem el marcador i la finestra d'informació de l'escola rebuda per paràmetre
let crearMarcador = function(escola) {
    let latitud = parseFloat(escola.coordenades.latitude);
    let longitud = parseFloat(escola.coordenades.longitude);
    let marcador = L.marker([latitud, longitud],{title:escola.nom});
    marcador.bindPopup('<h3 class="titol">' + escola.nom + '</h3><p class="descripcio">Adreça: ' 
        + escola.adreca + '</p><p class="descripcio">Telèfon: ' 
        + escola.telefon + '</p><p class="descripcio">Correu: '
        + escola.correuelectronic + '</p>');
    return marcador;
}

//Afegim al mapa els marcadors creats
let afegirMarcadors = function() {
    for (let i = 0; i < marcadors.length; i++) {
        marcadors[i].addTo(elMeuMapa);
    };
}

function eliminarMarcadors() {
    //Eliminem el div anterior
    let divMapa = document.getElementById("mapaid");
    divMapa.remove();
    //Creem un div nou i el seu atribut
    let nouDivMapa = document.createElement('div');
    nouDivMapa.setAttribute('id', 'mapaid');
    //L'afegim al main
    let main = document.getElementById("seccioMain");
    main.appendChild(nouDivMapa);
    //Inicialitzem i generem el nou mapa al div "mapaid"
    inicialitzarMapa();
    //Reiniciem l'array marcadors
    marcadors = [];
}
