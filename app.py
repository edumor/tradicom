from flask import Flask, request, render_template, jsonify, make_response
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
from threading import Thread

# Load environment variables
load_dotenv()

# Debugging: Print environment variables
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_PORT = os.getenv('EMAIL_PORT')
EMAIL_DESTINATARIO = os.getenv('EMAIL_DESTINATARIO')
EMAIL_DESTINATARIO_CC = os.getenv('EMAIL_DESTINATARIO_CC')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS')
EMAIL_ASUNTO = os.getenv('EMAIL_ASUNTO')

# Debugging: Print loaded environment variables
print(f"EMAIL_HOST: {EMAIL_HOST}")
print(f"EMAIL_HOST_USER: {EMAIL_HOST_USER}")
print(f"EMAIL_HOST_PASSWORD: {EMAIL_HOST_PASSWORD}")
print(f"EMAIL_PORT: {EMAIL_PORT}")
print(f"EMAIL_DESTINATARIO: {EMAIL_DESTINATARIO}")
print(f"EMAIL_DESTINATARIO_CC: {EMAIL_DESTINATARIO_CC}")
print(f"EMAIL_USE_TLS: {EMAIL_USE_TLS}")
print(f"EMAIL_ASUNTO: {EMAIL_ASUNTO}")


app = Flask(__name__)

@app.route('/')
def index():
    resp = make_response(render_template('index.html'))
    resp.set_cookie('my_cookie', 'cookie_value', samesite='Lax')
    return resp

def send_async_email(app, msg, remitente, destinatarios, password):
    with app.app_context():
        try:
            server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
            if EMAIL_USE_TLS.lower() == 'true':
                server.starttls()
            server.login(remitente, password)
            server.sendmail(remitente, destinatarios, msg.as_string())
            server.quit()
        except Exception as e:
            print(f"Error al enviar el correo: {str(e)}")
            raise

@app.route('/send_email', methods=['POST'])
def send_email():
    nombre = request.form.get('nombre')
    empresa = request.form.get('empresa')
    cargo = request.form.get('cargo')
    email = request.form.get('email')
    telefono = request.form.get('telefono')
    mensaje = request.form.get('mensaje')

    if not all([nombre, email, telefono, mensaje]):
        return jsonify({"message": "Campos Obligatorios no ingresados."}), 400

    remitente = EMAIL_HOST_USER
    password = EMAIL_HOST_PASSWORD
    destinatario = EMAIL_DESTINATARIO
    destinatario_cc = EMAIL_DESTINATARIO_CC
    asunto = EMAIL_ASUNTO

    if not remitente or not password:
        return jsonify({"message": "Error en la configuración del servidor SMTP."}), 500

    msg = MIMEMultipart()
    msg['From'] = remitente
    msg['To'] = destinatario
    if destinatario_cc:
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

    destinatarios = list(set([destinatario] + ([destinatario_cc] if destinatario_cc else [])))

    Thread(target=send_async_email, args=(app, msg, remitente, destinatarios, password)).start()
    return jsonify({"message": "Gracias por ponerse en contacto con Tradicom S.A. nos comunicaremos con ud. a la brevedad"}), 200

if __name__ == '__main__':
    app.run(debug=True)
