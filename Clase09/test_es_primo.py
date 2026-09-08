import pytest

from es_primo import es_primo


@pytest.mark.parametrize("numero", [1, 4, 9, 15, 21])
def test_numero_que_no_es_primo_devuelve_false(numero):
    assert es_primo(numero) is False


@pytest.mark.parametrize("numero", [2, 3, 13])
def test_numeros_primos_devuelven_true(numero):
    assert es_primo(numero) is True


def test_si_se_pasa_un_string_devuelve_false():
    assert es_primo("13") is False
