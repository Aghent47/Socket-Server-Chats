
const miFormulario = document.querySelector('form');

const url = (window.location.origin.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://rest-server-actualizado-production.up.railway.app/api/auth/';


// evitar el refresh del navegador web
miFormulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = {};

    for(let el of miFormulario.elements){
        if(el.name.length > 0)
            formData[el.name] = el.value;
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then( ({msg, token}) => {
            if(msg){
                return console.error(msg);
            }
            localStorage.setItem('token', token),
            window.location = 'chat.html';
        })
        .catch( err => {
            console.log(err);
        })
});

function handleCredentialResponse(response) {

    // Google Token 
    // console.log('ID_TOKEN', response.credential);
    const body = {id_token: response.credential}

    fetch( url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then( ({ token }) => {
            
            localStorage.setItem('token', token);
            console.log('Token Guardado en el LocalStorage:', token);
            window.location = 'chat.html';
        })
        .catch(err => {
            console.log(err);
        });
        
    }


    const button = document.getElementById('google_Sing_out');
    button.onclick = () => {

        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke( localStorage.getItem( 'mail' ), done => {

            localStorage.clear();
            location.reload();

        });
    }
