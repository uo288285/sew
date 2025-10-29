class Memoria{

    constructor(){

    }
    voltearCarta(card) {
    card.setAttribute('data-estado', 'revelada');
  }
  
}
const memoria = new Memoria();