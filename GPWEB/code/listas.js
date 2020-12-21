//var pedidosRef = database.ref('pedidos').orderByChild('updatedAt').equalTo('status','liberado').limitToLast(50);
var pedidosRef = database.ref('pedidos').orderByChild('status').equalTo('chamado').limitToLast(50);
var bipBDRef = database.ref('bip');

var ifoodListElement         = document.getElementById('ifoodList');
var ifoodListTimeElement     = document.getElementById('ifoodListTime');
var uberEatsListElement      = document.getElementById('uberEatsList');
var uberEatsListTimeElement  = document.getElementById('uberEatsListTime');
var rappiListElement         = document.getElementById('rappiList');
var rappiListTimeElement     = document.getElementById('rappiListTime');
var jamesListElement         = document.getElementById('jamesList');
var jamesListTimeElement     = document.getElementById('jamesListTime');

//criando variáveis de lista
var ifood         = [];
var uberEats      = [];
var rappi         = [];
var james         = [];
var lista = [];

//monitorar Bip
active_UpdateBip();
//monitorar listas
active_updateLists();

function active_UpdateBip() {
  var audio = new Audio('./assets/beep-3.mp3');

  bipBDRef.on('value', (snapshot) =>{
    const data = snapshot.val();
    audio.play();

    if ( data.parceiro == 'ifood' ) {
      ifoodListElement.className='marcarBordas';
      ifoodListTimeElement.className='marcarBordas';
      setTimeout(()=> {
        ifoodListElement.className='';
        ifoodListTimeElement.className='';
      },5000);
    }
    if ( data.parceiro == 'uberEats' ) {
      uberEatsListElement.className='marcarBordas';
      uberEatsListTimeElement.className='marcarBordas';
      setTimeout(()=> {
        uberEatsListElement.className='';
        uberEatsListTimeElement.className='';
      },5000);
    }
    if ( data.parceiro == 'rappi' ) {
      rappiListElement.className='marcarBordas';
      rappiListTimeElement.className='marcarBordas';
      setTimeout(()=> {
        rappiListElement.className='';
        rappiListTimeElement.className='';
      },5000);
    }
    if ( data.parceiro == 'james' ) {
      jamesListElement.className='marcarBordas';
      jamesListTimeElement.className='marcarBordas';
      setTimeout(()=> {
        jamesListElement.className='';
        jamesListTimeElement.className='';
      },5000);
    }

  });
}

function active_updateLists() {
  pedidosRef.on('value', (childSnapshot) =>{
    lista = [];

    childSnapshot.forEach(snapshot => {
      const data = snapshot.val();
      lista.push(data);
      //console.log(data)
    });

    lista = lista.sort(this.dynamicSort("updatedAt"));

    lista = lista.map((data) => {
      return {
        "parceiro": data['parceiro'],
        "status": data['status'],
        "numero": data['numero'],
        "updatedAt": new Date(data['updatedAt']).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute:'2-digit'
        })
      };
    });

    ifood = lista.filter((data) => {return data.parceiro == 'ifood'});
    uberEats = lista.filter((data) => {return data.parceiro == 'uberEats'});
    rappi = lista.filter((data) => {return data.parceiro == 'rappi'});
    james = lista.filter((data) => {return data.parceiro == 'james'});

    update_lists();

  });
}

function update_lists() {
  removeAllChildNodes(ifoodListElement);
  removeAllChildNodes(ifoodListTimeElement);
  removeAllChildNodes(uberEatsListElement);
  removeAllChildNodes(uberEatsListTimeElement);
  removeAllChildNodes(rappiListElement);
  removeAllChildNodes(rappiListTimeElement);
  removeAllChildNodes(jamesListElement);
  removeAllChildNodes(jamesListTimeElement);

  //ifood
  if ( ifood.length > 0 ) {
    ifood.forEach((data) => {
      var divNumber = document.createElement('div');
      var divNumber = document.createElement('h3')
      var divTime = document.createElement('div');
      var divTime = document.createElement('h3');
      var numero = document.createTextNode(`${data.numero}`);  
      var updatedAt = document.createTextNode(`${data.updatedAt}`);  
      divNumber.appendChild(numero);
      divTime.appendChild(updatedAt);
      ifoodListElement.appendChild(divNumber);
      ifoodListTimeElement.appendChild(divTime);
    });
  }

  //uberEats
  if ( uberEats.length > 0 ) {
    uberEats.forEach((data) => {
      var divNumber = document.createElement('div');
      var divNumber = document.createElement('h3')
      var divTime = document.createElement('div');
      var divTime = document.createElement('h3');
      var numero = document.createTextNode(`${data.numero}`);  
      var updatedAt = document.createTextNode(`${data.updatedAt}`);  
      divNumber.appendChild(numero);
      divTime.appendChild(updatedAt);
      uberEatsListElement.appendChild(divNumber);
      uberEatsListTimeElement.appendChild(divTime);
    });
  }

  //rappi
  if ( rappi.length > 0 ) {
    rappi.forEach((data) => {
      var divNumber = document.createElement('div');
      var divNumber = document.createElement('h3')
      var divTime = document.createElement('div');
      var divTime = document.createElement('h3');
      var numero = document.createTextNode(`${data.numero}`);  
      var updatedAt = document.createTextNode(`${data.updatedAt}`);  
      divNumber.appendChild(numero);
      divTime.appendChild(updatedAt);
      rappiListElement.appendChild(divNumber);
      rappiListTimeElement.appendChild(divTime);
    });
  }
  //james
  if ( james.length > 0 ) {
    james.forEach((data) => {
      var divNumber = document.createElement('div');
      var divNumber = document.createElement('h3')
      var divTime = document.createElement('div');
      var divTime = document.createElement('h3');
      var numero = document.createTextNode(`${data.numero}`);  
      var updatedAt = document.createTextNode(`${data.updatedAt}`);  
      divNumber.appendChild(numero);
      divTime.appendChild(updatedAt);
      jamesListElement.appendChild(divNumber);
      jamesListTimeElement.appendChild(divTime);
    });
  }
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}