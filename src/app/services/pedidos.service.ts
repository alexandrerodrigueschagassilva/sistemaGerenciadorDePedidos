import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Pedido } from '../interfaces/pedidos.interface';

@Injectable({
  providedIn: 'root'
})

export class PedidosService {

  pedidosRef;
  infGerais;

  constructor(public db: AngularFireDatabase) {
    this.pedidosRef = db;
    this.infGerais = db.database.ref('infoGerais');
  }

  setBip(parceiro, timestamp) {
    this.db.database.ref('bip').set({
      parceiro: parceiro,
      timestamp
    });
  };

  monitoreBip() {
    return this.db.list('bip');
  }

  addPedido(pedido: Pedido) {
    this.db.database.ref('pedidos').push(pedido);
  }

  getPedidos() {
    let pedidos = this.db.list('/pedidos', ref => ref.orderByChild('status').equalTo('chamado').limitToLast(50)).snapshotChanges();
    return pedidos;
  }

  getHistorico() {
    let pedidos = this.db.list('/pedidos', ref => ref.orderByChild('status').equalTo('liberado').limitToLast(50)).snapshotChanges();
    return pedidos;
  }

  liberarPedido(key) {

    this.db.database.ref(`pedidos/${key}`).update({updatedAt: new Date().getTime(), status: 'liberadocls'})
    console.log('liberar pedido: ', key);
  }
  
  chamarPedidoNovamente(key) {
    console.log('chamarPedidoNovamente: ', key)
    this.db.database.ref(`pedidos/${key}`).update({updatedAt: new Date().getTime(), status: 'chamado'});
  }

  getOnePedido(key) {
    return this.db.list(`pedidos/${key}`);
  }
  
  updateInformacoesGerais(informacao) {
    this.infGerais.update(informacao);
  }

  getInformacoesGerais() {
    return this.db.list('infoGerais').valueChanges();
  }

}




