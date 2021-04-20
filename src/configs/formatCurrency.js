function formatCurrency(price) {
    return new Intl.NumberFormat('pt-BR',{
      style: 'currency',
      currency:'BRL'
    }).format(price)
  }
  
  export default formatCurrency;