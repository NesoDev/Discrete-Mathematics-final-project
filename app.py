from flask import Flask, jsonify, request, render_template
from utils import convert_json_to_node_objects, leerPDF, generarHorarios, convertirListaAJson, convertirListaAJsonModified, send_routes_minime

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

#---------------------------------------------------------------

@app.route("/schedule-generator", methods=["GET"])
def viewPageScheduleGenerator():
    return render_template("schedule-generator.html")

@app.route("/schedule-generator/api/data", methods=["POST"])
def scheduleGenerator():
    print("-- RECIBIENDO DATOS DEL FRONTEND --")
    data = request.get_json()

    print(data)
    schedules = generarHorarios(data)
    json = convertirListaAJsonModified(schedules)

    print("-- ENVIAMOS DATOS AL FRONTEND --")
    print(json)

    return jsonify(json)

@app.route("/schedule-generator/api/file-upload", methods=["POST"])
def uploadPdf():
    print("-- RECIBIENDO PDF DEL FRONTEND --")
    try:
        if "pdf" not in request.files:
            return jsonify({"error": "No se recibió ningún archivo"}), 400
        pdf_file = request.files["pdf"]
        courses_object = leerPDF(pdf_file)

        # Puedes guardar el archivo en el servidor si es necesario
        # pdf_file.save("/ruta/donde/guardar/archivo.pdf")
        # Aquí puedes realizar cualquier procesamiento adicional según tus necesidades
        # ...
        print("-- ENVIAMOS DATOS AL FRONTEND --")
        return jsonify(courses_object)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#---------------------------------------------------------------

@app.route("/route-search", methods=["GET"])
def viewRoutesMinime():
    return render_template("route-search-san-marcos.html")

@app.route("/route-min/api/calculate-routes-min", methods=["POST"])
def routeMin():
    print("-- RECIBIENDO DATOS DEL FRONTEND --")
    data_received = request.get_json()
    print(f"data recibida: {data_received}\n\n")

    nodes, node_start_id, node_end_id = data_received["nodes"], int(data_received["node_start_id"]), int(data_received["node_end_id"])

    print(f"Nodos : {nodes}\n")
    print(f"Nodo de origen : {node_start_id}\n")
    print(f"Nodo de destino : {node_end_id}\n")

    nodes_list = convert_json_to_node_objects(nodes)
    print(f"Nodes_list: {nodes_list}\n")

    routes_min = send_routes_minime(node_start_id, node_end_id,nodes_list)
    print(f"Routes_min : {routes_min}\n")

    print("-- ENVIAMOS DATOS AL FRONTEND --")
    print(f"rutas minimas: {routes_min}\n")

    return jsonify(routes_min)

if __name__ == '__main__':
    app.run(debug=True, port=5009)