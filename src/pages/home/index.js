import React, { Component } from "react";
import './style.css';
import Deliverize from '../assets/img/Deliverize.png';
import IconUser from '../assets/img/icons/account_circle_24px.png';
import IconCarrinho from '../assets/img/icons/shopping_cart_24px.png';
import { createPopper } from '@popperjs/core';
import api from "../../services/api";
import formatCurrency from "../../configs/formatCurrency";

class Home extends Component {
    state = {
        produto: {  
            ingredients: [
                {itens: 
                    [{
                        nm_item: '',
                        vl_item: 0
                    },
                    {
                        nm_item: '',
                        vl_item: 0
                    },
                    {
                        nm_item: '',
                        vl_item: 0
                    },
                    {
                        nm_item: '',
                        vl_item: 0
                    }] 
                }]
        },
        
        itens: {
            notificacaoQtd: 0, 
            itemValue: []
        }
    };

async UNSAFE_componentWillMount() {
    await this.getProduct();
}

async getProduct() {
    const product = await api.get('test-frontend/products')
    this.setState({produto:product.data[0]});
}

hideTooltip () {
    const tooltip = document.querySelector('#tooltip');
    tooltip.style.display = 'none';
}

async estadoIngredientes() {
    const notificacaoQtd = document.querySelector('.notificacao__qtd').value;
    const toggle = Array.from(document.querySelectorAll('.toggle'));
    const item = Array.from(document.querySelectorAll("#item"));
    
    const itemValue = item.map(i => {
        return parseInt(i.value);
    });

    const itens = {notificacaoQtd, itemValue};
    await this.setState({itens:itens});

    toggle.forEach(b => {
        if(b.value==1) {
            this.toggleButton(b);
        }
    });
}

limitarIngredientes() {
    let qtdIngredientes = 0;
    const item = Array.from(document.querySelectorAll("#item"));
    item.forEach(i => {
        qtdIngredientes += parseInt(i.value);
    })
    return qtdIngredientes;
}

toggleButton (button, qtdIngredientes) {
    if (button.value == 1) {
        button.className = '';
        button.className = ('button-plus toggle');
        button.value = 0;
    } else if (button.value == 0 && qtdIngredientes<8) {
        button.className = '';
        button.className = ('button-remove toggle');
        button.value = 1;
    }
}

incrementIngredientes (button) {
    let increment;
    let limitar = true;
    const qtdIngredientes = this.limitarIngredientes();

    if(button.matches('.toggle')) {
        this.toggleButton(button, qtdIngredientes);
    } else {
        [...button.parentNode.children].forEach(e => {
            if(e.matches('.increment')) {
                increment = e;
            }
            if(e.matches('#item')) {
                limitar = qtdIngredientes<8;
            }
        });

        if(limitar && button.matches('.button-plus')) {
            increment.value = parseInt(increment.value) + 1;
        } else if(increment.value>0 && button.matches('.button-remove')) {
            increment.value = parseInt(increment.value) - 1;
        }
    }
}

adicionarPedido () {
    const qtdPedido = parseInt(document.querySelector('#qtd-pedido').value);
    const notificacao = document.querySelector('.notificacao');
    const notificacaoQtd = document.querySelector('.notificacao__qtd');

    const carrinho = document.querySelector('#icon-carrinho');
    const tooltip = document.querySelector('#tooltip');

    if(qtdPedido!==0) {
        notificacaoQtd.value = parseInt(notificacaoQtd.value) + qtdPedido;
        notificacao.style.display = 'flex';
        tooltip.style.display = 'inline-block';
        this.estadoIngredientes();
    }

    createPopper(carrinho, tooltip, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
    });
}

  render() {
    return (
        <div>
        <header id="header" className="header">
            <a href="#" className="material-icons button-return">
                navigate_before
            </a>

            <div className="header__logo">
                <a href="#"><img id="img-logo" src={Deliverize} alt="" /></a>
            </div>

            <div className="header__endereco">
                <span className="material-icons">expand_more</span>
                <label>Entrega:</label>
                <select>
                    <option value="endereco">R. Antonio Braune, 222</option>
                </select>
            </div>

            <input className="header__busca" placeholder="Busque por estabelecimentos ou produtos" />
            <div className="header__user">
                <span className="icon-user">
                    <img src={IconUser} alt="" />
                </span>
                <a href="#" className="header__link"> Entrar </a>
            </div>
            <div className="header__carrinho" onClick={() => this.hideTooltip()}>
                <span className="icon-carrinho">
                    <div className="notificacao"><input className="notificacao__qtd" value={this.state.itens.notificacaoQtd} readOnly /></div>
                    <img id="icon-carrinho" src={IconCarrinho} alt="" aria-describedby="tooltip"/>
                </span>
                <div id="tooltip" role="tooltip">
                    <div className="popup-header">
                        Adicionado com Sucesso
                    </div>
                    <div className="popup-body">
                        <div style={{marginBottom: '8px', fontSize: '14px', lineHeight: '100%', color: '#BC2E31', fontWeight: 'bold'}}>
                        {this.state.produto.nm_product}
                        </div>
                        <div className ="popup-ingredientes">
                            Ingredientes:
                        <ul style={{padding: '0 16px', margin: '0'}}>
                            <li>1 carne 250g</li>
                            <li className={this.state.itens.itemValue[0]==0 ? 'hide' : ''}>{this.state.itens.itemValue[0]} {this.state.produto.ingredients[0].itens[0].nm_item}</li>
                            <li>1 Bacon</li>
                            <li>Molho Especial</li>
                        </ul>
                        </div>
                    </div>
                    <div id="arrow" data-popper-arrow></div>
                </div>
                <a href="#" className="header__link"> Carrinho </a>
            </div>
        </header>

        <main>
            <div className="produto">
                <section className="section-left">

                    <div className="produto__img">
                        <img style={{maxWidth: '100%'}} src={this.state.produto.url_image} alt="" />
                    </div>

                    <div className="produto__titulo">
                        <h1>
                        {this.state.produto.nm_product}
                         </h1>
                    </div>
                    <p className="produto__descricao">
                        {this.state.produto.description}
                    </p>
                    <div className="produto__preco">
                        <span className="produto__preco--atual">{formatCurrency(this.state.produto.vl_discount)}</span>
                        <span className="produto__preco--antigo">{formatCurrency(this.state.produto.vl_price)}</span>
                    </div>
                </section>

                <section className="section-right">
                    <section className="produto__form">
                        <div className="produto__form-head">
                            <h2>Adicionar Ingredientes</h2>
                            <p>Até {this.state.produto.ingredients[0].max_itens} ingredientes.</p>
                        </div>
                        <div className="produto__form-option">
                            <p>{this.state.produto.ingredients[0].itens[0].nm_item}</p>
                            <div className="produto__form-option--add">
                                <div className="button-increment">
                                    <button className="button-remove" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                                    <input id="item" className="increment" type="number" value='0' min="0" readOnly />
                                    <button className="button-plus" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                                </div>
                            </div>
                            <p className="option-price">+ {formatCurrency(this.state.produto.ingredients[0].itens[0].vl_item)}</p>
                        </div>
                        <hr className="separator" />

                        <div className="produto__form-option">
                            <p>{this.state.produto.ingredients[0].itens[1].nm_item}</p>
                            <div className="produto__form-option--add">
                                <button id="item" value='0' className="button-plus toggle" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                            </div>
                            <p className="option-price">+ {formatCurrency(this.state.produto.ingredients[0].itens[1].vl_item)}</p>
                        </div>
                        <hr className="separator" />

                        <div className="produto__form-option">
                            <p>{this.state.produto.ingredients[0].itens[2].nm_item}</p>
                            <div className="produto__form-option--add">
                                <button id="item" value='0' className="button-plus toggle" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                            </div>
                            <p className="option-price">+ {formatCurrency(this.state.produto.ingredients[0].itens[2].vl_item)}</p>
                        </div>
                        <hr className="separator" />

                        <div className="produto__form-option">
                            <p>{this.state.produto.ingredients[0].itens[3].nm_item}</p>
                            <div className="produto__form-option--add">
                                <div className="button-increment">
                                    <button className="button-remove" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                                    <input id="item" className="increment" type="number" value='0' min="0" readOnly />
                                    <button className="button-plus" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                                </div>
                            </div>
                            <p className="option-price">+ {formatCurrency(this.state.produto.ingredients[0].itens[3].vl_item)}</p>
                        </div>
                        <hr className="separator" />

                        <div className="produto__form-talher">
                            <div className="produto__form-talher-titulo">
                                <h2>Precisa de talher?</h2>
                            </div>

                            <div className='produto__form-talher-option'>
                                <label htmlFor='talher-sim'>Sim</label>
                                <input id="talher-sim" type='radio' name='talher' value='true' required/>
                            </div>
                            
                            <div className='produto__form-talher-option'>
                                <label htmlFor='talher-nao'>Não</label>
                                <input id="talher-nao" type='radio' name='talher' value='false' />
                            </div>
                        </div>
                
                        <div className="produto__form-footer">
                            <div className="button-increment button-increment--footer">
                                <button className="button-remove button-remove--footer" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                                <input id="qtd-pedido" className="increment" type="number" value='0' min="0" readOnly />
                                <button className="button-plus button-plus--footer" onClick={(e) => this.incrementIngredientes(e.target)}></button>
                            </div>
                            <button className="button-adicionar" onClick={()=>this.adicionarPedido()}>Adicionar</button>
                        </div>
                    </section>
                </section>
            </div>
        </main>

    </div>
    );
  }
}

export default Home;