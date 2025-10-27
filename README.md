# Divisiones Administrativas del Ecuador JSON

Un conjunto de datos JSON completo que contiene todas las provincias, cantones y parroquias del Ecuador con capitalización adecuada.

## 📥 Descarga

Puedes descargar directamente el archivo `provincias.json` desde este repositorio:

```bash
# Usando curl
curl -O https://raw.githubusercontent.com/GAumala/geografia.ec/main/provincias.json

# Usando wget
wget https://raw.githubusercontent.com/[tu-usuario]/geografia.ec/main/provincias.json
```

## 📊 Estructura de Datos

El archivo JSON contiene un arreglo de objetos de provincias con la siguiente estructura:

```json
[
  {
    "nombre": "Azuay",
    "cantones": [
      {
        "nombre": "Cuenca",
        "parroquias": [
          "Baños",
          "Chaucha",
          "Checa",
          "Chiquintad",
          "Cuenca",
          "Cumbe",
          "Llacao",
          "Molleturo",
          "Nulti",
          "Octavio Cordero Palacios",
          "Paccha",
          "Quingeo",
          "Ricaurte",
          "San Joaquín",
          "Santa Ana",
          "Sayausí",
          "Sidcay",
          "Sinincay",
          "Tarqui",
          "Turi",
          "Valle",
          "Victoria del Portete"
        ]
      }
    ]
  }
]
```

## 📈 Estadísticas

- **25 provincias** (incluyendo Galápagos)
- **223 cantones** 
- **1,048 parroquias**
- **Capitalización adecuada** aplicada en todo el contenido
- **Ordenado alfabéticamente** en todos los niveles

## 🚀 Ejemplos de Uso

### JavaScript/Node.js

```javascript
// Cargar los datos
const datosEcuador = require('./provincias.json');

// Obtener todas las provincias
const provincias = datosEcuador.map(p => p.nombre);
console.log(provincias);

// Obtener cantones para una provincia específica
const cantonesAzuay = datosEcuador
  .find(p => p.nombre === 'Azuay')
  ?.cantones.map(c => c.nombre) || [];

// Obtener parroquias para un cantón específico
const parroquiasCuenca = datosEcuador
  .find(p => p.nombre === 'Azuay')
  ?.cantones.find(c => c.nombre === 'Cuenca')
  ?.parroquias || [];

// Buscar una ubicación específica
function buscarUbicacion(nombreProvincia, nombreCanton, nombreParroquia) {
  const provincia = datosEcuador.find(p => p.nombre === nombreProvincia);
  if (!provincia) return null;
  
  const canton = provincia.cantones.find(c => c.nombre === nombreCanton);
  if (!canton) return null;
  
  const parroquia = canton.parroquias.find(p => p === nombreParroquia);
  return parroquia ? { provincia, canton, parroquia } : null;
}
```

### Python

```python
import json

# Cargar los datos
with open('provincias.json', 'r', encoding='utf-8') as f:
    datos_ecuador = json.load(f)

# Obtener todas las provincias
provincias = [p['nombre'] for p in datos_ecuador]
print(provincias)

# Obtener cantones para Azuay
cantones_azuay = next(
    (p['cantones'] for p in datos_ecuador if p['nombre'] == 'Azuay'), 
    []
)
nombres_cantones = [c['nombre'] for c in cantones_azuay]

# Obtener parroquias para Cuenca
parroquias_cuenca = next(
    (c['parroquias'] for c in cantones_azuay if c['nombre'] == 'Cuenca'),
    []
)
```

### PHP

```php
<?php
// Cargar los datos
$datosEcuador = json_decode(file_get_contents('provincias.json'), true);

// Obtener todas las provincias
$provincias = array_column($datosEcuador, 'nombre');

// Obtener cantones para Azuay
$indiceAzuay = array_search('Azuay', array_column($datosEcuador, 'nombre'));
$cantonesAzuay = $datosEcuador[$indiceAzuay]['cantones'];
$nombresCantones = array_column($cantonesAzuay, 'nombre');

// Obtener parroquias para Cuenca
$indiceCuenca = array_search('Cuenca', array_column($cantonesAzuay, 'nombre'));
$parroquiasCuenca = $cantonesAzuay[$indiceCuenca]['parroquias'];
?>
```

## 🔄 Actualizaciones de Datos

Este conjunto de datos se genera a partir de la información oficial de división administrativa ecuatoriana proporcionada por el [Instituto Nacional de Estadística y Censos (INEC)](https://www.ecuadorencifras.gob.ec/documentos/web-inec/Geografia_Estadistica/Micrositio_geoportal/index.html).

Los datos originales provienen del "CLASIFICADOR GEOGRÁFICO ESTADÍSTICO – ESQUEMA DE CODIFICACIÓN DE LA DIVISIÓN POLÍTICO ADMINISTRATIVA DEL PAÍS" (versión 2025).

> **Nota**: El archivo `codificacion.csv` debe actualizarse anualmente con los datos más recientes del INEC.

## 🛠️ Regeneración

Si necesitas regenerar el archivo JSON desde los datos CSV originales:

1. Asegúrate de tener el archivo `codificacion.csv`
2. Ejecuta el script de conversión:

```bash
node generate-json.js
```

Esto hará:
- Analizar los datos CSV del INEC
- Aplicar reglas de capitalización adecuadas para el español
- Generar el archivo JSON estructurado
- Ordenar todas las entradas alfabéticamente

## 📋 Reglas de Capitalización

El script de conversión aplica capitalización adecuada para el español:

- **Capitalizado**: Primera letra de cada palabra
- **Minúsculas**: Preposiciones y artículos comunes del español (de, del, la, el, los, las, y, en, con, por, para, al)
- **Casos especiales**: Maneja palabras portuguesas (da, do, dos, das, e, o, a, ao, aos, as)

## 📄 Licencia

Este conjunto de datos se basa en información oficial del gobierno del INEC Ecuador. Por favor, consulta la fuente original para los términos de licencia.

## 🔗 Fuentes

- **Datos Originales**: [INEC Ecuador - Marco Geoestadístico](https://www.ecuadorencifras.gob.ec/documentos/web-inec/Geografia_Estadistica/Micrositio_geoportal/index.html)
- **Formato de Datos**: CLASIFICADOR GEOGRÁFICO ESTADÍSTICO 2025
- **Conversión**: Excel a CSV a JSON con capitalización adecuada

## 🤝 Contribuir

Si encuentras algún problema con los datos o tienes sugerencias para mejoras, por favor abre un issue o envía un pull request.

## 📞 Soporte

Para preguntas sobre los datos originales, por favor contacta al [INEC Ecuador](https://www.ecuadorencifras.gob.ec/).
