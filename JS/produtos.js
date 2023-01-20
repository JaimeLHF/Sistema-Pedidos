
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


async function addDataBase() {

    var cod = document.getElementById('codigo')
    var produto = document.getElementById('produto')
    var cor = document.getElementById('cor')
    var peso = document.getElementById('peso')
    var cubagem = document.getElementById('cubagem')

    db.collection("Produtos").doc(cod.value).set({
        Produto: produto.value,
        Cor: cor.value,
        Peso: peso.value,
        Cubagem: cubagem.value
    })

    cod.value = ""
    produto.value = ""
    cor.value = ""
    peso.value = ""
    cubagem.value = ""
    cod.focus()
    readTasks();

}





async function readTasks() {

    tasks = []


    const logTasks = await db.collection("Produtos").get()

    for (doc of logTasks.docs) {
        tasks.push({
            id: doc.id,
            produto: doc.data().Produto,
            cor: doc.data().Cor,
            peso: doc.data().Peso,
            cubagem: doc.data().Cubagem,
        })
        renderTasks()
    }

}


function renderTasks() {

    var tb = document.getElementById('tbodyProducts');
    tb.innerText = '';

    tasks.forEach((e) => {

        // Organiza a table em ordem Alfabética
        tasks.sort( function (a, b) {
         
            return a.id - b.id
        })
        // Organiza a table em ordem Alfabética


        var qtdLinhas = tb.rows.length;
        var linha = tb.insertRow(qtdLinhas);

        var cellId = linha.insertCell(0);
        var cellClient = linha.insertCell(1);
        var cellCnpj = linha.insertCell(2);
        var cellPeso = linha.insertCell(3);
        var cellCub = linha.insertCell(4);
        var editButton = linha.insertCell(5);
        var deleteButton = linha.insertCell(6);

        cellId.innerHTML = e.id
        cellClient.innerHTML = e.produto
        cellCnpj.innerHTML = e.cor
        cellPeso.innerHTML = `${e.peso} Kg`
        cellCub.innerHTML = `${e.cubagem} M³`
        editButton.innerHTML = `<td><button class="btn btn-info btn-sm">Editar</button></td>`
        deleteButton.innerHTML = `<td><button onclick="removeItens()" class="btn btn-danger btn-sm buttDel">Deletar</button></td>`
    })

}

// Remover item da tabela
function removeItens() {

    var tb = document.getElementById('tbodyProducts');

    tb.addEventListener('click', function (event) {
        var elemento = event.target
        if (elemento.classList.contains("buttDel")) {
            var celula = elemento.parentNode
            var linha = celula.parentNode


            swal.fire({
                title: 'Deseja Excluir Produto?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Excluir',
                denyButtonText: `Cancelar`,
            }).then((result) => {   
                if (result.isConfirmed) {
                    linha.remove();
                    readTasks();
                }
            })




        }

    })
}
// Remover item da tabela



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
// Remover item do banco de dados

$(function () {
    $(document).on('click', '.btn-danger', function (e) {
        e.preventDefault;
        var nome = $(this).closest('tr').find('td').eq('0').text().trim();

        swal.fire({
            title: 'Deseja Excluir Produto?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Excluir',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                db.collection("Produtos").doc(nome).delete()
                readTasks();
            }
        })

    });
});
// Remover item do banco de dados



window.onload = function () {
    getUser()
    readTasks()
}
