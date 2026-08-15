package com.academiadiegoromero.identidad.infraestructura.web;

import com.academiadiegoromero.compartido.dominio.modelo.Correo;
import com.academiadiegoromero.identidad.aplicacion.dto.PerfilExterno;
import com.academiadiegoromero.identidad.dominio.excepcion.PerfilExternoIncompletoExcepcion;
import com.academiadiegoromero.identidad.dominio.modelo.ProveedorIdentidad;
import java.util.Locale;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

/**
 * Traduce lo que devuelve el proveedor a un {@link PerfilExterno} del dominio.
 *
 * <p>Es la aduana. A partir de aqui, ni la aplicacion ni el dominio ven un solo tipo de
 * Spring ni una clave de Google, asi que el caso de uso se prueba sin levantar nada.
 *
 * <p><b>Nada de lo que llega se da por bueno.</b> El proveedor es un tercero: si falta el
 * correo o el identificador, se corta con un error explicito en vez de continuar con un
 * nulo que reventaria tres capas mas abajo, donde ya nadie sabria de donde vino.
 */
@Component
public class TraductorPerfilOidc {

    /** Claves del estandar OpenID Connect. Google las cumple; se nombran una sola vez. */
    private static final String CLAVE_SUJETO = "sub";
    private static final String CLAVE_CORREO = "email";
    private static final String CLAVE_CORREO_VERIFICADO = "email_verified";
    private static final String CLAVE_NOMBRE = "name";

    /**
     * @param idRegistro identificador de la registracion de Spring («google», «facebook»)
     * @param usuario lo que el proveedor devolvio
     */
    public PerfilExterno traducir(String idRegistro, OAuth2User usuario) {
        String sujeto = exigir(usuario, CLAVE_SUJETO);
        String correo = exigir(usuario, CLAVE_CORREO);

        return new PerfilExterno(
                proveedorDe(idRegistro),
                sujeto,
                new Correo(correo),
                nombreVisible(usuario, correo),
                Boolean.TRUE.equals(usuario.getAttribute(CLAVE_CORREO_VERIFICADO)));
    }

    /**
     * Sin nombre se usa la parte local del correo.
     *
     * <p>Es preferible a rechazar el ingreso por un campo que el proveedor no esta obligado
     * a entregar: el nombre es cosmetico y el correo ya identifica a la persona.
     */
    private String nombreVisible(OAuth2User usuario, String correo) {
        String nombre = texto(usuario, CLAVE_NOMBRE);
        return nombre != null ? nombre : correo.substring(0, correo.indexOf('@'));
    }

    private String exigir(OAuth2User usuario, String clave) {
        String valor = texto(usuario, clave);
        if (valor == null) {
            throw new PerfilExternoIncompletoExcepcion(clave);
        }
        return valor;
    }

    private ProveedorIdentidad proveedorDe(String idRegistro) {
        try {
            return ProveedorIdentidad.valueOf(idRegistro.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException noConocido) {
            throw new PerfilExternoIncompletoExcepcion("proveedor " + idRegistro);
        }
    }

    private String texto(OAuth2User usuario, String clave) {
        Object valor = usuario.getAttribute(clave);
        if (valor == null) {
            return null;
        }
        String texto = valor.toString().trim();
        return texto.isEmpty() ? null : texto;
    }
}
