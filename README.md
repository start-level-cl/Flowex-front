# 🚚 FlowEx - Sistema de Gestión Logística & Envíos (Frontend)

![FlowEx CI/CD Pipeline](https://github.com/start-level-cl/Flowex-front/actions/workflows/ci-cd.yml/badge.svg)
![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?style=flat&logo=vercel)

FlowEx es una plataforma web integral de gestión logística, trazabilidad de paquetes, despacho interurbano y administración de rutas para conductores y transportistas.

---

## 🛠️ Tech Stack & Arquitectura

* **Framework**: React 19 + TypeScript + Vite 5
* **Router**: `react-router-dom` v6 (Con soporte SPA para Vercel rewrites)
* **Estilos**: TailwindCSS v3.4.17 + PostCSS + Autoprefixer
* **Iconografía**: `lucide-react`
* **Design System**: Paleta *Corporate Blue* (`#00236f`), *Vibrant Orange* (`#fd761a`), fuentes *Montserrat* & *Inter*.

---

## 📱 Módulos & Flujos Implementados

1. **Portal de Acceso & Roles** (`/`): Selección dinámica entre Operador Admin, Conductor Driver y Cliente Final.
2. **Dashboard de Pedidos & Auditoría** (`/admin`): Métricas KPI en vivo, lista de paquetes y bitácora de auditoría.
3. **Gestión Operativa Fase 1** (`/admin/operations`): Consola de operaciones, cambios de estado masivos y asignación de drivers.
4. **Formulario de Pedido Operativo** (`/admin/create-order`): Registro manual tradicional y cálculo automático de tarifas.
5. **Nuevo Pedido Inteligente (IA)** (`/admin/smart-order`): Extracción automática de datos desde texto informal e impresión de etiquetas con código de barras.
6. **Gestión de Ruta Driver** (`/driver/route`): Despacho de entregas, mapa interactivo y secuencia de paradas.
7. **Mi Ruta Diaria** (`/driver/daily`): Vista ejecutable para smartphones/tablets del repartidor con carga de firma y foto (POD).
8. **Seguimiento Público** (`/tracking`): Trazabilidad cronológica en tiempo real para clientes finales.

---

## 🚀 Despliegue en Vercel (CI/CD Automático)

Este repositorio cuenta con un pipeline de **GitHub Actions** (`.github/workflows/ci-cd.yml`) configurado para:
* Ejecutar la compilación y verificación en Node 20 en cada `push` o `pull_request` a `main`.
* Desplegar automáticamente a **Vercel Production**.

```bash
# Desarrollo local
npm install
npm run dev

# Build de Producción
npm run build
```
