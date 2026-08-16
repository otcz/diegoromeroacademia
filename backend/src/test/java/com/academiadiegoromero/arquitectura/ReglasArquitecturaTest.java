package com.academiadiegoromero.arquitectura;

import static com.tngtech.archunit.base.DescribedPredicate.alwaysTrue;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.resideInAnyPackage;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noFields;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_THROW_GENERIC_EXCEPTIONS;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Verifica las fronteras de docs/02-arquitectura.md §5 en cada build.
 *
 * <p>Esta clase es el mecanismo que convierte la regla 3 (sin codigo espagueti) en una
 * garantia y no en una convencion. El codigo espagueti no nace de golpe: nace de una capa
 * que empieza a hacer el trabajo de otra, y eso solo se detiene si algo lo rechaza de forma
 * automatica.
 */
@AnalyzeClasses(
        packages = "com.academiadiegoromero",
        importOptions = ImportOption.DoNotIncludeTests.class)
class ReglasArquitecturaTest {

    /**
     * El dominio no depende de ningun framework.
     *
     * <p>Es lo que permite probarlo sin levantar Spring —y con ello sostener la piramide de
     * pruebas de docs/05— y lo que hace que cambiar de tecnologia no toque las reglas de
     * negocio.
     */
    @ArchTest
    static final ArchRule EL_DOMINIO_ES_PURO = noClasses()
            .that().resideInAPackage("..dominio..")
            .should().dependOnClassesThat().resideInAnyPackage(
                    "org.springframework..",
                    "jakarta.persistence..",
                    "com.fasterxml.jackson..",
                    "tools.jackson..",
                    "..infraestructura..");

    /** La capa de aplicacion orquesta, pero no conoce HTTP ni SQL. */
    @ArchTest
    static final ArchRule LA_APLICACION_NO_CONOCE_LA_INFRAESTRUCTURA = noClasses()
            .that().resideInAPackage("..aplicacion..")
            .should().dependOnClassesThat().resideInAnyPackage("..infraestructura..");

    /**
     * Los modulos no se invaden por dentro.
     *
     * <p>Se ignoran las dependencias hacia compartido y configuracion: el primero existe
     * justamente para ser usado por todos, y el segundo es el cableado de la aplicacion.
     */
    @ArchTest
    static final ArchRule LOS_MODULOS_NO_SE_INVADEN = slices()
            .matching("com.academiadiegoromero.(*)..")
            .should().notDependOnEachOther()
            .ignoreDependency(
                    resideInAnyPackage("..configuracion.."),
                    alwaysTrue())
            .ignoreDependency(
                    alwaysTrue(),
                    resideInAnyPackage("..compartido..", "..configuracion.."));

    /**
     * Un ciclo entre modulos significa que falta un evento de dominio (docs/02 §6).
     *
     * <p>`configuracion` queda fuera del recuento por la misma razon que en la regla de
     * arriba: no es un modulo de negocio, es el cableado. La aplicacion lo necesita en las dos
     * direcciones —el cableado conoce los casos de uso, y los modulos leen sus propiedades
     * validadas— y llamar ciclo a eso convierte la regla en un estorbo que se acaba apagando.
     *
     * <p>Lo que la regla SI debe seguir cazando es un ciclo entre modulos de negocio de
     * verdad: identidad con catalogo, o comercio con aprendizaje. Eso siempre significa que
     * falta un evento.
     */
    @ArchTest
    static final ArchRule SIN_CICLOS_ENTRE_MODULOS = slices()
            .matching("com.academiadiegoromero.(*)..")
            .namingSlices("modulo $1")
            .should().beFreeOfCycles()
            .ignoreDependency(
                    resideInAnyPackage("..configuracion.."),
                    alwaysTrue())
            .ignoreDependency(
                    alwaysTrue(),
                    resideInAnyPackage("..configuracion.."));

    // Las cuatro reglas de sufijo llevan allowEmptyShould(true) porque hoy no existe todavia
    // ninguna clase Controlador, Adaptador ni Puerto: los modulos aun no se han construido.
    // Sin eso ArchUnit falla al no encontrar nada que revisar, que es su comportamiento por
    // defecto para que nadie crea que una regla protege cuando en realidad no mira nada.
    //
    // QUITAR ESTOS allowEmptyShould en cuanto el primer modulo tenga sus clases: a partir de
    // ahi, que una de estas reglas no encuentre nada SI es una senal de que algo se movio de
    // sitio, y conviene que vuelva a fallar.

    /** Un controlador traduce HTTP a caso de uso. Si toca el repositorio, hay logica fuera de sitio. */
    @ArchTest
    static final ArchRule LOS_CONTROLADORES_NO_TOCAN_REPOSITORIOS = noClasses()
            .that().haveSimpleNameEndingWith("Controlador")
            .should().dependOnClassesThat().haveSimpleNameEndingWith("Repositorio")
            .allowEmptyShould(true);

    /** Cada sufijo declara una capa: un adaptador dentro del dominio es un error de diseño. */
    @ArchTest
    static final ArchRule LOS_ADAPTADORES_VIVEN_EN_INFRAESTRUCTURA = classes()
            .that().haveSimpleNameEndingWith("Adaptador")
            .should().resideInAPackage("..infraestructura..")
            .allowEmptyShould(true);

    @ArchTest
    static final ArchRule LOS_CONTROLADORES_VIVEN_EN_WEB = classes()
            .that().haveSimpleNameEndingWith("Controlador")
            .should().resideInAPackage("..infraestructura.web..")
            .allowEmptyShould(true);

    @ArchTest
    static final ArchRule LOS_PUERTOS_VIVEN_EN_EL_DOMINIO = classes()
            .that().haveSimpleNameEndingWith("Puerto")
            .should().resideInAPackage("..dominio.puerto..")
            .allowEmptyShould(true);

    /**
     * Sin inyeccion por campo.
     *
     * <p>La inyeccion por constructor hace visible cuantas dependencias tiene realmente una
     * clase —una lista larga delata que acumula responsabilidades— y permite instanciarla en
     * un test sin levantar Spring.
     */
    @ArchTest
    static final ArchRule SIN_INYECCION_POR_CAMPO = noFields()
            .should().beAnnotatedWith(Autowired.class);

    /** docs/01 §10: el registro va por SLF4J. */
    @ArchTest
    static final ArchRule SIN_SALIDA_POR_CONSOLA = NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS;

    @ArchTest
    static final ArchRule SIN_JAVA_UTIL_LOGGING = NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING;

    /** docs/01 §9: excepciones propias por dominio, nunca RuntimeException desnuda. */
    @ArchTest
    static final ArchRule SIN_EXCEPCIONES_GENERICAS = NO_CLASSES_SHOULD_THROW_GENERIC_EXCEPTIONS;
}
