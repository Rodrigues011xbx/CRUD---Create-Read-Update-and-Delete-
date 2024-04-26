const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const express = require('express');
const app = express();


// Lista que simula banco de dados da aplicação ; 

let users = [
    { id: 0, nome: 'paulo', data_nascimento: '2006-04-18', sexo: "masculino" },
    { id: 1, nome: 'joão', data_nascimento: '2006-04-18', sexo: "masculino" },
    { id: 2, nome: 'marcio', data_nascimento: '2006-04-18', sexo: "masculino" },
]
let id = 2; 


// Configurar o Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar o motor de visualização EJS
app.set('view engine', 'ejs');

app.use(express.static('public')); 

const estadosBrasileiros = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins"
];


// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('list');
});

// Rota para a página de cadastro
app.get('/register', (req,res) => {
    res.render('register');
});

// Rota para a página de cadastro concluído
app.get('/valid', (req,res) => {
    res.render('valid');
});

app.post('/remover/usuario', (req, res) => {
    const userIndex = users.findIndex(user => user.id === req.body.id);
    users.splice(userIndex, 1);
    return res.status(204).json()
});


app.get('/json/usuarios', (req, res) => {
    res.status(200).json(
        users.map(usuario => {
            return {
                id: usuario.id,
                nome: usuario.nome,
                sexo: usuario.sexo,
                data_nascimento: usuario.data_nascimento,
            }
        })
    )
})

app.post('/register', (req, res) => {
    let {
        nome, cpf, data_nascimento, sexo,
        estado_civil, renda_mensal, logradouro,
        numero, estado, cidade
    } = req.body;

    estado_civil = estado_civil.toLowerCase();

    const msg = {};

    if (!nome) { 
        msg.nome = "Nome é requerido"
    } else if (nome.trim() === "") {
        msg.nome = "Não pode haver espaços nesse formato"
    } else if (nome.length < 3) {
        msg.nome = "Nome precisa ter no mínimo 3 letras"
    }

    if (!cpf) {
        msg.cpf = "CPF é requerido"
    } else if (isNaN(cpf)) {
        msg.cpf = "CPF só aceita números"
    } else if (cpf.toString().length !== 11) {
        msg.cpf = "CPF não pode ter mais ou menos que 11 dígitos"
    }

    if (!data_nascimento) {
        msg.data_nascimento = 'Data de nascimento é requerida';
    } else if (!validarData(data_nascimento)) {
        msg.data_nascimento = 'Data de nascimento inválida';
    } else {
        let data_hoje = (new Date()).toISOString().split('T')[0]

        if (data_nascimento >= data_hoje) {
            msg.data_nascimento = 'Data de nascimento deve ser anterior à data atual';
        }
    }

    if (!sexo) {    
        msg.sexo = 'Sexo é requerido';
    }
    else if (sexo !== "masculino" && sexo !== "feminino") {
        msg.sexo = 'Sexo inválido';
    }

    if (!estado_civil) {
        msg.estado_civil = 'Estado civil é requerido';
    } else if (estado_civil !== 'solteiro(a)' && estado_civil !== 'casado(a)' && estado_civil !== 'separado(a)' && estado_civil !== 'divorciado(a)' && estado_civil !== 'viúvo(a)') {
        msg.estado_civil = 'Estado civil incorreto';
    }

    if (!renda_mensal) {
        msg.renda_mensal = 'Renda mensal é requerida'
    } else if (isNaN(renda_mensal)) {
        msg.renda_mensal = 'Renda mensal tem que ser um valor numérico'
    } else if (renda_mensal < 0 || renda_mensal == -0) {
        msg.renda_mensal = 'Renda mensal não pode ser negativa'
    }else if (Number(renda_mensal).toFixed(2) !== renda_mensal) {
        msg.renda_mensal = 'só aceita com duas casas decimais'
    }

    if (!logradouro) {
        msg.logradouro = 'Logradouro é requerido'
    }else if (logradouro.length < 3) {
        msg.logradouro = 'O logradouro deve ter no mínimo 3 caracteres'
    }

    if (!numero) {
        msg.numero = 'Preencha o campo de Número'
    }else if(!Number.isInteger(Number(numero))){
        msg.numero = 'deve-se aceitar apenas números inteiros'
    }

    // obs : Não há restrições para o preechimento do campo de complemento , porém ele está como required ;

    if(!cidade){
        msg.cidade = 'Preencha este campo'
    }else if(cidade.length < 3){
        msg.cidade = 'Mínimo 3 caracteres'
    }else if(!isNaN(cidade)){
        msg.cidade = 'Preecha em formato de texto'
    }

    let veri = estadosBrasileiros.filter((estadoBr)=>{
        if(estado === estadoBr){
            return estado;
        }
    })

    if (!estado) {
        msg.estado = 'Preencha este campo'
    } else if (veri.length === 0) {
        msg.estado = 'Estado inexistente'
    }

    if (Object.keys(msg).length > 0) {
        return res.status(400).json({ mensagem: msg });
    }
    else {
        res.status(200).json();
        users.push({ id:++id , ...req.body });
    }
});

function validarData(dataString) {
    // Verificar se a string de data está no formato correto
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
        return false;
    }

    // Extrair ano, mês e dia da string de data
    var partesData = dataString.split('-');
    var ano = parseInt(partesData[0], 10);
    var mes = parseInt(partesData[1], 10) - 1; // Mês é base 0 (janeiro é 0)
    var dia = parseInt(partesData[2], 10);

    // Criar um objeto Date e verificar se representa a mesma data
    var data = new Date(ano, mes, dia);
    return data.getFullYear() === ano && data.getMonth() === mes && data.getDate() === dia;
}

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});