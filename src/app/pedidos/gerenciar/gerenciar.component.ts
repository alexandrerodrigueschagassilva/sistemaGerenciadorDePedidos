import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from 'src/app/interfaces/pedidos.interface';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerenciar',
  templateUrl: './gerenciar.component.html',
  styleUrls: ['./gerenciar.component.css']
})


export class GerenciarComponent implements OnInit {
  showifood = false;
  showuberEats = false;
  showrappi = false;
  showjames = false;
  showlogo99 = false;

  parceiro: String = '';
  listaDePedidos : Pedido[] = [];
  pedidosOrdenados = {
    ifood : [],
    uberEats : [],
    rappi : [],
    james : [],
    logo99 : [],
  };
  Pedidos = [];

  historico;
  historicoPorParceiro = {
    ifood: [],
    uberEats: [],
    rappi: [],
    james: [],
    logo99: []
  };
  historicoTable = [];

  numeroDoPedido = new FormControl('',[Validators.required, Validators.maxLength(5), Validators.minLength(4)]);
  tempoMedioDePreparo = new FormControl('',[Validators.required]);
  mensagemPersonalizada = new FormControl('',[Validators.required, Validators.maxLength(150)]);
  closeResult = '';
  constructor
  (
    private ps: PedidosService, 
    public toastr: ToastrService,
    private modalService: NgbModal,
    private auth: AutenticacaoService,
    private router: Router
  ) 
  {
    this.auth.getCurrentUser().subscribe(user => {
      if( user == null) {
        console.log('user', user);
        this.router.navigateByUrl('/');
      }
    })
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
        this.pedidosOrdenados.logo99 = this.listaDePedidos.filter((p)=> {return p.parceiro == 'logo99'});

        this.Pedidos = [];  
        for( let i = 0 ; i < this.listaDePedidos.length; i++ ) {
  
          let obj = {ifood: {}, uberEats: {}, rappi: {}, james: {}, logo99: {}};
          this.pedidosOrdenados.ifood[i] != undefined ? obj.ifood = this.pedidosOrdenados.ifood[i] : '';
          this.pedidosOrdenados.uberEats[i] != undefined ? obj.uberEats = this.pedidosOrdenados.uberEats[i] : '';
          this.pedidosOrdenados.rappi[i] != undefined ? obj.rappi = this.pedidosOrdenados.rappi[i] : '';
          this.pedidosOrdenados.james[i] != undefined ? obj.james = this.pedidosOrdenados.james[i] : '';
          this.pedidosOrdenados.logo99[i] != undefined ? obj.logo99 = this.pedidosOrdenados.logo99[i] : '';

          if ( 
            this.pedidosOrdenados.ifood[i] != undefined ||
            this.pedidosOrdenados.uberEats[i] != undefined ||
            this.pedidosOrdenados.rappi[i] != undefined ||
            this.pedidosOrdenados.james[i] !=  undefined ||
            this.pedidosOrdenados.logo99[i] !=  undefined
          ) 
          {
            this.Pedidos.push(obj);
          }
  
        }
        
        console.log(this.Pedidos);
      },1000)
    });

  }

  open(content) {
    this.ps.getHistorico().subscribe((values) => {
      this.historicoPorParceiro = {
        ifood: [],
        uberEats: [],
        rappi: [],
        james: [],
        logo99: []
      };

      this.historicoTable = []
      this.historico = [];
      //console.log(values)
      values.forEach((v) => {
        let obj = {}
        obj = 
        {
          "parceiro": v.payload.val()['parceiro'],
          "status": v.payload.val()['status'],
          "numero": v.payload.val()['numero'],
          "updatedAt": new Date(v.payload.val()['updatedAt']).getDate() + "/" +new Date(v.payload.val()['updatedAt']).getMonth() + "/" +new Date(v.payload.val()['updatedAt']).getFullYear() + " " +new Date(v.payload.val()['updatedAt']).getHours() + ":" +new Date(v.payload.val()['updatedAt']).getMinutes()

        };
        this.historico.push(obj);
      });
      
      this.historicoPorParceiro.ifood = this.historico.filter((p) => {return p['parceiro'] == 'ifood'}).sort(this.dynamicSort("updatedAt"));
      this.historicoPorParceiro.uberEats = this.historico.filter((p) => {return p['parceiro'] == 'uberEats'}).sort(this.dynamicSort("updatedAt"));
      this.historicoPorParceiro.rappi = this.historico.filter((p) => {return p['parceiro'] == 'rappi'}).sort(this.dynamicSort("updatedAt"));
      this.historicoPorParceiro.james = this.historico.filter((p) => {return p['parceiro'] == 'james'}).sort(this.dynamicSort("updatedAt"));
      this.historicoPorParceiro.logo99 = this.historico.filter((p) => {return p['parceiro'] == 'logo99'}).sort(this.dynamicSort("updatedAt"));

      this.historico.forEach((h, index) => {

        let obj = {};
        this.historicoPorParceiro.ifood[index] != undefined ? obj['ifood'] = this.historicoPorParceiro.ifood[index] : '';
        this.historicoPorParceiro.uberEats[index] != undefined ? obj['uberEats'] = this.historicoPorParceiro.uberEats[index] : '';
        this.historicoPorParceiro.rappi[index] != undefined ? obj['rappi'] = this.historicoPorParceiro.rappi[index] : '';
        this.historicoPorParceiro.james[index] != undefined ? obj['james'] = this.historicoPorParceiro.james[index] : '';
        this.historicoPorParceiro.logo99[index] != undefined ? obj['logo99'] = this.historicoPorParceiro.logo99[index] : '';
        
        !this.isEmpty(obj)  ? this.historicoTable.push(obj) : '';
        
      });
    });
    
    setTimeout(() => {
      console.log('histórico', this.historicoTable);
      this.modalService.open(content, {size: 'lg'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    },1000)
  };

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
      this.numeroDoPedido.setValue('');

      this.showifood = false;
      this.showuberEats = false;
      this.showrappi = false;
      this.showjames = false;
      this.showlogo99 = false;
    }else{
      this.showError('Um erro ocorreu! Tente selecionar um parceiro!');
    }
  }

  atualizarparceiro(parceiro) {
    this.showifood = false;
    this.showuberEats = false;
    this.showrappi = false;
    this.showjames = false;
    this.showlogo99 = false;
    this.parceiro = parceiro;
    parceiro == 'ifood' ? this.showifood = true : '';
    parceiro == 'uberEats'? this.showuberEats = true : '';
    parceiro == 'rappi'? this.showrappi = true : '';
    parceiro == 'james'? this.showjames = true : '';
    parceiro == 'logo99'? this.showlogo99 = true : '';
    console.log('parceiro', this.showifood)

    setTimeout(() => {document.getElementById(`${parceiro}Input`).focus();},500)

    document.getElementById(`ifood-img`).className = 'img-logo';
    document.getElementById(`uberEats-img`).className = 'img-logo';
    document.getElementById(`rappi-img`).className = 'img-logo';
    document.getElementById(`james-img`).className = 'img-logo';
    document.getElementById(`logo99-img`).className = 'img-logo';
    document.getElementById(`${parceiro}-img`).className = 'img-logo checked';
  }

  atualizarTempoMedioDePreparo() {
    let msg = this.ps.updateInformacoesGerais({tempoMedioDePreparo: this.tempoMedioDePreparo.value, updatedAt: new Date().getTime()});
    //console.log(this.tempoMedioDePreparo.value);
    this.showSuccess('Tempo médio atualizado!');
  }
  
  atualizarMensagemPersonalizada() {
    if( this.mensagemPersonalizada.value != '' ) {
      this.ps.updateInformacoesGerais({mensagemPersonalizada: this.mensagemPersonalizada.value, updatedAt: new Date().getTime()});
      this.showSuccess('Mensagem atualizada!');
    }else{
      this.showError('Tente preencher com uma mensagem');
    }
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
