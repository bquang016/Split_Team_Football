# ==========================================
# STAGE 1: Build JAR with Maven & OpenJDK 21
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy dependency configuration first to leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production jar (skip unit tests for faster deployment)
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Minimal Runtime (Optimized for Render Free Tier 512MB RAM)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Run as non-privileged user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy generated jar from builder stage
COPY --from=builder /build/target/footballsquad-backend-*.jar app.jar

# Render assigns a dynamic port via environment variable PORT (default 8081 if running locally)
ENV PORT=8081
EXPOSE 8081

# JVM flags tailored for 512MB RAM limit on Render Free Web Service:
# 1. -XX:+UseContainerSupport: respects container cgroup memory limits
# 2. -XX:MaxRAMPercentage=70.0: caps heap at ~350MB, reserving ~160MB for OS, native memory, Metaspace
# 3. -XX:+UseSerialGC: significantly reduces memory overhead compared to G1GC on 1-vCPU/low-RAM instances
# 4. -Xss512k: reduces per-thread stack size from 1024k to 512k
# 5. -XX:+TieredCompilation -XX:TieredStopAtLevel=1: speeds up boot time to ~5-8s & saves ~80MB JIT compilation memory
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=70.0 -XX:+UseSerialGC -Xss512k -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -Dfile.encoding=UTF-8"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
