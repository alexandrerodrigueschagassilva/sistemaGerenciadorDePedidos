export interface Pedido {
    key?:String,
    parceiro: String,
    status: String,
    numero: String,
    createdAt: Number,
    updatedAt: Number
}

export enum parceiros {
    'ifood',
    'uberEats',
    'rappi',
    'james',
    'logo99'
}

export enum status {
    'chamado',
    'liberado'
}