from flask import Flask, request, render_template, jsonify, make_response
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
from threading import Thread

# Recuperar las variables de entorno
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    resp = make_response(render_template('Index.html'))
    resp.set_cookie('my_cookie', 'cookie_value', samesite='Lax')  # Configura SameSite para Lax o Strict
    return resp

def send_async_email(app, msg, remitente, destinatarios, password):
    with app.app_context():
        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(remitente, password)
            server.sendmail(remitente, destinatarios, msg.as_string())
            server.quit()
        except Exception as e:
            print(f"Error al enviar el correo: {str(e)}")

@app.route('/send_email', methods=['POST'])
def send_email():
    nombre = request.form.get('nombre')
    empresa = request.form.get('empresa')
    cargo = request.form.get('cargo')
    email = request.form.get('email')
    telefono = request.form.get('telefono')
    mensaje = request.form.get('mensaje')

    # chequea que existan todos los campos del formulario que son obligatorios
    if not all([nombre, email, telefono, mensaje]):
        return jsonify({"message": "Campos Obligatorios no ingresados."}), 400

    # SMTP configuracion del servidor
    remitente = os.getenv('USER')
    password = os.getenv('PASSWORD')
    destinatario = os.getenv('DESTINATARIO')
    destinatario_cc = os.getenv('DESTINATARIO_CC')  # Puede ser opcional
    asunto = os.getenv('ASUNTO')

    # chequea que exista la configuración del servidor SMTP
    if not remitente or not password:
        return jsonify({"message": "Error en la configuración del servidor SMTP."}), 500

    # Gererar el cuerpo del mensaje
    msg = MIMEMultipart()
    msg['From'] = remitente
    msg['To'] = destinatario
    msg['Cc'] = destinatario_cc  
    msg['Subject'] = asunto

    body = f"""
    Nombre: {nombre}
    Empresa: {empresa}
    Cargo: {cargo}
    Email: {email}
    Teléfono: {telefono}
    Mensaje: {mensaje}
    """
    msg.attach(MIMEText(body, 'plain'))

    # Crear lista de destinatarios sin duplicados
    destinatarios = list(set([destinatario] + ([destinatario_cc] if destinatario_cc else [])))

    # Enviar el correo de manera asíncrona
    Thread(target=send_async_email, args=(app, msg, remitente, destinatarios, password)).start()
    return jsonify({"message": "Gracias por ponerse en contacto con Tradicom S.A. nos comunicaremos con ud. a la brevedad"}), 200

if __name__ == '__main__':
    app.run(debug=True)