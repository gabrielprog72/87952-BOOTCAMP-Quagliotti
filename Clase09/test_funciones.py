from funciones import num_mayor
# def test_num_mayor():
#     assert num_mayor([1, 2, 3, 4, 5]) == 5
#     assert num_mayor([-1, -2, -3, -4, -5]) == -1

# def test_sumar_positivo_y_negativo():
#     assert sumar(5, -2) == 3

# def test_sumar_con_cero():
#     assert sumar(5, 0) == 5
# def test_sumar_cero_y_cero():
#     assert sumar(0, 0) == 0
assert num_mayor([1, 2, 3, 4, 5]) == 5
assert num_mayor([9, 7, 5, 3, 1]) == 9
assert num_mayor([-10, -5, -3, -1]) == -1
assert num_mayor([-2, -8, 0, 4, 7]) == 7
assert num_mayor([42]) == 42
assert num_mayor([3, 3, 3, 3]) == 3
assert num_mayor([1000000, 999999, 500000]) == 1000000
assert num_mayor([1.5, 2.7, 0.3]) == 2.7
