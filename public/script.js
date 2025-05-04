let analisisHumano = "";
let casoGeneradoIA = ""; // Guarda el caso generado por la IA

async function llamarGemini(prompt) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No se generó contenido válido.";
  } catch (error) {
    return `❌ Error al conectar con el servidor: ${error.message}`;
  }
}

async function generarCaso() {
  const prompt = `
    Genera un caso de estudio educativo sobre *Gestión de Metadatos y Datos Maestros* siguiendo esta estructura en formato Markdown:

    1. **Introducción:** Explica brevemente la importancia del tema.
    2. **Objetivo:** Qué busca lograr la empresa.
    3. **Contexto:** Describe el entorno o situación del caso (empresa, problema, entorno).
    4. **Herramientas y Tecnologías Usadas:** Menciona tecnologías utilizadas.
    5. **Implementación según ISO/IEC 11179:** Explica cómo se aplicó la norma ISO/IEC 11179.

    Hazlo en máximo 4 párrafos. Sé claro, preciso y educativo.
  `;

  const respuesta = await llamarGemini(prompt);
  casoGeneradoIA = respuesta;
  document.getElementById("casoContainer").innerHTML = `
    <h3>Caso Generado:</h3>
    <div class="justificado">${marked.parse(respuesta)}</div>`;
}

function guardarAnalisis() {
  const input = document.getElementById("analisisUsuario").value.trim();
  if (!input) {
    alert("⚠️ Por favor ingresa tu análisis primero.");
    return;
  }

  analisisHumano = input;
  document.getElementById("confirmacionHumano").innerText = "✅ Análisis humano guardado.";
}

async function generarAuditoria() {
  if (!casoGeneradoIA) {
    alert("⚠️ Primero debes generar un caso de estudio con IA.");
    return;
  }

  const prompt = `
    Realiza una auditoría técnica breve (máx. 5 párrafos) sobre el siguiente caso de estudio generado por IA relacionado con la Gestión de Metadatos y Datos Maestros bajo la norma ISO/IEC 11179. 
    Evalúa la claridad, estructura, aplicación normativa y propuesta tecnológica.
    Usa formato Markdown en la respuesta. 
    ❗ No incluyas calificaciones numéricas ni justificación de nota.

    Caso de estudio generado por IA:
    ${casoGeneradoIA}
  `;

  const respuesta = await llamarGemini(prompt);
  document.getElementById("auditoriaContainer").innerHTML = `
    <h3>Auditoría IA:</h3>
    <div class="contenido-justificado">${marked.parse(respuesta)}</div>`;
}

async function compararResultados() {
  if (!analisisHumano || !casoGeneradoIA) {
    alert("⚠️ Debes generar un caso de estudio y guardar tu análisis humano antes de comparar.");
    return;
  }

  const prompt = `
  Compara brevemente (máx. 3 párrafos) este análisis humano con el caso generado por IA, ambos sobre metadatos y datos maestros bajo la norma ISO/IEC 11179.
  Evalúa claridad, profundidad y cumplimiento. Luego, da una calificación del 0 al 10 a cada uno y explica por qué.

  Formato sugerido:
  - Análisis humano: nota /10
  - Análisis IA: nota /10
  - Justificación breve
  - ¿Cuál análisis es mejor y por qué?

  Análisis humano:
  ${analisisHumano}

  Caso de estudio generado por IA:
  ${casoGeneradoIA}
  `;

  const respuesta = await llamarGemini(prompt);
  const contenedor = document.getElementById("comparacionContainer");
  contenedor.innerHTML = `<h3>Comparación Final:</h3><div class="justificado">${marked.parse(respuesta)}</div>`;

  const matches = respuesta.match(/Análisis humano[^\d]*(\d{1,2})\/10.*Análisis IA[^\d]*(\d{1,2})\/10/i);
  if (matches) {
    const notaHumano = parseInt(matches[1]);
    const notaIA = parseInt(matches[2]);

    let mejor = "Empate entre ambos análisis.";
    if (notaHumano > notaIA) mejor = "✅ El análisis humano tiene mejor calificación.";
    else if (notaIA > notaHumano) mejor = "✅ El análisis de la IA tiene mejor calificación.";

    const resumen = `
      <div class="calificacion-container">
        <p><strong>Calificación Humano:</strong> ${notaHumano}/10</p>
        <p><strong>Calificación IA:</strong> ${notaIA}/10</p>
        <p><strong>${mejor}</strong></p>
      </div>
    `;
    contenedor.innerHTML += resumen;
  }
}
