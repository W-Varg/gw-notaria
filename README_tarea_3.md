# Trabajo Práctico 3 — CI/CD Profesional con DevSecOps, Promoción por Ambientes + Rollback + Observabilidad

## 1) Entregables obligatorios

### A. Documento Técnico Profesional (PDF o .pptx convertido a PDF)
Debe incluir:  
1. Portada institucional (Maestría, módulo, integrantes, gestión, universidad).  
2. Arquitectura del pipeline (CI + CD staging + CD producción con approvals).  
3. Descripción del sistema Compras/Ventas usado como caso de estudio.  
4. Quality Gates implementados (backend y frontend).  
5. Gestión de secretos por ambiente.  
6. Estrategia de releases y despliegue atómico por symlink.  
7. Estrategia de rollback (técnico y de datos si aplica).  
8. Observabilidad y confiabilidad (SLO/SLI baseline).  
9. Evidencias del pipeline (capturas o enlaces).  
10. Checklist final completada.  
11. Conclusiones de ingeniería y aprendizajes.  
Norma de texto: lenguaje técnico, preciso, orientado a Release/Delivery Engineering y confiabilidad.

### B. Video Demostrativo (5–8 min)
El grupo debe mostrar en video:  
- Pipeline CI fallando y pasando.  
- CD a staging ejecutándose.  
- CD a producción pausándose hasta aprobación.  
- Aprobación humana aplicada.  
- Despliegue atómico (symlink current).  
- Endpoint /api/health en staging y producción.  
- Logs con contexto de release (release, env, user_id, transaction_id).  
- Demostración de rollback.  
El video debe incluir narración técnica, mostrar consola/CI/CD runs, y demostrar paridad profesional del proceso.

## 2) Requisitos técnicos obligatorios en el sistema

### Backend (Laravel 12)
- Controllers delgados, lógica en servicios.  
- Endpoint /api/health invokable.  
- Tests: unit + feature + integration + smoke.  
- Pint (PSR-12) como gate.  
- PHPStan (nivel ≥6 recomendado) como gate.  
- Migraciones backward-compatible.

### DevSecOps
- Secrets por ambiente (staging ≠ producción).  
- No exponer secretos en logs.  
- Revisión por PR obligatoria en main.

### CI/CD (GitHub Actions)
- Jobs paralelizados: lint, static, tests, build, deploy.  
- Build una sola vez por release (RELEASE_ID).  
- Estructura /releases, /shared, current symlink.  
- Switch atómico por symlink.  
- Approval gate en producción.  
- Health check como required check.  
- Rollback atómico (symlink a versión estable anterior).  
- Logs con metadata de release.

## 3) Actividades prácticas paso a paso

### 3.1 Crear ramas semánticas
```bash
git checkout -b feature/ci-cd-final
```

### 3.2 Simular fallo intencional (obligatorio)
Romper formato en backend o test:  
```bash
echo "public function ( \$x ){}" >> app/Http/Controllers/HealthController.php
git add . 
git commit -m "ci: break pipeline intentionally" 
git push origin feature/ci-cd-final
```
Pipeline CI debe fallar.

### 3.3 Corregir y dejar CI verde
```bash
./vendor/bin/pint 
./vendor/bin/phpstan analyse 
php artisan test 
npm ci && npm run lint && npm run test && npm run build 
git add . 
git commit -m "fix: repair CI failures" 
git push origin feature/ci-cd-final
```
Pipeline CI debe pasar.

### 3.4 Crear tag semántico auditable
```bash
git tag -a v3.0.0 -m "release: CI/CD + gates + atomic deploy + observability"
git push origin v3.0.0
```

### 3.5 Aprobar despliegue a producción
Ir a GitHub → Environments → Production → Approve deploy

### 3.6 Validar symlink en servidor
En servidor staging y producción:  
```bash
readlink -f /var/www/comprasventas/current
```
Debe apuntar al release desplegado.

### 3.7 Validar salud del sistema
```bash
curl -i https://tudominio/api/health
```
Debe retornar 200 OK en staging y producción.

### 3.8 Validar logs correlacionados por release
Ejemplo esperado en storage/logs/laravel.log:  
```
[2026-01-07 16:45:32] staging.INFO: Procesando compra {"release":"v3.0.0","env":"staging","user_id":3} 
[2026-01-07 16:47:10] production.INFO: Procesando venta {"release":"v3.0.0","env":"production","user_id":5}
```

## 4) Normas de evidencia y responsabilidad
El grupo debe garantizar que toda evidencia tenga:  

| Evidencia | Debe mostrar |
|-----------|--------------|
| CI run | Jobs quality + static + tests + build en verde |
| CD staging run | Deploy automático y health 200 OK |
| CD producción | Paso pausado + aprobación humana |
| Symlink | current → release correcto |
| Health endpoint | 200 OK |
| Logs | Contexto release + ambiente + usuario |
| Rollback | Symlink revertido a versión estable |

Sin evidencia, la implementación no se considera válida.

## 5) Checklist de aceptación del Trabajo Práctico 3
- Rama main protegida con PR obligatorio  
- CI con quality gates backend (Pint + PHPStan)  
- Tests backend unit + feature + integration + smoke  
- CI con gates frontend (ESLint + Vitest + build reproducible)  
- CD a staging automático por SSH  
- CD a producción pausado hasta approval  
- Build único (RELEASE_ID) y promoción por artefacto  
- Switch atómico de symlink current  
- Secrets segregados por ambiente (no en repo ni logs)  
- Health check como gate post-deploy  
- Rollback atómico probado  
- Observabilidad implementada (logs con contexto release)  
- Evidencia auditable de cada paso (link o captura)  
- Video demuestra fallos + correcciones + deploy + health + rollback  
- Documento teórico/práctico contiene todas las evidencias  
- Conclusiones de ingeniería redactadas  
