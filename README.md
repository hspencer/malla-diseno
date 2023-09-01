# Malla Curricular de la Carrera de Diseño
### Escuela de Arquitectura y Diseño PUCV

Los datos de las asignaturas se obtienen de la [Wiki Casiopea](http://wiki.ead.pucv.cl) mediante la [API](https://wiki.ead.pucv.cl/Especial:Zona_de_pruebas_de_la_API) que entrega un objeto JSON con todas las asignaturas que cumplen los siguientes criterios:

```
{{#ask: [[Categoría:Asignatura]][[Currículum::Decreto Académico 37/2017]][[Carreras Relacionadas::Diseño]]OR[[Categoría:Asignatura]][[Currículum::Decretos Académicos 35 y 37/2017]][[Carreras Relacionadas::Diseño]]
|?Clave
|?Créditos
|?Ciclo Formativo
|?Área de Estudio
|?Ciclo Formativo
|?Tipo de Asignatura
|?Mención
|limit = 999
}}
```

Esta consulta trae solamente las asignaturas de diseño, de los decretos vigentes, con los valores de Clave, Ciclo Formativo, Área de Estudio, Tipo de Asignatura (si es obligaria u optativa) y la Mención a la que tributa.

La URL de tal consulta es:
```
https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3AAsignatura%5D%5D%5B%5BCurr%C3%ADculum%3A%3ADecreto%20Acad%C3%A9mico%2037%2F2017%5D%5D%5B%5BCarreras%20Relacionadas%3A%3ADise%C3%B1o%5D%5DOR%5B%5BCategor%C3%ADa%3AAsignatura%5D%5D%5B%5BCurr%C3%ADculum%3A%3ADecretos%20Acad%C3%A9micos%2035%20y%2037%2F2017%5D%5D%5B%5BCarreras%20Relacionadas%3A%3ADise%C3%B1o%5D%5D%20%7C%3FClave%20%7C%3FCr%C3%A9ditos%20%7C%3FCiclo%20Formativo%20%7C%3F%C3%81rea%20de%20Estudio%20%7C%3FCiclo%20Formativo%20%7C%3FTipo%20de%20Asignatura%20%7C%3FMenci%C3%B3n%20%7Climit%20%3D%20999&utf8=1&formatversion=1
```

A partir de este JSON podemos construir los objetos que se ubican en distintos lugares del HTML de acuerdo al ciclo formativo y al área de estudios.