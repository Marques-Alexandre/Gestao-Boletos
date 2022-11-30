create database boletos;
use boletos;

create table boletos (
idboleto int auto_increment primary key,
numeroVenda int,
dataVenda varchar(20),
valorAPrazo double,
dataVencimento varchar(20),
cpf varchar(11),
nome varchar(100)
);




