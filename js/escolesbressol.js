
let marcadors = [];
let elMeuMapa;

window.onload = function(){
	elMeuMapa = L.map('mapaid').setView([41.3642, 2.1135], 14);
	
	let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});
	
	OpenStreetMap_Mapnik.addTo(elMeuMapa);

    let opcioSeleccionada = document.getElementById('seleccioBarri');
    opcioSeleccionada.addEventListener('change', inicialitzarMapa);

    inicialitzarMapa();
};

function inicialitzarMapa(){
    //Accedim a la opció seleccionada per l'usuari
    let opcioSeleccionada = document.getElementById('seleccioBarri');
    let opcioSelValue = document.getElementById('seleccioBarri').value;
    let opcioSelText = opcioSeleccionada.options[opcioSeleccionada.selectedIndex].text;
    let titolSeleccio = document.getElementById('titolSeleccio');

    //Fem la crida AJAX a l'URL corresponent per rebre el llistat d'escoles bressol
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = processarResposta;
    httpRequest.open('GET', 'https://opendata.l-h.cat/resource/fn79-ixb4.json', true);
    httpRequest.send(null);

    function processarResposta() {
        //Accedim a la resposta de la crida AJAX
        let resposta = JSON.parse(httpRequest.responseText);

        if(opcioSelValue === "tots"){
            //Iterem per cadascuna de les categories rebudes a través de la resposta d'AJAX i comparem amb la opció seleccionada per l'usuari
            for (let i = 0; i < resposta.length; i++) {
                    let latitud = parseFloat(resposta[i].coordenades.latitude);
                    let longitud = parseFloat(resposta[i].coordenades.longitude);
                    marcadors.push(crearMarcador(resposta[i], latitud, longitud));
            } 
            titolSeleccio.innerText = "Escoles bressol a tot L'Hospitalet";

        } else { 
            eliminarMarcadors();
            for (let i = 0; i < resposta.length; i++) {
                if(resposta[i].barri == opcioSelText){
                    let latitud = parseFloat(resposta[i].coordenades.latitude);
                    let longitud = parseFloat(resposta[i].coordenades.longitude);
                    marcadors.push(crearMarcador(resposta[i], latitud, longitud));
                }
            }
            titolSeleccio.innerText = `Escoles bressol al barri ${opcioSelText}`
            if(marcadors.length == 0){
                alert(`No hi ha cap escola bressol al barri ${opcioSelText}`);
            }
        }
        afegirMarcadors();
    }
}

let crearMarcador = function(escola, latitud, longitud) {
    let marcador = L.marker([latitud, longitud],{title:escola.nom});
    marcador.bindPopup('<h3 class="titol">' + escola.nom + '</h3><p class="descripcio">Adreça: ' 
        + escola.adreca + '</p><p class="descripcio">Telèfon: ' 
        + escola.telefon + '</p><p class="descripcio">Correu: '
        + escola.correuelectronic + '</p>');
    return marcador;
}

let afegirMarcadors = function() {
    for (let i = 0; i < marcadors.length; i++) {
        afegirMarcador(marcadors[i]);
    }
}

let afegirMarcador = function(marcador) {
    marcador.addTo(elMeuMapa);
}

function eliminarMarcadors() {
    //Eliminem el div anterior
    let divMapa = document.getElementById("mapaid");
    divMapa.remove();
    //Creem un div nou amb el seu atribut id
    let nouDivMapa = document.createElement('div');
    nouDivMapa.setAttribute('id', 'mapaid');
    //L'afegim al main
    let main = document.getElementById("seccioMain");
    main.appendChild(nouDivMapa);
    //Creem el mapa al div
    elMeuMapa = L.map('mapaid').setView([41.3642, 2.1135], 14);
    let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});
	OpenStreetMap_Mapnik.addTo(elMeuMapa);
    //Reiniciem l'array marcadors
    marcadors = [];
}

      