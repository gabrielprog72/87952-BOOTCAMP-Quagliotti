import pytest

from validar_password import validar_password


def password_es_valido(password):
    return validar_password(password)["valid"]


def test_password_valido():
    assert password_es_valido("Segura123!") is True


@pytest.mark.parametrize(
    "password",
    [
        "Seguraaaaa!",
        "1234567890!",
    ],
)
def test_password_debe_contener_numeros_y_letras(password):
    assert password_es_valido(password) is False


def test_password_debe_tener_una_longitud_minima_de_10_caracteres():
    assert password_es_valido("Aa123456!") is False


def test_password_debe_tener_una_longitud_maxima_de_20_caracteres():
    assert password_es_valido("Aa1234567890123456789!") is False


def test_password_debe_tener_al_menos_un_simbolo_especial():
    assert password_es_valido("Segura1234") is False


@pytest.mark.parametrize(
    "password",
    [
        "segura123!",
        "SEGURA123!",
    ],
)
def test_password_debe_tener_mayusculas_y_minusculas(password):
    assert password_es_valido(password) is False


def test_password_no_debe_tener_espacios():
    assert password_es_valido("Segura 123!") is False


def test_password_de_10_caracteres_es_valido():
    assert password_es_valido("Aa1234567!") is True


def test_password_de_20_caracteres_es_valido():
    assert password_es_valido("Aa12345678901234567!") is True
