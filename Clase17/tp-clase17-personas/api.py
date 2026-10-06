from flask import Flask, jsonify, request

from models.persona import Persona, PersonaInvalidaError
from services.persona_service import DniDuplicadoError, PersonaService


def create_app() -> Flask:
    """Crea y configura la aplicación Flask.

    Usamos una "app factory" para no tener ni la app ni el servicio
    como variables globales. El servicio se instancia en cada endpoint.
    """
    app = Flask(__name__)
    app.json.ensure_ascii = False  # para que los acentos se vean bien en el JSON

    @app.get("/personas")
    def obtener_personas():
        servicio = PersonaService()
        personas = servicio.obtener_personas()
        return jsonify([persona.to_dict() for persona in personas])

    @app.get("/personas/<int:dni>")
    def obtener_persona(dni):
        servicio = PersonaService()
        persona = servicio.obtener_persona_por_dni(dni)

        if persona is None:
            return jsonify({"error": "Persona no encontrada"}), 404

        return jsonify(persona.to_dict())

    @app.post("/personas")
    def agregar_persona():
        datos = request.get_json(silent=True)

        if not isinstance(datos, dict) or "dni" not in datos or "nombre" not in datos:
            return jsonify({"error": "El body debe ser un JSON con 'dni' y 'nombre'."}), 400

        try:
            persona = Persona(datos["dni"], datos["nombre"])
        except PersonaInvalidaError as error:
            return jsonify({"error": str(error)}), 400

        servicio = PersonaService()
        try:
            servicio.agregar_persona(persona)
        except DniDuplicadoError as error:
            return jsonify({"error": str(error)}), 409

        return jsonify(persona.to_dict()), 201

    return app


if __name__ == "__main__":
    create_app().run(debug=True)
