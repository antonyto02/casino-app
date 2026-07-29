export function Privacy() {
  return (
    <div className="privacy-page page">
      <h2>Aviso de privacidad y propósito educativo</h2>
      <p>
        Casino Zero Trust es un laboratorio educativo desarrollado como
        proyecto académico. Ninguno de los premios, fichas o beneficios
        mostrados es real, y no se procesan pagos ni datos financieros.
      </p>
      <ul>
        <li>
          Las cuentas de usuario son ficticias: no ingreses contraseñas ni
          datos que uses en otros servicios.
        </li>
        <li>
          El acceso a cámara y micrófono solo genera una vista previa en vivo
          en tu propio navegador; nunca se graba, almacena ni transmite al
          servidor.
        </li>
        <li>
          La ubicación obtenida se muestra únicamente en pantalla y no se
          guarda en la base de datos.
        </li>
        <li>
          Las notificaciones son generadas localmente por tu navegador con
          fines de demostración, nunca enviadas desde un servidor externo.
        </li>
        <li>
          Se registra únicamente qué tipo de permiso fue solicitado, concedido
          o denegado, y en qué contexto, para poder mostrarte el resumen del
          dashboard de concientización.
        </li>
      </ul>
      <p>
        Este laboratorio se ejecuta en un entorno controlado y con fines
        exclusivamente educativos, como parte de un Proyecto Final Integrador
        académico.
      </p>
    </div>
  );
}
