def validar_password(password):
    if not isinstance(password, str):
        return {
            "valid": False,
            "message": "Password must be a string"
        }

    tiene_numero = any(caracter.isdigit() for caracter in password)
    tiene_letra = any(caracter.isalpha() for caracter in password)
    tiene_mayuscula = any(caracter.isupper() for caracter in password)
    tiene_minuscula = any(caracter.islower() for caracter in password)
    tiene_simbolo = any(
        not caracter.isalnum() and not caracter.isspace()
        for caracter in password
    )
    tiene_espacios = any(caracter.isspace() for caracter in password)
    es_valida = (
        10 <= len(password) <= 20
        and tiene_numero
        and tiene_letra
        and tiene_simbolo
        and tiene_mayuscula
        and tiene_minuscula
        and not tiene_espacios
    )

    return {
        "valid": es_valida,
        "message": "Password is valid" if es_valida else "Password is invalid"
    }