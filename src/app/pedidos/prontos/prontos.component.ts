import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-prontos',
  templateUrl: './prontos.component.html',
  styleUrls: ['./prontos.component.css']
})
export class ProntosComponent implements OnInit {

  pedidos;
  pedidosPorParceiro = {
    ifood: [],
    uberEats: [],
    rappi: [],
    james: []
  };

  informacoesGerais = {};

  constructor(private ps:PedidosService) {
    this.ps.getPedidos().subscribe((values) => {
      this.pedidosPorParceiro = {
        ifood: [],
        uberEats: [],
        rappi: [],
        james: []
      };
      this.pedidos = [];
      values.forEach((v) => {
        let obj = {}
        //console.log(v.payload.val())
        obj = 
        {
          "parceiro": v.payload.val()['parceiro'],
          "status": v.payload.val()['status'],
          "numero": v.payload.val()['numero'],
          "updatedAt": new Date(v.payload.val()['updatedAt']).toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute:'2-digit'
          })
        };
        this.pedidos.push(obj);
      });
      
      this.pedidosPorParceiro.ifood = this.pedidos.filter((p) => {return p['parceiro'] == 'ifood'}).sort(this.dynamicSort("updatedAt"));
      this.pedidosPorParceiro.uberEats = this.pedidos.filter((p) => {return p['parceiro'] == 'uberEats'}).sort(this.dynamicSort("updatedAt"));
      this.pedidosPorParceiro.rappi = this.pedidos.filter((p) => {return p['parceiro'] == 'rappi'}).sort(this.dynamicSort("updatedAt"));
      this.pedidosPorParceiro.james = this.pedidos.filter((p) => {return p['parceiro'] == 'james'}).sort(this.dynamicSort("updatedAt"));
    });

    this.ps.monitoreBip().snapshotChanges(['child_changed'])
      .subscribe(actions => {        
        setTimeout(() => {
          try{
            var audio = new Audio('/assets/beep-3.mp3');
          audio.play();
          let parceiroModificado = actions[0].payload.val();
  
          let parceiros = ['ifood','uberEats','rappi','james'];

          parceiros.forEach(parceiro => {
            if ( document.getElementById(`${parceiro}List`) != undefined ) {
              document.getElementById(`${parceiro}List`).className = '';
              document.getElementById(`${parceiro}ListTime`).className = '';
            }
          })
  
          let listElement = document.getElementById(`${parceiroModificado}List`);
          let timeElement = document.getElementById(`${parceiroModificado}ListTime`);
          listElement.className='marcarBordas';
          timeElement.className='marcarBordas';
          console.log(parceiroModificado)
          setTimeout(() => {
            parceiros.forEach(parceiro => {
              if (document.getElementById(`${parceiro}List`).className != undefined){
                document.getElementById(`${parceiro}List`).className = '';
                document.getElementById(`${parceiro}ListTime`).className = '';
              }
            })
          },10000)
          }catch(e) {console.log(e.message)};
        },1000);
    });

    this.ps.getInformacoesGerais().subscribe((infos) => {
      //console.log(infos)
      this.informacoesGerais['mensagem'] = infos[0];
      this.informacoesGerais['tempoMedio'] = infos[1];
      //console.log(this.informacoesGerais);
    })

  }

  ngOnInit(): void {
    
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

}
