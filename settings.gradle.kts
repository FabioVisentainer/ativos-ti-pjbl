rootProject.name = "ativos-ti"

// Build multi-projeto: o backend (Spring Boot + MySQL) e o gateway
// (Spring Cloud Gateway) compartilham o mesmo wrapper e o mesmo catálogo de versões.
include("backend", "gateway")
