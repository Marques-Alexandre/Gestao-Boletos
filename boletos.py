
import pymysql
from server import app
from db_config import mysql
from flask import jsonify
from flask import flash, request

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/listar')
def listar():
    return app.send_static_file('listar.html')

@app.route('/gerarBoleto')
def gerarBoleto():
    return app.send_static_file('gerarBoleto.html')

@app.route('/js/<path:path>')
def send_js(path):
    return app.send_static_file('js/' + path)

@app.route("/boletos/<nome>", methods = ['GET', 'POST'])
def boletos(nome):
    try:
            conn=mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            
            if request.method == 'GET':
                
                    sql = '''SELECT idboleto, dataVenda, dataVencimento, valorAPrazo FROM boletos WHERE nome = %s'''
                    val = (nome)
                    cur.execute(sql, val)
                    rows = cur.fetchall()
                    resp = jsonify(rows)
                    resp.status_code=200
                    return resp

                
            elif request.method == 'POST':
                
                obj = request.json
                numeroVenda = obj["numeroVenda"]
                dataVenda = obj["dataVenda"]
                valorAPrazo = obj["valorAPrazo"]
                dataVencimento = obj["dataVencimento"]
                cpf = obj["cpf"]
                nome = obj["nome"]
                
                sql = '''INSERT INTO boletos (numeroVenda, dataVenda, valorAPrazo, dataVencimento, cpf, nome) VALUES (%s, %s, %s, %s, %s, %s)'''
                val = (numeroVenda, dataVenda, valorAPrazo, dataVencimento, cpf, nome)
                
                cur.execute(sql, val)
                conn.commit()
  
                resp = jsonify(obj)
                resp.status_code=200
                return resp
            else:
                return "método desconhecido: " + request.method
                
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()

@app.route("/boletosPDF/<idboleto>", methods = ['GET'])
def boletosPDF(idboleto):
    try:
            conn=mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)

            if request.method == 'GET':
                
                sql = '''SELECT idboleto, numeroVenda, dataVenda, valorAPrazo, dataVencimento, cpf, nome FROM boletos WHERE idboleto = %s'''
                val = (idboleto)
                cur.execute(sql, val)
                rows = cur.fetchall()
                resp = jsonify(rows)
                resp.status_code=200
                return resp
            else:
                return "método desconhecido: " + request.method
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()


@app.errorhandler(404)
def not_found(error=None):
    message = {
            'status':404,
            'message':'Not Found ' + request.url,
            }
            
    resp = jsonify(message)
    resp.status_code = 404
    return resp


if __name__ == "__main__":
    app.run()


