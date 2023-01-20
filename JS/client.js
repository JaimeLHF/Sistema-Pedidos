
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
let tasks = []



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

function createDelButton(task) {
  const newButton = document.createElement("button")
  newButton.setAttribute("class", "btn btn-primary")
  newButton.appendChild(document.createTextNode("Excluasadasdir"))
  newButton.setAttribute("onclick", `deleteTask("${task.id}")`)
  return newButton
}



function renderTasks() {

  let itemList = document.getElementById('tbodyRel')

  itemList.innerHTML = ""

  tasks.forEach((e) => {

    var tb = document.getElementById('tbodyRel');
    var qtdLinhas = tb.rows.length;
    var linha = tb.insertRow(qtdLinhas);


    var cellCod = linha.insertCell(0);
    var cellCNPJ = linha.insertCell(1);
    var cellContato = linha.insertCell(2);
    var cellUF = linha.insertCell(3);
    var cellCidade = linha.insertCell(4);
    var cellData = linha.insertCell(5);
    var cellAcoes = linha.insertCell(6);


    cellCod.innerHTML = `<td>${e.id}</td>`
    cellCNPJ.innerHTML = `<td>${e.CNPJ}</td>`
    cellContato.innerHTML = `<td>${e.Contato}</td>`
    cellUF.innerHTML = `<td>${e.UF}</td>`
    cellCidade.innerHTML = `<td>${e.Cidade}</td>`
    cellData.innerHTML = `<td>${e.DataCadastro}</td>`
    cellAcoes.innerHTML = `<td><button type="button" class="btn btn-primary btnSelect" data-bs-toggle="modal" style="background: transparent; border: none;" data-bs-target="#exampleModalCenter"><img src="img/procurando.png"
    id="iconButtonZoom" style="width: 30%;" alt="Search"></button></td>`
  })



  // Ler o id na primeira coluna da tabela e adiciona no Modal -- with jQuery --
  $(document).ready(function () {

    $(".btnSelect").on('click', function () {

      pedidos = []

      var clientModal = document.getElementById('clientModal')

      var currentRow = $(this).closest("tr");
      var col1 = currentRow.find("td:eq(0)").html();

      clientModal.value = col1

      var tb = document.getElementById('tbodyModal');
      tb.innerHTML = ""

      db.collection(col1).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          pedidos.push({
            id: doc.id,
            Cliente: doc.data().Cliente,
            Data: doc.data().DataCadastro,
            Total: doc.data().ValIPI,
            Situacao: doc.data().Situacao
          })

         
        })

        if (pedidos.length == 0) {
          const noPedido = document.getElementById('noPedido')
          noPedido.style.display = "flex"

        } else {

         

          noPedido.style.display = "none"
          pedidos.forEach((e) => {
            const valIPI = e.Total.substring(0, e.Total.length - 1)
         
            var qtdLinhas = tb.rows.length;
            var linha = tb.insertRow(qtdLinhas);

            var cellPedido = linha.insertCell(0);
            var cellCliente = linha.insertCell(1);
            var cellData = linha.insertCell(2);
            var cellTotal = linha.insertCell(3);
            var cellSituacao = linha.insertCell(4);
            var cellAction = linha.insertCell(5);


            cellPedido.innerHTML = e.id
            cellCliente.innerHTML = e.Cliente
            cellData.innerHTML = e.Data
            cellTotal.innerHTML = `R$ ${valIPI}`
            cellSituacao.innerHTML = e.Situacao
            cellAction.innerHTML = `<td><button type="button" class="btn btn-primary" style="background: transparent; border: none;"><img src="img/procurando.png"
          style="width: 30%;" alt="Search"></button></td>`
          })
        }

      })


      var delButton = document.getElementById('delButton')

      delButton.addEventListener('click', () => {
        swal.fire({
          title: 'Deseja Excluir Cliente?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Excluir',
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            db.collection("Clientes").doc(col1).delete().then(() => {
              Swal.fire('Cliente Excluído', '', 'success').then(() => {
                window.location.replace('client.html')
              })
            })
          }
        })
      })


      var cnpj = document.getElementById('cnpjModal')
      var emailModal = document.getElementById('emailModal')
      var contatoModal = document.getElementById('contatoModal')
      var ufModal = document.getElementById('ufModal')
      var cepModal = document.getElementById('cepModal')
      var cidadeModal = document.getElementById('cidadeModal')
      var enderecoModal = document.getElementById('enderecoModal')

      db.collection("Clientes").doc(col1)
        .onSnapshot((doc) => {
          cnpj.value = doc.data().CNPJ
          emailModal.value = doc.data().Email
          contatoModal.value = doc.data().Contato
          ufModal.value = doc.data().UF
          cepModal.value = doc.data().CEP
          cidadeModal.value = doc.data().Cidade
          enderecoModal.value = doc.data().Endereco

        })


    });

  });
  // Ler o id na primeira coluna da tabela e adiciona no Modal -- with jQuery --
}


async function readTasks() {

  tasks = []

  const logTasks = await db.collection("Clientes").get()

  for (doc of logTasks.docs) {
    tasks.push({
      id: doc.id,
      CNPJ: doc.data().CNPJ,
      Email: doc.data().Contato,
      Contato: doc.data().Contato,
      Cidade: doc.data().Cidade,
      UF: doc.data().UF,
      CEP: doc.data().CEP,
      endereco: doc.data().Endereco,
      DataCadastro: doc.data().DataCadastro
    })

  }
  renderTasks()
}

function addTasks() {

  tasks = []

  let client = document.getElementById('client')
  let cnpj = document.getElementById('cnpj')
  let email = document.getElementById('email')
  let contato = document.getElementById('contato')
  let cidade = document.getElementById('cidade')
  let uf = document.getElementById('uf')
  let cep = document.getElementById('cep')
  let endereco = document.getElementById('endereco')



  if (client.value == "" || cnpj.value == "" || email.value == "" || contato.value == "" || cidade.value == "" || uf.value == "" || cep.value == "" || endereco.value == "") {
    swal
      .fire({
        icon: "error",
        title: "Preencha todos os campos!",
      })
  } else {


    // Adiciona os dados do cliente.value na Collection Clientes
    db.collection("Clientes").doc(client.value).set({
      clientData: client.value,
      CNPJ: cnpj.value,
      Email: email.value,
      Contato: contato.value,
      Cidade: cidade.value,
      UF: uf.value,
      CEP: cep.value,
      Endereco: endereco.value,
      DataCadastro: new Date().toLocaleDateString()
    })
    // Adiciona os dados do cliente na Collection Clientes




    readTasks()
  }
}



window.onload = function () {
  getUser();
  readTasks();
}

let client = document.getElementById('client')

function historyChanges() {
  db.collection(client.value).where("clientData", "==", client.value)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New city: ", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("CNPJ alterado para:", change.doc.data().CNPJ);
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
        }
      });
    });
}


var editButton = document.getElementById('editButton')
var delButton = document.getElementById('delButton')
var okButton = document.getElementById('okButton')
var apliButton = document.getElementById('apliButton')
var cancelButton = document.getElementById('cancelButton')

editButton.addEventListener('click', () => {
  editButton.style.display = "none";
  delButton.style.display = "none";
  okButton.style.display = "none";
  apliButton.style.display = "inline-block";
  cancelButton.style.display = "inline-block";


  var cnpjModal = document.getElementById('cnpjModal')
  var emailModal = document.getElementById('emailModal')
  var contatoModal = document.getElementById('contatoModal')
  var ufModal = document.getElementById('ufModal')
  var cepModal = document.getElementById('cepModal')
  var cidadeModal = document.getElementById('cidadeModal')
  var enderecoModal = document.getElementById('enderecoModal')

  cnpjModal.removeAttribute("readonly")
  emailModal.removeAttribute("readonly")
  contatoModal.removeAttribute("readonly")
  ufModal.removeAttribute("readonly")
  cepModal.removeAttribute("readonly")
  cidadeModal.removeAttribute("readonly")
  enderecoModal.removeAttribute("readonly")
})

let clientModal = document.getElementById('clientModal')



apliButton.addEventListener('click', () => {
  db.collection("Clientes").doc(clientModal.value).update({
    clientData: clientModal.value,
    CNPJ: cnpjModal.value,
    Email: emailModal.value,
    Contato: contatoModal.value,
    Cidade: cidadeModal.value,
    UF: ufModal.value,
    CEP: cepModal.value,
    Endereco: enderecoModal.value,
    DataAlteracao: new Date().toLocaleDateString()
  }).then(() => {
    swal.fire({
      icon: "success",
      title: "Alteração Aplicada!"
    })
  }).then(() => {
    setTimeout(() => {
      window.location.replace('client.html')
    }, 1000)
  })
})

cancelButton.addEventListener('click', () => {
  editButton.style.display = "inline-block";
  delButton.style.display = "inline-block";
  okButton.style.display = "inline-block";
  apliButton.style.display = "none";
  cancelButton.style.display = "none";


  var cnpjModal = document.getElementById('cnpjModal')
  var emailModal = document.getElementById('emailModal')
  var contatoModal = document.getElementById('contatoModal')
  var ufModal = document.getElementById('ufModal')
  var cepModal = document.getElementById('cepModal')
  var cidadeModal = document.getElementById('cidadeModal')
  var enderecoModal = document.getElementById('enderecoModal')

  cnpjModal.setAttribute("readonly", true)
  emailModal.setAttribute("readonly", true)
  contatoModal.setAttribute("readonly", true)
  ufModal.setAttribute("readonly", true)
  cepModal.setAttribute("readonly", true)
  cidadeModal.setAttribute("readonly", true)
  enderecoModal.setAttribute("readonly", true)
})

var addButton = document.getElementById('addButton')


addButton.addEventListener('click', () => {
  if (client.value == "") {
    client.style.borderColor = "red"
  }

  if (cnpj.value == "") {
    cnpj.style.borderColor = "red"
  }

  if (email.value == "") {
    email.style.borderColor = "red"
  }

  if (contato.value == "") {
    contato.style.borderColor = "red"
  }
  if (cidade.value == "") {
    cidade.style.borderColor = "red"
  }
  if (uf.value == "") {
    uf.style.borderColor = "red"
  }
  if (cep.value == "") {
    cep.style.borderColor = "red"
  }
  if (endereco.value == "") {
    endereco.style.borderColor = "red"
  }

  if (client.value == "" || cnpj.value == "" || email.value == "" || contato.value == "" || cidade.value == "" || uf.value == "" || cep.value == "" || endereco.value == "") {
    swal
      .fire({
        icon: "error",
        title: "Preencha todos os campos!",
      })
  }

  client.addEventListener('keypress', () => {
    if (client.value.length >= 1) {
      client.style.borderColor = "green"
    }
  })
  cnpj.addEventListener('keypress', () => {
    if (cnpj.value.length >= 1) {
      cnpj.style.borderColor = "green"
    }
  })
  email.addEventListener('keypress', () => {
    if (email.value.length >= 1) {
      email.style.borderColor = "green"
    }
  })
  contato.addEventListener('keypress', () => {
    if (contato.value.length >= 1) {
      contato.style.borderColor = "green"
    }
  })
  cidade.addEventListener('keypress', () => {
    if (cidade.value.length >= 1) {
      cidade.style.borderColor = "green"
    }
  })
  uf.addEventListener('keypress', () => {
    if (uf.value.length >= 1) {
      uf.style.borderColor = "green"
    }
  })
  cep.addEventListener('keypress', () => {
    if (cep.value.length >= 1) {
      cep.style.borderColor = "green"
    }
  })
  endereco.addEventListener('keypress', () => {
    if (endereco.value.length >= 1) {
      endereco.style.borderColor = "green"
    }
  })

})




