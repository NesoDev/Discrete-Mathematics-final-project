from datetime import datetime, timedelta
import math
import fitz
import re
import os
import tempfile
from itertools import groupby
from operator import itemgetter

days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

def leerPDF(filePDF):
    print("-- LEYENDO EL PDF --")
    json_data = []
    patterns = [r'INO\d{3}', r'202W\d{4}']

    try:
        # Guardamos el archivo temporalmente
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, filePDF.filename)
        filePDF.save(temp_path)

        # Abrimos el archivo
        with fitz.open(temp_path) as pdf_document:
            for page_num in range(len(pdf_document)):
                page = pdf_document[page_num]

                lines = page.get_text("text").splitlines()

                for line_number, line in enumerate(lines, start=1):
                    for pattern in patterns:
                        coincidences = re.finditer(pattern, line)
                        for _ in coincidences:
                            line_next = lines[line_number] if line_number < len(lines) else None

                            course = {
                                "nombre": line_next,
                                "secciones": [
                                    {   
                                        "id": 0,
                                        "teoria": {
                                            "dia": "",
                                            "inicio": "00:00",
                                            "fin": "00:00"
                                        },
                                        "practica": {
                                            "dia": "",
                                            "inicio": "00:00",
                                            "fin": "00:00"
                                        },
                                        "preferencia": 0
                                    }
                                ]
                            }
                            print(course)
                            json_data.append(course)

    except Exception as e:
        print(f"Error al procesar el PDF: {str(e)}")
    finally:
        # Eliminamos el archivo temporal
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)

    return json_data

def convertirJSONaDiccionario(json):
    diccionario = {}
    for curso in json:
        nommbre_curso = curso['nombre']
        diccionario[nommbre_curso] = {}
        for seccion in curso['secciones']:
            nombre_seccion = str(int(seccion['id']) + 1)
            diccionario[nommbre_curso][nombre_seccion] = {
                "teoria": {
                    "dia": seccion['teoria']['dia'],
                    "inicio": seccion['teoria']['inicio'],
                    "fin": seccion['teoria']['fin'],
                },
                "practica": {
                    "dia": seccion['practica']['dia'],
                    "inicio": seccion['practica']['inicio'],
                    "fin": seccion['practica']['fin'],
                },
                "preferencia": seccion['preferencia']
            }

    return diccionario

class Curso:
    def __init__(self, nombre):
        self.nombre = nombre
        self.secciones = []

    def addSection(self, section):
        self.secciones.append(section)

class Seccion:
    def __init__(self, nombre, numero, teoria, practica, preferencia):
        self.curso = nombre
        self.numero = numero
        self.clases = [teoria, practica]
        self.preferencia = preferencia

    def seCruza(self, combinacion):
        for seccion1 in combinacion:
            for seccion2 in combinacion:
                if seccion1 != seccion2:
                    for clase1 in seccion1.clases:
                        for clase2 in seccion2.clases:
                            if (clase1.dia == clase2.dia and
                                clase1.hora[0] < clase2.hora[1] and
                                clase1.hora[1] > clase2.hora[0]):
                                return True
        return False


class Clase:
    def __init__(self, tipo, dia, inicio, fin):
        self.tipo = tipo
        self.dia = dia
        self.hora = [datetime.strptime(inicio, "%H:%M").time(), datetime.strptime(fin, "%H:%M").time()]

def leerDiccionario(diccionario):
    cursos = []
    for curso, secciones in diccionario.items():
        course = Curso(curso)
        for seccion, detalles in secciones.items():
            teoria = Clase("teoria", detalles["teoria"]["dia"], detalles["teoria"]["inicio"], detalles["teoria"]["fin"])
            practica = Clase("practica", detalles["practica"]["dia"], detalles["practica"]["inicio"], detalles["practica"]["fin"])
            section = Seccion(curso, seccion, teoria, practica, detalles["preferencia"])
            course.addSection(section)
        cursos.append(course)
    return cursos

def generarCombinaciones(cursos):
    combinaciones = []
    num_cursos = len(cursos)
    indices = [0] * num_cursos
    while indices[0] < len(cursos[0].secciones):
        combinacion = [curso.secciones[indices[i]] for i, curso in enumerate(cursos)]
        combinaciones.append(combinacion)
        indices[-1] += 1
        for i in range(num_cursos - 1, 0, -1):
            if indices[i] == len(cursos[i].secciones):
                indices[i] = 0
                indices[i - 1] += 1
    return combinaciones

def filtrarCombinacionesValidas(combinaciones):
    combinaciones_validas = []
    for combinacion in combinaciones:
        es_valida = True
        for seccion in combinacion:
            if seccion.seCruza(combinacion):
                es_valida = False
                break
        if es_valida:
            combinaciones_validas.append(combinacion)
    return combinaciones_validas

def ordenarCombinacionesPorPromedios(combinaciones):
    promedios = []
    for combinacion in combinaciones:
        suma = 0
        for seccion in combinacion:
            suma += int(seccion.preferencia)
        promedio = suma / len(combinacion)
        promedios.append([combinacion, promedio])
    promedios.sort(key=lambda x: x[1], reverse=True)
    combinaciones = [arreglo[0] for arreglo in promedios]
    return combinaciones

def generarHorarios(json):
   diccionario = convertirJSONaDiccionario(json)
   cursos = leerDiccionario(diccionario)
   combinaciones = generarCombinaciones(cursos)
   combinaciones_validas = filtrarCombinacionesValidas(combinaciones)
   combinaciones_ordenadas = ordenarCombinacionesPorPromedios(combinaciones_validas)
   
   return combinaciones_ordenadas

def convertirListaAJson(lista):
    json_data = []
    for horario in lista:
        schedule = [
        ]
        for seccion in horario:
            course = {
                "nombre": seccion.curso,
                "seccion": seccion.numero,
                "teoria": {
                    "dia": seccion.clases[0].dia,
                    "inicio": seccion.clases[0].hora[0].strftime("%H:%M"),
                    "fin": seccion.clases[0].hora[1].strftime("%H:%M")
                },
                "practica": {
                    "dia": seccion.clases[1].dia,
                    "inicio": seccion.clases[1].hora[0].strftime("%H:%M"),
                    "fin": seccion.clases[1].hora[1].strftime("%H:%M")
                }
            }
            schedule.append(course)
        json_data.append(schedule)
    
    return json_data

def ordenarPorHoraYDia(item):
    init_hour = datetime.strptime(item['inicio'], '%H:%M')
    day = [
        'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
    ].index(item['dia'])
    
    return (init_hour, day)

def ordenarPorDias(dia):
    return days.index(dia)

"""def ordenarPorHoraInicio(grupo):
    return datetime.strptime(grupo[0]['inicio'], "%H:%M")"""

def compararHoraInicio(grupo):
    time_str = grupo[0]['inicio']
    date_obj = datetime.strptime(time_str, '%H:%M')
    return date_obj

def ordenarPorHoraInicio(lista):
    return sorted(lista, key=compararHoraInicio)

def eliminarDiccionariosConMismoDia(grupos_originales, horario_modificado):
    for i, original_group in enumerate(grupos_originales):
        dictionarys_with_name = [dictionary for dictionary in original_group if dictionary['nombre'] != ""]
        print(f"- GRUPO ORIGINAL {i}:")
        print(original_group)
        for k, dictionary in enumerate(dictionarys_with_name):
            print(f"   DICCIONARIO {k}:")
            print(f"   {dictionary}")
            day = dictionary['dia']
            print(f"   ELIMINAREMOS LOS DIAS {day} DE LOS SIGUIENTES {dictionary['row']-1} GRUPOS MODIFICADOS")
            dictionarys_remove = []
            for j in range(0, int(dictionary['row']-1)):
                index_offset = horario_modificado.index(grupos_originales[i])
                group_evaluate = horario_modificado[index_offset + 1 + j]
                dictionary_remove = next((dictionary_evaluate for dictionary_evaluate in group_evaluate if dictionary_evaluate['dia'] == day), None)
                if dictionary_remove != None:
                    dictionarys_remove.append(group_evaluate.index(dictionary_remove))
                    group_evaluate.remove(dictionary_remove)
            if len(dictionarys_remove) != 0:
                print(f"   SE ELIMINARON LOS DICCIONARIOS {dictionarys_remove} DEL GRUPO {index_offset + 1 + j}")
            else:
                print(f"   NO SE ELIMINARON DICCIONARIOS DEL GRUPO {index_offset + 1 + j}")

    return horario_modificado



def convertirListaAJsonModified(lista):
    json_data = []
    
    for i, horario in enumerate(lista):
        horario_nuevo = []
        for j, seccion in enumerate(horario):
            for k in range(len(seccion.clases)):
                lesson = {
                    "id": f"{i}-{j}",
                    "nombre": f"{seccion.curso} S{seccion.numero} ({'T' if k == 0 else 'P'})",
                    "dia": seccion.clases[k].dia,
                    "row": int((seccion.clases[k].hora[1].hour * 60 + seccion.clases[k].hora[1].minute - 
                                seccion.clases[k].hora[0].hour * 60 - seccion.clases[k].hora[0].minute) / 60),
                    "inicio": seccion.clases[k].hora[0].strftime("%H:%M"),
                    "fin": seccion.clases[k].hora[1].strftime("%H:%M")
                }
                horario_nuevo.append(lesson)

        horario_nuevo.sort(key=ordenarPorHoraYDia)

        horario_modificado = []
        row = [list(g) for _, g in groupby(horario_nuevo, key=itemgetter('inicio'))]

        for group in row:
            day_of_group = {lesson['dia'] for lesson in group}

            for dia in days:
                if dia not in day_of_group:
                    cell = {
                        'id': '*',
                        'nombre': '',
                        'dia': dia,
                        'row': 1,
                        'inicio': group[0]['inicio'],
                        'fin': (datetime.strptime(group[0]['inicio'], "%H:%M") + timedelta(hours=1)).strftime("%H:%M")
                    }
                    group.append(cell)
                    
            group.sort(key=lambda cell: days.index(cell['dia']))
            horario_modificado.append(group)

        for i in range(len(row)):  # Ajuste aquí
            fin_actual = (datetime.strptime(row[i][0]['inicio'], "%H:%M") + timedelta(hours=1)).strftime("%H:%M")
            inicio_siguiente = row[i + 1][0]['inicio'] if (i < len(row)-1) else max(datetime.strptime(cell['fin'], "%H:%M") for cell in row[-1]).strftime("%H:%M")

            # Hacemos un bucle siempre y cuando exista un espacio entre los grupos
            while fin_actual < inicio_siguiente:
                # Crear un nuevo grupo con 7 diccionarios para cada día de la semana
                new_group = [
                    {
                        'id': '*',
                        'nombre': '',
                        'dia': dia,
                        'row': 1,
                        'inicio': fin_actual,
                        'fin': (datetime.strptime(fin_actual, "%H:%M") + timedelta(hours=1)).strftime("%H:%M")
                    }
                    for dia in days
                ]

                horario_modificado.append(new_group)
                fin_actual = (datetime.strptime(fin_actual, "%H:%M") + timedelta(hours=1)).strftime("%H:%M")
        horario_modificado = ordenarPorHoraInicio(horario_modificado)
        horario_modificado = eliminarDiccionariosConMismoDia(row, horario_modificado)
        json_data.append(horario_modificado)
    
        #print(f"Grupos originales: {row}")

    return json_data

#-------------------------------------------------------------------------

class Node:
    def __init__(self, index, position, ids_nodes_adjacent):
        self.index = index
        self.position = position
        self.paths = []
        self.ids_nodes_adjacent = ids_nodes_adjacent
        self.nodes_adjacent = []
        self.routes = [[index]]
        self.state = True
        self.visited = False
        self.visited_reverse = False
    
    def clean_paths(self):
        self.paths = list(filter(self.min_distance, self.paths))
    
    def min_distance(self, path):
        min_distance = min([p[0] for p in self.paths]) if self.paths else None
        return path[0] == min_distance

def calculate_distance(position1, position2):
    return ((position1[0] - position2[0]) ** 2 + (position1[1] - position2[1]) ** 2) ** 0.5

def convert_json_to_node_objects(data):
    nodes = []
    for node in data:
        node_object = Node(node["id"], node["position"], node["ids_adjacents"])
        nodes.append(node_object)
    
    for node in nodes:
        node.nodes_adjacent = [nd for nd in nodes if nd.index in node.ids_nodes_adjacent]

    return nodes

def step(nodes):
    for node in nodes:
        for node_adjacent in node.nodes_adjacent:
            if node_adjacent.state:
                distance = calculate_distance(node.position, node_adjacent.position)
                path = [distance + node.paths[0][0], node] if node.paths else [distance, node]

                node_adjacent.paths.append(path)
                node_adjacent.clean_paths()

        node.visited = True
        node.state = False
    
    return list(set([node_adjacent for node in nodes for node_adjacent in node.nodes_adjacent if node_adjacent.state]))

def dijkstra(nodes, list_nodes):
    if all(node.visited for node in list_nodes):
        return
    dijkstra(step(nodes), list_nodes)

def search_route(nodes):
    for node in nodes:    
        nodes_previous = [path[1] for path in node.paths] if node.paths else []
        for node_previous in nodes_previous:
            node_previous.routes.clear()
            for route in node.routes:
                new_route = [node_previous.index] + route
                if new_route not in node_previous.routes:
                    node_previous.routes.append(new_route)

        node.visited_reverse = True

    return [path[1] for node in nodes for path in node.paths]
    
def search_routes(nodes):
    if not nodes[0].paths:
        nodes_adjacents = [node_adjacent for node_adjacent in nodes[0].nodes_adjacent if node_adjacent.visited_reverse]
        for node_adjacent in nodes_adjacents:
            for route in node_adjacent.routes:
                new_route = [nodes[0].index] + route
                if new_route not in nodes[0].routes:
                    nodes[0].routes.append(new_route)
        return
    return search_routes(search_route(nodes))

def send_routes_minime(node_start_id, node_end_id, nodes_list):
    #filename = './static/files/nodes_position.json'
    #with open(filename, 'r') as json_file:
    #    data = json.load(json_file)
    #
    #nodes_list = convert_json_to_node_objects(data)

    #node_start_id = 4

    print(f"Ubicamos el objeto nodo origen con id {node_start_id}")
    node_start = [node for node in nodes_list if node.index == node_start_id]
    print("Realizamos el algoritmo dijkstra")
    dijkstra(node_start, nodes_list)

    """for i, node in enumerate(nodes_list):
        tags = [[path[0]+1, path[1].index] for path in node.paths]
        print(f"Node {i+1} - tags: {tags}")"""

    #node_end_id = 4
    print(f"Ubicamos el objeto nodo destino con id {node_end_id}")
    node_end = [node for node in nodes_list if node.index == node_end_id]
    print("Realizamos la busqueda de rutas")
    search_routes(node_end)

    routes = []

    print("LLenamos la lista routes")
    for i, route in enumerate(node_start[0].routes):
        print(f"Ruta {i}: {route}")
        routes.append(route)

    print("Retornamos la lista routes")
    return routes