let nome = document.getElementById('nome');
let cpf = document.getElementById('cpf');
let data_nascimento = document.getElementById('data-nascimento');
let masculino = document.getElementById('masculino');
let feminino = document.getElementById('feminino');
let estado_civil = document.getElementById('estado-civil');
let renda_mensal = document.getElementById('renda-mensal');
let logradouro = document.getElementById('logradouro');
let numero = document.getElementById('numero');
let complemento = document.getElementById('complemento');
let cidade = document.getElementById('cidade');
let estado = document.getElementById('estado');

let formulario = document.getElementById('formulario');

let erros = document.getElementsByClassName('erro');

formulario.addEventListener('submit', enviarCadastro);

function enviarCadastro(evento) {
  evento.preventDefault();

  let sexo;

  if (masculino.checked) {
    sexo = masculino.value;
  }
  else {
    sexo = feminino.value;
  }

  let cadastro = {
    nome: nome.value,
    cpf: cpf.value,
    data_nascimento: data_nascimento.value,
    sexo: sexo,
    estado_civil: estado_civil.value,
    renda_mensal: renda_mensal.value,
    logradouro: logradouro.value,
    numero: numero.value,
    complemento: complemento.value,
    cidade: cidade.value,
    estado: estado.value
  }

  let options = {
    method: 'POST',
    body: JSON.stringify(cadastro),
    headers: { 'Content-Type': 'application/json' }
  }

  fetch('/register', options)
    .then(res => res.json())
    .catch(err => err.message = "")
    .then(data => {
      if (data?.mensagem) {
        for (let i = 0; i < erros.length; i++) {
          erros[i].innerText = "";
          erros[i].style.display = "none";
        }
        for (let campo in data.mensagem) {
          let erroTag = document.getElementById('erro_' + campo);
          erroTag.innerText = data.mensagem[campo]
          erroTag.style.display = 'inline-block';
        }
      }
      else {
        window.location.assign('/valid')
      }
    })
}