

var firebaseConfig = {
  apiKey: "AIzaSyDh6_fijd6VKOHeo3_lyboPMn6KfLJd-1w",
  authDomain: "db-firebase-5d90c.firebaseapp.com",
  projectId: "db-firebase-5d90c",
  storageBucket: "db-firebase-5d90c.appspot.com",
  messagingSenderId: "210076045087",
  appId: "1:210076045087:web:0dcc5f236fb364d3dc2a2a"
};


firebase.initializeApp(firebaseConfig)


const db = firebase.firestore()

var clientSearch = []
var listClients = []
var produtos = []
let client = document.getElementById('client').value
let pedido = document.getElementById('pedido').value
let cor = document.getElementById('cor').value
let qtd = document.getElementById('qtd').value



// Procura clientes e adiciona na List Select
let list = document.querySelector('[data-js="list"]')
db.collection("Clientes").get().then(
  snapshot => {
    const clientsList = snapshot.docs.reduce((acc, doc) => {
      acc += `<option>${doc.data().clientData}</option>`

      return acc
    }, '')
    list.innerHTML += clientsList
  })
// Procura clientes e adiciona na List Select



function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let userLabel = document.getElementById("navbarDropdown")
      userLabel.innerHTML = user.email
    } else {
      swal
        .fire({
          icon: "success",
          title: "Redirecionando para a tela de autenticação",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("index.html")
          }, 1000)
        })
    }
  })

}


// Retorna os valores do banco de dados para o input automaticamente
function dataAutoComplete() {
  let client = document.getElementById('client').value
  var cnpj = document.getElementById('cnpj')
  var email = document.getElementById('email')
  var contato = document.getElementById('contato')
  var endereco = document.getElementById('endereco')
  var uf = document.getElementById('uf')
  var cidade = document.getElementById('cidade')
  var cep = document.getElementById('cep')


  db.collection("Clientes").doc(client)
    .onSnapshot((doc) => {
      cnpj.value = doc.data().CNPJ
      email.value = doc.data().Email
      contato.value = doc.data().Contato
      endereco.value = doc.data().Endereco
      uf.value = doc.data().UF
      cidade.value = doc.data().Cidade
      cep.value = doc.data().CEP

    })

}
// Retorna os valores do banco de dados para o input automaticamente





async function addDataBase() {


  const cliente = document.getElementById('client').value
  const prazoMedio = document.getElementById('prazoMedio').value
  const pagamento = document.getElementById('pagamento').value
  const dataColeta = document.getElementById('dataColeta').value
  const dataEntrega = document.getElementById('dataEntrega').value
  const pedidoValue = document.getElementById('pedido')


  var qtdSoma = 0;
  var pesototalSoma = 0;
  var cubtotalSoma = 0;
  var valtotalSoma = 0;
 
  $(function () {



    $('.qtd').each(function () {
      qtdSoma += parseFloat(jQuery(this).text());
    });

    $('.peso').each(function () {
      pesototalSoma += parseFloat(jQuery(this).text());
    });

    $('.cub').each(function () {
      cubtotalSoma += parseFloat(jQuery(this).text());
    });

    $('.valorTotal').each(function () {
      valtotalSoma += parseFloat(jQuery(this).text());

    });



    const valIPISoma = valtotalSoma * 0.0325
    const totalIPI = valIPISoma + valtotalSoma
    const t = totalIPI.toLocaleString('pt-br', { currency: 'BRL', minimumFractionDigits: 2 }) 
    
  



  if (pedidoValue.value == "") {
    swal.fire({
      icon: "info",
      title: "Digite o Numero do Pedido!"
    })
  } else {

    const pedido = document.getElementById('pedido').value
    const tb = document.getElementById('tbPessoas')


    // ===========Clienct Search===============================
    db.collection("Clientes").get().then(
      snapshot => {

        snapshot.docs.reduce((listClients, doc) => {


          listClients = `${doc.data().clientData}`
          clientSearch.push(listClients)

        }, '')
        const client = document.getElementById('client').value
        const found = clientSearch.find(element => element == client)

        const result = clientSearch.sort().reduce((init, current) => {
          if (init.length === 0 || init[init.length - 1] !== current) {
            init.push(current);
          }
          return init;
        }, []);
        clientSearch = result



        if (found && tb.rows.length > 1) {
          db.collection(client).doc(pedido).set({
            DataCadastro: new Date().toLocaleDateString(),
            Produtos: produtos,
            PrazoMedio: prazoMedio,
            Pagamento: pagamento,
            DataColeta: dataColeta,
            DataEntrega: dataEntrega,
            Cliente: cliente,
            ValorTotal: valtotalSoma,
            ValIPI: t,
            VolumeTotal: qtdSoma,
            PesoTotal: pesototalSoma,
            CubagemTotal: cubtotalSoma,
            Situacao: "Aberto",
          })
          swal.fire({
            icon: "success",
          }).then(() => {
            setTimeout(() => {
              window.location.replace('relacao.html')
            }, 1000)
          })

        } else if (tb.rows.length == 1) {
          swal.fire({
            icon: "error",
            title: "Não há dados para o pedido!"
          })
        } else if (!found) {
          swal.fire({
            icon: "info",
            title: "Cliente não cadastrado!"
          })
        }

      })
  }
  // ===========Clienct Search===============================
});
}
// Somar itens da tabela e mostrar nos cards


const buttonAdd = document.getElementById('buttonAdd')
const buttDel = document.getElementById('buttDel')




buttonAdd.addEventListener('click', () => {
  
  var qtdtotal = 0;
  var pesototal = 0;
  var cubtotal = 0;
  var valtotal = 0;
 

  $(function () {



    $('.qtd').each(function () {
      qtdtotal += parseFloat(jQuery(this).text());
    });

    $('.peso').each(function () {
      pesototal += parseFloat(jQuery(this).text());
    });

    $('.cub').each(function () {
      cubtotal += parseFloat(jQuery(this).text());
    });

    $('.valorTotal').each(function () {
      valtotal += parseFloat(jQuery(this).text());

    });



    const valIPI = valtotal * 0.0325
    const totalIPI = valIPI + valtotal
    const t = totalIPI.toLocaleString('pt-br', { currency: 'BRL', minimumFractionDigits: 2 })
    const y = valtotal.toLocaleString('pt-br', { currency: 'BRL', minimumFractionDigits: 2 })

    const pe = pesototal.toFixed(2)
    


    $('#count-volumes').html(qtdtotal);
    $('#count-peso').html(pe);
    $('#count-cubagem').html(cubtotal);
    $('#count-valorTotal').html(y);
    $('#count-valorIPI').html(t);
    
  });



})
// Somar itens da tabela e mostrar nos cards

function addScreen() {

  
  let produto = document.getElementById('produto').value
  let cor = document.getElementById('cor').value
  let qtd = document.getElementById('qtd').value
  var tb = document.getElementById('tbodyPedidos');
  let cod = document.getElementById('codigo').value;
  let peso = document.getElementById('peso').value
  let cub = document.getElementById('cubagem').value
  let valueUnit = document.getElementById('valUnit').value
  var valueTotal = document.getElementById('valTotal').value

 

  if (cod == "" || produto == "" || cor == "" || qtd == "" || peso == "" || cub == "" || valueUnit == "") {
    swal
      .fire({
        icon: "error",
        title: "Preencha todos os campos!",
      })
  } else {
    

    const valU = valueUnit.replace(",", ".")
    const v = parseFloat(valU, 2)

    const pesoP = peso.replace(",", ".")
    const p = parseFloat(pesoP, 2)

    const cubC = cub.replace(",", ".")
    const c = parseFloat(cubC, 2)

    var qtdLinhas = tb.rows.length;
    var linha = tb.insertRow(qtdLinhas);

    // produtos.push(`${cod}-${produto}-${cor}-${qtd}-${valueUnit}-${valueTotal}-${peso}-${cub}`)

    produtos.push({
      "Código": cod,
      "Produto": produto,
      "Cor": cor,
      "ValorUnit": v,
      "ValorTotal": valueTotal,
      "Peso": p,
      "Cubagem": c
    })

    var cellCodigo = linha.insertCell(0);
    var cellProduto = linha.insertCell(1);
    var cellCor = linha.insertCell(2);
    var cellQtd = linha.insertCell(3);
    var cellPeso = linha.insertCell(4);
    var cellCub = linha.insertCell(5);
    var cellValorUnit = linha.insertCell(6);
    var cellValorTotal = linha.insertCell(7);
    var editBut = linha.insertCell(8);
    var delBut = linha.insertCell(9);

    cellQtd.setAttribute('class', 'qtd');
    cellPeso.setAttribute('class', 'peso');
    cellCub.setAttribute('class', 'cub');
    cellValorTotal.setAttribute('class', 'valorTotal');




    cellCodigo.innerHTML = cod
    cellProduto.innerHTML = produto
    cellCor.innerHTML = cor
    cellQtd.innerHTML = qtd
    cellPeso.innerHTML = `${p} kg`
    cellCub.innerHTML = `${c} m³`
    cellValorUnit.innerHTML = `R$ ${v}`
    cellValorTotal.innerHTML = valueTotal
    editBut.innerHTML = `<td><button class="btn btn-info btn-sm">Editar</button></td>`
    delBut.innerHTML = `<td><button onclick="rmv(), removeItens()" id="buttDel" class="btn btn-danger btn-sm buttDel">Deletar</button></td>`

    document.getElementById('codigo').value = ""
    document.getElementById('produto').value = ""
    document.getElementById('cor').value = ""
    document.getElementById('qtd').value = ""
    document.getElementById('valUnit').value = ""
    document.getElementById('valTotal').value = ""
    document.getElementById('peso').value = ""
    document.getElementById('cubagem').value = ""


  }
// console.table(produtos)
}



// Remover item da tabela
function removeItens() {

  var tb = document.getElementById('tbodyPedidos');

  tb.addEventListener('click', function (event) {
    var elemento = event.target
    if (elemento.classList.contains("buttDel")) {
      var celula = elemento.parentNode
      var linha = celula.parentNode
      linha.remove();
    }

  })
}
// Remover item da tabela


// Remover item da array - para nao add no banco de dados
function rmv() {

  var tb = document.getElementById('tbodyPedidos')

  for (var i = 0; i < tb.rows.length; i++) {
    tb.rows[i].onclick = function () {
      var index = this.rowIndex;
      var indexRow = index - 1
      produtos.splice(indexRow, 1)
      console.log(produtos)
    }
  }
}
// Remover item da array - para nao add no banco de dados


document.getElementById("buttonAdd").addEventListener("click", () => {
  var cod = document.getElementById("codigo")
  cod.focus()
})





async function readProducts() {

  products = []


  const logTasks = await db.collection("Produtos").get()

  for (doc of logTasks.docs) {
    products.push({
      id: doc.id,
      produto: doc.data().Produto,
      cor: doc.data().Cor
    })

  }

  // Organiza a table em ordem Alfabética
  products.sort(function (a, b) {
    if (a.produto > b.produto) {
      return 1;
    }

    if (a.produto < b.produto) {
      return -1;
    }
    return 0
  })
  // Organiza a table em ordem Alfabética

  products.forEach((e) => {

    var tb = document.getElementById('tbodySearch');
    var qtdLinhas = tb.rows.length;
    var linha = tb.insertRow(qtdLinhas);

    var cellcheckBox = linha.insertCell(0);
    var cellCod = linha.insertCell(1);
    var cellProduto = linha.insertCell(2);
    var cellCor = linha.insertCell(3);

    cellcheckBox.innerHTML = `<input name="contato" type="radio" id="checkbox"  name="checkbox" class="checkbox">`
    cellCod.innerHTML = `<td data-nome=${e.id}>${e.id}</td>`
    cellProduto.innerHTML = e.produto
    cellCor.innerHTML = e.cor

  })


}

// Selecionar o produto no Modal e preenche o Form
function selectProduct() {

  var tb = document.getElementById('tableSearch')
  var cod = document.getElementById('codigo')
  var buttonSearch = document.getElementById('buttSearch')

  tb.addEventListener('click', function (event) {
    var elemento = event.target
    if (elemento.classList.contains("checkbox")) {
      var cell = $(elemento).closest('tr').find('td').eq('1').text().trim();
      buttonSearch.addEventListener('click', function () {
        cod.value = cell
      })
    }
  })

}
// Selecionar o produto no Modal e preenche o Form


// Selecionar somente um checkBox

function dataAutoCompleteProduct() {

  var cod = document.getElementById('codigo').value
  let produto = document.getElementById('produto')
  var cor = document.getElementById('cor')

  if (cod == "") {
    produto.value = ""
    cor.value = ""
  } else {
    db.collection("Produtos").doc(cod)
      .get().then((doc) => {
        if (doc.exists) {
          produto.value = doc.data().Produto
          cor.value = doc.data().Cor
        } else {
          swal
            .fire({
              icon: "info",
              title: "Produto não cadastrado!",
            })
          produto.value = ""
          cor.value = ""
        }
      })
  }
}



// Busca na tabela Produtos


var produtoSearch = document.getElementById("produtoSearch")
var corSearch = document.getElementById("corSearch")
var tb = document.getElementById('tbodySearch')

produtoSearch.addEventListener('input', event => {

  var searchProduto = event.target.value.trim().toLowerCase();
  var linhas = tb.getElementsByTagName('tr')


  for (let posicao in linhas) {
    if (true === isNaN(posicao)) {
      continue;
    }
    let conteudoLinha = linhas[posicao].innerHTML.toLowerCase()
    if (true === conteudoLinha.includes(searchProduto)) {
      linhas[posicao].style.display = '';
    } else {
      linhas[posicao].style.display = 'none';
    }
  }
})

// Busca na tabela Produtos

window.onload = function () {
  getUser()
  readProducts()
  selectProduct()
}