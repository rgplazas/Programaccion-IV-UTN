# Taskflow

Aplicacion web de gestion de tareas desarrollada para la asignatura **Programacion IV** de la **Universidad Tecnologica Nacional, Facultad Regional Avellaneda (UTN FRA)**.

Taskflow permite organizar tareas segun su estado, consultar su detalle y administrar su prioridad desde una interfaz construida con Angular. El proyecto aplica componentes standalone, Signals, formularios basados en Signals y enrutamiento para separar las responsabilidades de la aplicacion.

## Indice

- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalacion y ejecucion](#instalacion-y-ejecucion)
- [Rutas de la aplicacion](#rutas-de-la-aplicacion)
- [Modelo de datos](#modelo-de-datos)
- [Pruebas](#pruebas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Alcance actual](#alcance-actual)

## Objetivos

- Modelar una entidad de dominio (`TaskModel`) con tipos estrictos en TypeScript.
- Implementar operaciones de alta, consulta, modificacion y eliminacion de tareas.
- Aplicar Signals para mantener un estado reactivo y centralizado.
- Practicar composicion de componentes standalone y comunicacion mediante inputs y outputs.
- Incorporar rutas parametrizadas, validaciones de formularios y una interfaz de usuario en espanol.

## Funcionalidades

- **Tablero:** visualiza las tareas en las columnas Pendientes, En curso y Hechas.
- **Listado:** muestra todas las tareas y permite filtrarlas por titulo.
- **Nueva tarea:** crea una tarea con titulo, estado y prioridad.
- **Edicion:** precarga los datos de una tarea existente y permite actualizarlos.
- **Detalle:** consulta el estado y la prioridad de una tarea individual.
- **Prioridades:** permite seleccionar P1, P2 o P3.
- **Acciones rapidas:** marcar una tarea como hecha y eliminarla desde las tarjetas.
- **Validaciones:** el titulo es obligatorio, debe tener entre 3 y 80 caracteres y la prioridad debe estar entre 1 y 3.

## Tecnologias

- [Angular](https://angular.dev/) 22.1
- TypeScript 6.0
- Angular Router
- Angular Signals y Signal Forms
- RxJS 7.8
- Vitest 4 para pruebas unitarias
- npm 11.17.0

## Arquitectura

La aplicacion utiliza una arquitectura basada en componentes standalone:

- `App`: componente raiz y navegacion principal.
- `TaskStore`: servicio singleton que concentra el estado y las operaciones sobre tareas.
- `TaskBoard`: organiza las tareas por estado.
- `TaskList`: presenta el listado y aplica el filtro de busqueda.
- `TaskCard`: componente reutilizable para representar una tarea.
- `TaskDetail`: muestra la informacion de una tarea.
- `TaskForm`: gestiona el alta y la edicion con validaciones.
- `PriorityPicker`: control reutilizable para seleccionar la prioridad.

El estado se mantiene en una Signal del `TaskStore`. Los cambios se propagan automaticamente a los componentes que consumen esa Signal mediante `computed`. En el arranque se cargan cuatro tareas de ejemplo.

## Requisitos

- Node.js compatible con Angular 22.
- npm 11.17.0 o una version compatible.
- Un navegador web actualizado.

Se recomienda comprobar las versiones instaladas con:

```bash
node --version
npm --version
```

## Instalacion y ejecucion

Desde la carpeta `taskflow`, instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm start
```

Luego abrir [http://localhost:4200/](http://localhost:4200/). Angular recarga automaticamente la aplicacion cuando se modifican los archivos fuente.

Para compilar una version optimizada:

```bash
npm run build
```

Los artefactos se generan en la carpeta `dist/`.

## Rutas de la aplicacion

| Ruta | Vista | Descripcion |
| --- | --- | --- |
| `/board` | Tablero | Organiza las tareas por estado. |
| `/tasks` | Tareas | Lista y filtra tareas por titulo. |
| `/tasks/new` | Nueva tarea | Crea una tarea. |
| `/tasks/:taskId` | Detalle | Consulta una tarea especifica. |
| `/tasks/:taskId/edit` | Editar tarea | Modifica una tarea existente. |

La ruta raiz redirige a `/board` y las rutas desconocidas tambien vuelven al tablero.

## Modelo de datos

Cada tarea se representa mediante la siguiente estructura:

```ts
interface TaskModel {
	id: number;
	title: string;
	status: 'pending' | 'in-progress' | 'done';
	priority: 1 | 2 | 3;
	assignee?: UserModel;
}
```

Los estados se muestran como **Pendiente**, **En curso** y **Hecha**. La prioridad se expresa como P1, P2 o P3.

## Pruebas

Ejecutar las pruebas unitarias con:

```bash
npm test
```

El proyecto utiliza Vitest a traves del builder de pruebas de Angular. Los specs actuales verifican principalmente la creacion de los componentes y sirven como base para ampliar la cobertura de las operaciones del store, las validaciones y la navegacion.

Al momento de documentar esta version, la suite requiere ajustes: algunos componentes necesitan recibir sus inputs obligatorios y ciertos specs necesitan configurar los providers del router; ademas, `app.spec.ts` conserva una expectativa de la plantilla inicial de Angular. Por este motivo, `npm test` puede finalizar con pruebas fallidas hasta actualizar esos casos.

No existe un script de pruebas end-to-end configurado en este proyecto.

## Estructura del proyecto

```text
taskflow/
├── public/                         # Recursos publicos
├── src/
│   ├── main.ts                     # Punto de entrada
│   ├── styles.css                  # Estilos globales
│   └── app/
│       ├── app.ts                  # Componente raiz
│       ├── app.html                # Navegacion y outlet
│       ├── app.routes.ts           # Configuracion de rutas
│       ├── app.config.ts           # Configuracion de Angular
│       ├── task.store.ts           # Estado y operaciones del dominio
│       └── tasks/
│           ├── task.model.ts       # Modelos y tipos
│           ├── task-status.ts      # Estados y funciones auxiliares
│           ├── task-board/         # Vista de tablero
│           ├── task-list/          # Vista de listado
│           ├── task-detail/        # Vista de detalle
│           ├── task-form/          # Alta y edicion
│           ├── task-card/          # Tarjeta reutilizable
│           └── priority-picker/    # Selector de prioridad
├── angular.json
├── package.json
└── tsconfig.json
```

## Alcance actual

Taskflow es una aplicacion de practica de alcance frontend. Actualmente las tareas se almacenan en memoria dentro de `TaskStore`: al recargar la pagina se restablecen las tareas iniciales. No se incluye backend, base de datos, autenticacion ni persistencia en `localStorage`.

Como posibles extensiones se pueden incorporar una API REST, persistencia permanente, usuarios asignados, filtros por estado y prioridad, y pruebas de comportamiento para los flujos principales.

## Autor y contexto academico

Proyecto desarrollado como trabajo practico para **Programacion IV - UTN Facultad Regional Avellaneda**.

## Licencia

Este proyecto fue desarrollado con fines academicos.
