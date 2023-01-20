
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

async function readTasks() {
  var tb = document.getElementById('tbodyModal');
  tb.innerText = '';

  tasks = []
  clienteName = []
  clienteNames = []
  const logTasks = await db.collection("Clientes").get()


  for (doc of logTasks.docs) {
    tasks.push({
      id: doc.id,
    })

  }

  tasks.forEach((b) => {
    clienteName.push({
      idCliente: b.id
    })

    db.collection(b.id).get().then((doc) => {

      const seq = doc.docs

      seq.forEach((x) => {

        if (x.id == b.id) {
          db.collection(b.id).doc(x.id).delete();
        }
      })
      seq.forEach((e) => {

        var qtdLinhas = tb.rows.length;
        var linha = tb.insertRow(qtdLinhas);

        var cellId = linha.insertCell(0);
        var cellClient = linha.insertCell(1);
        var cellData = linha.insertCell(2);
        var cellTotal = linha.insertCell(3);
        var cellSituacao = linha.insertCell(4);
        const rr = parseFloat(e.data().ValIPI)


        const valT = e.data().ValIPI.toLocaleString('pt-br', { currency: 'BRL', minimumFractionDigits: 2 })
        const valIPI = valT.substring(0, valT.length - 1)

        cellId.innerHTML = e.id
        cellClient.innerHTML = e.data().Cliente
        cellData.innerHTML = e.data().DataCadastro
        cellTotal.innerHTML = `R$ ${valIPI}`
        cellSituacao.innerHTML = e.data().Situacao



      })

    })
  })


}

var menu = document.getElementById('sidebar-toggle')
var page = document.getElementById('page')

menu.addEventListener('click', () => {
  page.classList.toggle("toggled");
})



window.onload = function () {
  getUser()
  readTasks()
}