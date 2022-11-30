
var idatual = 0;
var modalCadastro;
var modalAlerta;
var nomeParam;
var idParam;


function listar() {
    nomeParam = document.getElementById("nome").value
    fetch("http://127.0.0.1:5000/boletos/" + nomeParam, {method: "GET"})
    .then(response => response.json())
    .then(data => {
       localStorage.dadosLista = JSON.stringify(data);

       window.location.href = "listar";
    })
    .catch(error => console.log("Erro", error));
}

function mostrarPDF() {
    idParam = document.getElementById("numBoleto").value
    fetch("http://127.0.0.1:5000/boletosPDF/" + idParam, {method: "GET"})
    .then(response => response.json())
    .then(data => {

       localStorage.gerarBoleto = JSON.stringify(data);
       window.location.href = "gerarBoleto";
    })
    .catch(error => console.log("Erro", error));
}

function listarDados(){
    var dados = JSON.parse(localStorage.dadosLista)

    console.log(dados)

    for(const item of dados) {
        var tab = document.getElementById("tabela");
        var row = tab.insertRow(-1);
        row.insertCell(-1).innerHTML = item.idboleto;
        row.insertCell(-1).innerHTML = formatarData(item.dataVenda);
        row.insertCell(-1).innerHTML = item.valorAPrazo;
        row.insertCell(-1).innerHTML = formatarData(item.dataVencimento);
    }
}

function listarDadosBoleto() {
    var dados = JSON.parse(localStorage.gerarBoleto)

    console.log(dados)

    for(const item of dados) {
        var tab = document.getElementById("tabelaBoleto");
        var row = tab.insertRow(-1);
        row.insertCell(-1).innerHTML = item.idboleto;
        row.insertCell(-1).innerHTML = item.numeroVenda;
        row.insertCell(-1).innerHTML = formatarData(item.dataVenda);
        row.insertCell(-1).innerHTML = item.valorAPrazo;
        row.insertCell(-1).innerHTML = formatarData(item.dataVencimento);
        row.insertCell(-1).innerHTML = item.cpf;
        row.insertCell(-1).innerHTML = item.nome;
    }
}

function novo() {
    idatual = 0;
    document.getElementById("numVenda").value = "";
    document.getElementById("txtDataVenda").value = "";
    document.getElementById("numValor").value = "";
    document.getElementById("txtDataVencimento").value = "";
    document.getElementById("txtCpf").value = "";
    document.getElementById("txtNome").value = "";

    modalCadastro = new bootstrap.Modal(document.getElementById("modalCadastro"));
    modalCadastro.show();
}

function novoLista() {
    nomeParam = document.getElementById("nome").value = "";
    modalLista = new bootstrap.Modal(document.getElementById("modalLista"));
    modalLista.show();
}

function novoNumeroBoleto() {
    document.getElementById("numBoleto").value = "";
    modalLista = new bootstrap.Modal(document.getElementById("modalBoleto"));
    modalLista.show();
}

function salvar() {
    var b = {	
        idboleto: idatual,
        numeroVenda: document.getElementById("numVenda").value,
        dataVenda: document.getElementById("txtDataVenda").value,
        valorAPrazo: document.getElementById("numValor").value,
        dataVencimento: document.getElementById("txtDataVencimento").value,
        cpf: document.getElementById("txtCpf").value,
        nome: document.getElementById("txtNome").value
    };

    var json = JSON.stringify(b);

    var url;
    var metodo;

    if (idatual == 0){
        url = "http://127.0.0.1:5000/boletos/0";
        metodo = "POST";
    } 
    
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

     fetch(url, {method: metodo, body: json, redirect: 'follow', headers: myHeaders}) 
     .then(result => {
        if (result.status == 200) {
            mostrarAlerta("Cadastro Efetuado com Sucesso", true);
            modalCadastro.hide();
        } else {
            mostrarAlerta("Falha ao inserir dados", false);
        }
    })


}

function mostrarAlerta(msg, success) {
    if (success) {
        document.getElementById("modalAlertaBody").style.backgroundColor = "#E0F2F1";
    } else {
        document.getElementById("modalAlertaBody").style.backgroundColor = "#FFEBEE"
    }
    document.getElementById("modalAlertaBody").innerHTML = msg;
    modalAlerta = new bootstrap.Modal(document.getElementById("modalAlerta"));
    modalAlerta.show();
    window.setTimeout(function(){
        modalAlerta.hide();
    }, 3000);
}

function voltar() {
    window.location.href = "http://127.0.0.1:5000/";
}

function formatarData(databanco) {
	var vetor = databanco.split("-");
	return vetor[2] + '/' + vetor[1] + '/' + vetor[0]; 
}