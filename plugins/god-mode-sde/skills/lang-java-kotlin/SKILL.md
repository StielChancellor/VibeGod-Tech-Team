---
name: lang-java-kotlin
description: Use when writing or reviewing Java (.java) or Kotlin (.kt) or Spring Boot code — idiomatic Java 21 / Kotlin style, Gradle/Maven, JUnit5, null-safety, and the top JVM/Spring security pitfalls. Triggers on build.gradle(.kts)/pom.xml, Spring, JPA/Hibernate, JdbcTemplate projects.
allowed-tools: Read, Grep, Glob, Bash
---

# Java / Kotlin — idiomatic & safe

The language lens for JVM (Java 21 / Kotlin) and Spring Boot work. Backs the build agents at
Stage 6. Honors `_shared/god-mode-principles.md` (simplicity, surgical, null-safety,
no silent error-swallowing, consistency, cost-awareness). Defer security depth to `secure-coding`
and test discipline to `test-driven-development`.

## Fits in the pipeline
Stage 6 (Build): write code to this standard. Stage 7 (per-feature QA): the
code-quality-reviewer + security-engineer lenses check it against this skill. Priority:
**user > skills > default.**

## Style & layout
- Standard `src/main/{java,kotlin}` + `src/test/...`; package by feature. Constructor injection
  only (no field `@Autowired`); keep beans stateless. Immutable DTOs (Java `record`, Kotlin `data class`).
- **Java 21:** records, sealed types, pattern matching, `var` for obvious locals. **Kotlin:** prefer
  `val`, expression bodies, data/sealed classes, extension functions — keep it idiomatic, not Java-in-Kotlin.

## Toolchain (canonical)
- **Build:** Gradle (Kotlin DSL) or Maven, with a lockfile/`dependencyLocking`.
- **Test:** JUnit 5 (+ AssertJ, Mockito where needed, Testcontainers for integration).
- **Lint/format:** Checkstyle/Spotless (Java), ktlint/detekt (Kotlin); run in CI.

## Null-safety & error handling
- **Kotlin:** lean on non-null types; avoid `!!`; use `?.`, `?:`, sealed results. **Java:** return
  `Optional<T>` instead of nulls at API edges; annotate with `@Nullable`/`@NonNull`.
- Throw specific exceptions; never `catch (Exception e) {}` (silent swallow) or swallow to log-and-continue.
  Use `@ControllerAdvice` for centralized API error mapping; return generic messages to clients,
  detail to logs. Validate request DTOs with Bean Validation (`@Valid`).

## Top security pitfalls → safe alternative
- **Insecure deserialization** (Java native `ObjectInputStream`, unsafe Jackson polymorphic typing)
  → avoid native serialization of untrusted data; disable default typing; deserialize to known types.
- **SpEL / EL injection** (user input into `@Value`/`parseExpression`/`PreAuthorize` strings) →
  never evaluate user-supplied expressions; use fixed expressions + method args.
- **SQL via string concatenation** → JPA/HQL **named parameters** or `JdbcTemplate` with `?`
  placeholders; never concatenate input into queries; no string-built `@Query`.
- **Spring Security misconfig** → explicit, deny-by-default `SecurityFilterChain`; don't disable
  CSRF for cookie-auth flows; lock down actuator; method-level authz; verify with tests.
- **Logging secrets/PII** → never log credentials, tokens, full request bodies; mask sensitive fields.

## Definition of done
Build + Checkstyle/Spotless or ktlint/detekt pass · null-safety honored (no `!!`/leaked nulls) ·
no broad catch-and-swallow · queries parameterized · Spring Security deny-by-default ·
JUnit 5 tests written first and green (see `test-driven-development`) · security pitfalls above checked.
