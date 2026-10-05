# Build em duas etapas. Contexto de build = raiz do repositório (ver docker-compose.yml).
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle gradle
COPY backend backend
COPY gateway gateway
RUN chmod +x gradlew && ./gradlew :backend:bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --create-home appuser
COPY --from=build /workspace/backend/build/libs/app.jar app.jar
USER appuser
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
