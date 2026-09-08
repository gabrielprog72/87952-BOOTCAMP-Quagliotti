import pytest

from funciones import num_mayor

def test_lista_ordenada_creciente():
    assert num_mayor([1, 2, 3, 4, 5]) == 5

def test_lista_ordenada_decreciente():
    assert num_mayor([9, 7, 5, 3, 1]) == 9

def test_lista_valores_negativos():
    assert num_mayor([-10, -5, -3, -1]) == -1

def test_lista_mixta():
    assert num_mayor([-2, -8, 0, 4, 7]) == 7

def test_lista_un_elemento():
    assert num_mayor([42]) == 42

def test_lista_repetidos():
    assert num_mayor([3, 3, 3, 3]) == 3

def test_lista_numeros_grandes():
    assert num_mayor([1000000, 999999, 500000]) == 1000000

def test_lista_decimales():
    assert num_mayor([1.5, 2.7, 0.3]) == 2.7

def test_lista_con_ceros():
    assert num_mayor([0, 0, 0]) == 0

def test_lista_mixta_con_cero():
    assert num_mayor([-5, 0, -2]) == 0

def test_num_mayor_lista_vacia():
    assert num_mayor([]) == None