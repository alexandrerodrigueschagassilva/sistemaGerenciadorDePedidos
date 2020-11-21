import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from 'src/app/interfaces/pedidos.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gerenciar',
  templateUrl: './gerenciar.component.html',
  styleUrls: ['./gerenciar.component.css']
})

export class GerenciarComponent implements OnInit {

  parceiro: String = '';
  listaDePedidos : Pedido[] = [];
  pedidosOrdenados = {
    ifood : [],
    uberEats : [],
    rappi : [],
    james : []
  };
  Pedidos = [];

  historico;
  historicoPorParceiro = {
    ifood: [],
    uberEats: [],
    rappi: [],
    james: []
  };
  showHistórico = false;

  numeroDoPedido = new FormControl('',[Validators.required, Validators.maxLength(5), Validators.minLength(4)]);
  tempoMedioDePreparo = new FormControl('',[Validators.required]);
  mensagemPersonalizada = new FormControl('',[Validators.required, Validators.maxLength(150)]);
  constructor(private ps: PedidosService, public toastr: ToastrService) {
  }

  ngOnInit(): void {


    this.ps.getPedidos().subscribe((pedido) => {

      this.listaDePedidos = [];

      this.listaDePedidos = pedido.map(p => {
        return {
          key: p.key,
          parceiro: p.payload.val()['parceiro'],
          status: p.payload.val()['status'],
          numero: p.payload.val()['numero'],
          createdAt: p.payload.val()['createdAt'],
          updatedAt: p.payload.val()['updatedAt']
        };
      });
      setTimeout(()=> {
        this.pedidosOrdenados.ifood = this.listaDePedidos.filter((p)=> {return p.parceiro == 'ifood'});
        this.pedidosOrdenados.uberEats = this.listaDePedidos.filter((p)=> {return p.parceiro == 'uberEats'});
        this.pedidosOrdenados.rappi = this.listaDePedidos.filter((p)=> {return p.parceiro == 'rappi'});
        this.pedidosOrdenados.james = this.listaDePedidos.filter((p)=> {return p.parceiro == 'james'});

        this.Pedidos = [];  
        for( let i = 0 ; i < this.listaDePedidos.length; i++ ) {
  
          let obj = {ifood: {}, uberEats: {}, rappi: {}, james: {}};
          this.pedidosOrdenados.ifood[i] != undefined ? obj.ifood = this.pedidosOrdenados.ifood[i] : '';
          this.pedidosOrdenados.uberEats[i] != undefined ? obj.uberEats = this.pedidosOrdenados.uberEats[i] : '';
          this.pedidosOrdenados.rappi[i] != undefined ? obj.rappi = this.pedidosOrdenados.rappi[i] : '';
          this.pedidosOrdenados.james[i] != undefined ? obj.james = this.pedidosOrdenados.james[i] : '';

          if ( 
            this.pedidosOrdenados.ifood[i] != undefined ||
            this.pedidosOrdenados.uberEats[i] != undefined ||
            this.pedidosOrdenados.rappi[i] != undefined ||
            this.pedidosOrdenados.james[i] !=  undefined
          ) 
          {
            this.Pedidos.push(obj);
          }
  
        }
        
        console.log(this.Pedidos);
      },1000)
    });

  }

  chamarPedido() {
    let pedido: Pedido = {
      parceiro: this.parceiro,
      status: 'chamado',
      numero: this.numeroDoPedido.value,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    };
    if ( pedido.parceiro != '' && pedido.numero != '' ) {
      this.ps.addPedido(pedido);
      this.showSuccess('Pedido chamado!');
      let time = new Date().getTime();
      this.ps.setBip(pedido.parceiro, time);
    }else{
      this.showError('Um erro ocorreu! Tente selecionar um parceiro!');
    }
  }

  atualizarparceiro(parceiro) {
    this.parceiro = parceiro;
    document.getElementById(`ifood-img`).className = 'img-logo';
    document.getElementById(`uberEats-img`).className = 'img-logo';
    document.getElementById(`rappi-img`).className = 'img-logo';
    document.getElementById(`james-img`).className = 'img-logo';
    document.getElementById(`${parceiro}-img`).className = 'img-logo checked';
  }

  atualizarTempoMedioDePreparo() {
    let msg = this.ps.updateInformacoesGerais({tempoMedioDePreparo: this.tempoMedioDePreparo.value, updatedAt: new Date().getTime()});
    //console.log(this.tempoMedioDePreparo.value);
    this.showSuccess('Tempo médio atualizado!');
  }
  
  atualizarMensagemPersonalizada() {
    this.ps.updateInformacoesGerais({mensagemPersonalizada: this.mensagemPersonalizada.value, updatedAt: new Date().getTime()});
    console.log(this.mensagemPersonalizada.value);
    this.showSuccess('Mensagem atualizada!');
  }

  liberarPedido(key) {
    this.ps.liberarPedido(key);
    this.showSuccess('Pedido liberado!');
  }

  chamarPedidoNovamente(key) {
    this.ps.chamarPedidoNovamente(key);
    this.showSuccess('Pedido chamado novamente!');
    let time = new Date().getTime();
    let parceiro: any = ''

    this.ps.getOnePedido(key).valueChanges().subscribe((v) => {
      parceiro = v[2];
    });
    setTimeout(() => {
      this.ps.setBip(parceiro, time);
    },2000);
  }

  showOrHideHistorico() {
    
    this.showHistórico = !this.showHistórico;

    if (this.showHistórico) {
      this.ps.getHistorico().subscribe((values) => {
        this.historicoPorParceiro = {
          ifood: [],
          uberEats: [],
          rappi: [],
          james: []
        };
  
  
        this.historico = [];
        values.forEach((v) => {
          let obj = {}
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
          this.historico.push(obj);
        });
        
        this.historicoPorParceiro.ifood = this.historico.filter((p) => {return p['parceiro'] == 'ifood'}).sort(this.dynamicSort("updatedAt"));
        this.historicoPorParceiro.uberEats = this.historico.filter((p) => {return p['parceiro'] == 'uberEats'}).sort(this.dynamicSort("updatedAt"));
        this.historicoPorParceiro.rappi = this.historico.filter((p) => {return p['parceiro'] == 'rappi'}).sort(this.dynamicSort("updatedAt"));
        this.historicoPorParceiro.james = this.historico.filter((p) => {return p['parceiro'] == 'james'}).sort(this.dynamicSort("updatedAt"));
      });
    }
    console.log(this.showHistórico);

  }


  showSuccess(mensagem) {
    this.toastr.success(mensagem);
  }

  showError(mensagem) {
    this.toastr.error(mensagem);
  }

  dynamicSort(property) {
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

}
