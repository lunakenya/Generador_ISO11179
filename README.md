# 🧾 Generador de Casos ISO/IEC 11179 + Auditoría con IA

Aplicación web educativa que genera casos de estudio sobre **Gestión de Metadatos y Datos Maestros** bajo la norma ISO/IEC 11179, usando la API de Gemini (Google AI Studio). Permite a los usuarios:

- 🧠 Generar casos de estudio bien estructurados.
- 📝 Escribir su propio análisis.
- 🤖 Generar auditorías técnicas con IA.
- ⚖️ Comparar ambos análisis y recibir calificaciones.

---

## 🚀 Funcionalidades

- Generación automática de casos en formato Markdown.
- Evaluación crítica por IA sobre el caso generado.
- Comparación entre el análisis humano y el de IA con puntuaciones.
- Estilo visual claro, justificado y responsive.

---

## 🔧 Tecnologías

- Node.js + Express
- HTML + CSS + JavaScript
- API Gemini de Google
- Markdown render con `marked.js`

---

## 📦 Instalación

```bash
git clone https://github.com/tuusuario/generador_iso11179.git
```
```
cd generador_iso11179
```
```
npm install
```

🔐 Configuración

Crea un archivo .env con tu clave de Gemini API:
```
GEMINI_API_KEY=tu_clave_aqui
```

▶️ Ejecución
```
node server.js
```
