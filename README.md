# 📊 TrackeArBit – Sistema Web para la Gestión Personal de Inversiones Financieras

**TrackeArBit** es una aplicación web desarrollada para centralizar, visualizar y analizar distintas alternativas de inversión disponibles en Argentina. Permite registrar operaciones con criptomonedas y CEDEARs, simular rendimientos de plazos fijos y billeteras virtuales, y tomar decisiones financieras informadas dentro de un entorno unificado y adaptado al contexto económico local.

---

## 🧠 ¿Para qué sirve?

- 💹 Registrar inversiones en criptomonedas y CEDEARs.
- 📈 Visualizar la evolución de tu cartera con gráficos dinámicos.
- 🏦 Simular rendimientos de plazos fijos y cuentas digitales.
- 🔄 Comparar cotizaciones de activos en tiempo real.
- 🛍️ Evaluar decisiones de consumo: cuotas vs. contado.
- 🌎 Explorar alternativas como pagos vía PIX en plataformas externas.

---

## ⚙️ Tecnologías utilizadas

- **Vite** — Entorno de desarrollo rápido.
- **React + TypeScript** — Desarrollo moderno y tipado seguro.
- **Tailwind CSS** — Estilado visual con clases utilitarias.
- **shadcn/ui** — Componentes accesibles y reutilizables.
- **Chart.js / Recharts** — Visualización de datos.
- **React Query** — Manejo eficiente de datos remotos.
- **Axios** — Consultas a APIs externas (DolarAPI, Comparatasas, etc.).
- **SQLite** — Base de datos embebida, ideal para prototipos.
- **Node.js + Express** — Lógica backend y APIs REST.

---

## 🚀 Instalación local

> 📌 Asegurate de tener **Node.js** y **npm** instalados.

### 🔧 Pasos

```bash
# 1. Clonar el repositorio
git clone <TU_URL_DEL_REPO>

# 2. Ingresar a la carpeta del proyecto
cd trackearbit-finanzas-argentinas

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev

📁 src/                      # Código fuente principal
├── components/             # Componentes de UI y simuladores (WalletSimulator, SimulationTool, etc.)
├── pages/                  # Vistas principales: Simulación, Inversiones, Comparación, Perfil, etc.
├── services/               # Acceso a APIs externas (DolarAPI, Comparatasas, etc.)
├── hooks/                  # Hooks personalizados (ej: uso de tasas, detección de móvil)
├── utils/                  # Funciones auxiliares (formateo, validaciones, cálculos)
├── types/                  # Definiciones de tipos TypeScript (wallets, tasas, exchange rates)
├── data/                   # Datos mockeados para pruebas (tasas, billeteras)
├── App.tsx / main.tsx      # Componente raíz y punto de entrada de la app
└── estilos y configuración # CSS base, tipado Vite, etc.
