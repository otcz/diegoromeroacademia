# Imagen del backend. Multietapa: la de construccion trae Maven y el JDK completo;
# la final solo lleva el JRE y el jar, para no publicar el compilador ni las fuentes.

# ---------------------------------------------------------------- construccion
FROM maven:3.9-eclipse-temurin-21 AS construccion
WORKDIR /construccion

# El pom va primero y solo: mientras no cambien las dependencias, Docker reutiliza esta
# capa y no vuelve a descargar medio Maven Central en cada build.
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY config ./config
COPY src ./src

# `verify` y no `package`: corre pruebas, cobertura, ArchUnit, Checkstyle, PMD y SpotBugs.
# Asi la imagen no se puede construir a partir de codigo que no cumple las reglas, aunque
# alguien se salte el paso de integracion continua.
RUN mvn -B verify

# ---------------------------------------------------------------- ejecucion
FROM eclipse-temurin:21-jre
WORKDIR /aplicacion

# Usuario sin privilegios: si alguien logra ejecutar codigo dentro del contenedor, no lo
# hace como root.
RUN groupadd --system academia && useradd --system --gid academia academia

COPY --from=construccion /construccion/target/*.jar aplicacion.jar
RUN chown academia:academia aplicacion.jar

USER academia
EXPOSE 8080

# MaxRAMPercentage y no -Xmx fijo: el contenedor puede cambiar de limite de memoria sin
# tener que reconstruir la imagen.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+UseContainerSupport"

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD ["sh", "-c", "curl -fsS http://127.0.0.1:8080/actuator/health || exit 1"]

ENTRYPOINT ["java", "-jar", "aplicacion.jar"]
