import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import BackButton from '../../../../core/presentation/designsystem/components/BackButton';
import { termsAndConditionsStyles as styles } from '../styles/TermsAndConditionsStyles';

const appTermsSections = [
  {
    body: 'Bienvenido/a a Patrónika, una aplicación diseñada para facilitar y modernizar la creación de patrones de tejido artesanal en técnicas como tapestry crochet, filet crochet e intarsia. Al acceder, descargar o utilizar esta aplicación móvil, usted acepta regirse por los presentes Términos y Condiciones de Uso. Si no está de acuerdo con estos términos, no utilice Patrónika.',
  },
  {
    title: '1. Aceptación de los términos',
    body: 'El uso de Patrónika implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. Nos reservamos el derecho de modificarlos en cualquier momento, siendo responsabilidad del usuario revisar periódicamente los términos vigentes.',
  },
  {
    title: '2. Descripción del servicio',
    body: 'Patrónika es una herramienta digital que permite a los usuarios generar, adaptar y visualizar patrones de tejido artesanal de manera intuitiva, precisa y eficiente. La aplicación promueve el consumo responsable y apoya la producción textil sostenible como alternativa al modelo de moda rápida (fast fashion).',
  },
  {
    title: '3. Uso permitido',
    body: 'Al utilizar Patrónika, usted se compromete a:\n\nUtilizar la aplicación únicamente con fines personales, educativos o profesionales lícitos.\nNo reproducir, distribuir, modificar, descompilar o realizar ingeniería inversa sobre la aplicación.\nNo utilizar la aplicación para crear, compartir o almacenar contenido ofensivo, ilegal o que infrinja derechos de terceros.\nNo usar la aplicación para fines comerciales sin autorización expresa.',
  },
  {
    title: '4. Registro y seguridad',
    body: 'Algunas funciones de Patrónika pueden requerir la creación de una cuenta y la verificación del correo electrónico mediante un código OTP. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y de todas las actividades que ocurran bajo su cuenta.',
  },
  {
    title: '5. Propiedad intelectual',
    body: 'Todos los derechos sobre el contenido, código fuente, diseño, interfaz y funcionalidades de la app son propiedad de los desarrolladores de Patrónika, salvo donde se indique lo contrario.\n\nLos patrones generados por los usuarios son propiedad de quienes los crean, aunque la app puede almacenar y procesar dichos datos para mejorar el servicio.\nNo está permitida la reproducción no autorizada de ningún contenido de la app sin consentimiento previo y por escrito.',
  },
  {
    title: '6. Limitación de responsabilidad',
    body: 'Patrónika se ofrece “tal cual”, sin garantías de ningún tipo, expresas o implícitas. No garantizamos que el servicio esté libre de errores o interrupciones. En ningún caso seremos responsables por daños directos, indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de la aplicación.',
  },
  {
    title: '7. Contenido generado por el usuario',
    body: 'Usted conserva los derechos sobre los patrones o diseños que cree con la app. Sin embargo, al usar Patrónika, otorga una licencia limitada para que la aplicación utilice dicha información con fines de análisis, mejora del servicio y, en casos específicos, para compartirla con la comunidad (si usted así lo autoriza).',
  },
  {
    title: '8. Política de privacidad',
    body: 'La recopilación y el uso de sus datos personales se rigen por nuestra Política de Privacidad. Esta incluye, pero no se limita a, el uso de datos para el envío de códigos de verificación, análisis de uso de la app y personalización de la experiencia del usuario.',
  },
  {
    title: '9. Terminación del servicio',
    body: 'Nos reservamos el derecho de suspender o cancelar el acceso de cualquier usuario que incumpla estos Términos y Condiciones, sin previo aviso.',
  },
  {
    title: '10. Legislación aplicable',
    body: 'Estos Términos se rigen por la legislación del país de residencia del titular de la aplicación. En caso de disputa, las partes se someterán a los tribunales competentes del mismo país.',
  },
  {
    title: '11. Contacto',
    body: 'Para dudas, comentarios o reclamos relacionados con estos Términos y Condiciones, por favor contáctanos a:\ncontacto@patronika.com',
  },
];

const cameraTermsSections = [
  {
    body: 'Estos Términos y Condiciones regulan el uso de la funcionalidad de captura y subida de imágenes dentro de la aplicación móvil Patrónika (en adelante, “la Aplicación”).',
  },
  {
    title: '1. Descripción de la Funcionalidad',
    body: 'La funcionalidad de captura y subida de imágenes permite al usuario:\n\nTomar una fotografía con la cámara del dispositivo, o\nSeleccionar una imagen desde la galería,\n\npara que la Aplicación genere automáticamente un patrón digital de tejido basado en dicha imagen.\n\nEl uso de esta funcionalidad requiere el cumplimiento de los presentes Términos y Condiciones.\nAl utilizarla, el usuario reconoce que ha tenido acceso a este documento —disponible desde el botón informativo junto a la opción “Capturar imagen”— y que comprende las reglas que rigen su uso.',
  },
  {
    title: '2. Permisos de Cámara y Galería',
    body: 'Para el correcto funcionamiento de esta herramienta, la Aplicación solicitará permisos de acceso a:\n\nLa cámara del dispositivo, y\nEl almacenamiento o galería de imágenes.\n\nEstos permisos se utilizan exclusivamente para permitir la selección o captura de imágenes necesarias para generar el patrón.\nEl usuario puede revocar estos permisos en cualquier momento desde la configuración del dispositivo, aunque al hacerlo podría limitarse el funcionamiento de esta característica.',
  },
  {
    title: '3. Procesamiento y Almacenamiento de Imágenes',
    body: 'Las imágenes que el usuario capture o suba se procesarán con el único fin de generar el patrón correspondiente dentro de la Aplicación.\n\nDependiendo de la configuración técnica, las imágenes podrán:\n\nProcesarse localmente en el dispositivo, o\nSubirse temporalmente a servicios de procesamiento automatizado, cuando sea necesario para la generación del patrón.\n\nEn ningún caso las imágenes serán utilizadas con otros fines ni compartidas con terceros sin el consentimiento expreso del usuario, salvo requerimiento legal.',
  },
  {
    title: '4. Conservación y Eliminación',
    body: 'Las imágenes cargadas o capturadas se conservarán únicamente durante el tiempo necesario para generar el patrón.\nUna vez completado el proceso, las imágenes originales se eliminan automáticamente o permanecen guardadas localmente si el usuario decide conservarlas en su dispositivo.\nLos patrones generados pueden almacenarse dentro de la Aplicación según las preferencias del usuario.',
  },
  {
    title: '5. Propiedad Intelectual',
    body: 'El usuario garantiza que posee los derechos o las autorizaciones necesarias sobre las imágenes que cargue o capture.\nPatrónika no se hace responsable por el uso de imágenes sujetas a derechos de autor, licencias o cualquier otro tipo de restricción legal.\n\nLos patrones generados a partir de las imágenes pertenecen al usuario, sin perjuicio de que Patrónika pueda utilizar información técnica anónima o agregada para mejorar el funcionamiento de la Aplicación.',
  },
  {
    title: '6. Derechos del Usuario',
    body: 'El usuario tiene derecho a:\n\nAcceder a las imágenes y patrones generados.\nSolicitar la eliminación de datos personales asociados al uso de la funcionalidad.\nRevocar el consentimiento para el uso de cámara o galería.\n\nLas solicitudes o dudas pueden enviarse a través del correo electrónico de contacto:\ncontacto@patronika.com',
  },
  {
    title: '7. Seguridad y Privacidad',
    body: 'Patrónika aplica medidas técnicas razonables para proteger las imágenes contra acceso no autorizado, pérdida o manipulación.\nNo obstante, el usuario reconoce que ningún sistema digital es completamente seguro.\n\nPara más información sobre el tratamiento de datos personales, puede consultarse la Política de Privacidad disponible en la Aplicación.',
  },
  {
    title: '8. Uso Responsable',
    body: 'El usuario se compromete a no subir ni capturar imágenes que:\n\nContengan contenido ilegal, ofensivo, violento o inapropiado.\nInfrinjan derechos de terceros (por ejemplo, marcas registradas, derechos de autor o privacidad).\nPuedan vulnerar leyes o normativas vigentes.\n\nPatrónika podrá suspender o limitar el acceso a la funcionalidad en caso de uso indebido.',
  },
  {
    title: '9. Modificaciones',
    body: 'Patrónika podrá actualizar estos Términos y Condiciones en cualquier momento.\nLas modificaciones entrarán en vigor desde su publicación en la Aplicación, y se notificará al usuario en caso de cambios sustanciales.',
  },
  {
    title: '10. Contacto',
    body: 'Para consultas o sugerencias relacionadas con esta funcionalidad, puedes comunicarte con el equipo de desarrollo a:\ncontacto@patronika.com',
  },
];

const termsContent = {
  app: appTermsSections,
  camera: cameraTermsSections,
};

export default function TermsAndConditionsScreen({ navigation, route }) {
  const kind = route.params?.kind === 'camera' ? 'camera' : 'app';
  const sections = termsContent[kind];

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Términos y condiciones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.updatedAt}>
          <Text style={styles.updatedAtBold}>Última actualización:</Text> 15/10/2025
        </Text>

        {sections.map((section, index) => (
          <View key={`${kind}-${index}`}>
            {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}
            <Text style={styles.paragraph}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
