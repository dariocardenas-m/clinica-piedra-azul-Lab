# Ejecuta el backend de la Clínica Piedra Azul.
# Requiere Java y la contraseña local de MySQL. No guarda secretos.

$ErrorActionPreference = "Stop"

if (-not $env:JAVA_HOME) {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
}

$localConfig = Join-Path $PSScriptRoot "application-local.properties"
if (-not $env:DB_PASSWORD -and -not (Test-Path $localConfig)) {
    Write-Host "Falta la contraseña de MySQL."
    Write-Host "Copia application-local.properties.example a application-local.properties y escribe tu clave,"
    Write-Host "o define la variable de entorno DB_PASSWORD antes de ejecutar este script."
    exit 1
}

& (Join-Path $PSScriptRoot "mvnw.cmd") spring-boot:run
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
