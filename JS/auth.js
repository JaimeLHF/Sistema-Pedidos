
function login() {

    if (firebase.auth().currentUser) {
        firebase.auth().signOut()
    }
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            swal
                .fire({
                    icon: "success",
                    title: "Login Efetuado com Sucesso!"
                })
                .then(() => {
                    setTimeout(() => {
                        window.location.replace('relacao.html')
                    }, 1000)
                })
        })
        .catch((error) => {
            const erroCode = error.code

            switch (erroCode) {
                case "auth/wrong-password":
                    swal.fire({
                        icon: "error",
                        title: "Senha Inválida!",
                    })
                    break

                case "auth/invalid-email":
                    swal.fire({
                        icon: "error",
                        title: "Email Inválido!",
                    })
                    break

                default:
                    swal.fire({
                        icon: "error",
                        title: error.message,
                    })
            }
        })

}