/* Banco editorial: seis situaciones por estructura; no requiere descargas. */
(() => {
  const structures = [
    ['present_be','Present BE','Ser o estar en el presente; describir identidad, estado o ubicación.','Sujeto + am/is/are + complemento','BE es el verbo principal aquí. En continuos y pasiva también puede funcionar como auxiliar.'],
    ['past_be','Past BE','Ser o estar en un momento terminado del pasado.','Sujeto + was/were + complemento','Describe un estado pasado; no una acción con un verbo léxico.'],
    ['present_simple','Present Simple','Hábitos, rutinas y hechos generales.','+ sujeto + verbo (he/she/it: -s) · − do/does not + verbo base · ? Do/Does + sujeto + verbo base','A diferencia del continuo, interesa la rutina, no una acción que ocurre ahora.'],
    ['past_simple','Past Simple','Acciones terminadas en un período acabado del pasado.','+ sujeto + V2 · − did not + verbo base · ? Did + sujeto + verbo base','Con yesterday o un momento pasado terminado usamos normalmente Past Simple; Present Perfect conecta el pasado con el presente.'],
    ['present_continuous','Present Continuous','Acciones en progreso ahora y situaciones temporales.','Sujeto + am/is/are + verbo-ing · negativa: not tras BE · pregunta: BE antes del sujeto','Present Simple expresa hábitos; el continuo destaca lo que está ocurriendo o es temporal.'],
    ['past_continuous','Past Continuous','Acción en progreso en un momento del pasado, o como fondo de otra acción.','Sujeto + was/were + verbo-ing · negativa: not tras BE · pregunta: BE antes del sujeto','Past Simple cuenta una acción terminada; el continuo muestra lo que estaba ocurriendo en ese momento.'],
    ['present_perfect','Present Perfect','Experiencias hasta ahora y acciones pasadas con resultado o relación con el presente.','Sujeto + have/has + V3 · negativa: not tras have/has · pregunta: Have/Has antes del sujeto','Past Simple sitúa la acción en un período terminado; aquí importa la experiencia o el resultado actual.'],
    ['past_perfect','Past Perfect','Acción anterior a otro momento o acción del pasado.','Sujeto + had + V3 · negativa: had not · pregunta: Had + sujeto + V3','Present Perfect conecta con ahora; Past Perfect mira hacia atrás desde otro momento pasado. Con before, Past Simple también puede ser válido si el orden queda claro.'],
    ['modal','Modal verbs','Capacidad, permiso, consejo, posibilidad, disposición y predicciones.','Sujeto + modal + verbo base · negativa: modal + not · pregunta: modal antes del sujeto','El modal cambia el significado: can/could (capacidad o permiso), should (consejo), may/might (posibilidad), would (condición), will (predicción o disposición).'],
    ['passive','Passive Voice','Enfocar a la persona o cosa que recibe una acción.','Sujeto receptor + am/is/are o was/were + V3','La pasiva usa BE + participio pasado (V3); el continuo usa BE + verbo-ing. La voz activa enfatiza quién hace la acción.'],
    ['tag','Tag Questions','Solicitar confirmación sobre una afirmación o negación.','Afirmación + auxiliar negativo + pronombre? · Negación + auxiliar positivo + pronombre?','La coletilla repite el auxiliar y cambia la polaridad. Con presente o pasado simple sin auxiliar explícito, usa do/does/did.']
  ].map(([id,name,usage,formula,contrast]) => ({id,name,usage,formula,contrast}));
  // [situación ES, modelo EN, polaridad, explicación, alternativas EN opcionales]
  const rows = {
    present_be:[
      ['Ella es profesora.','She is a teacher.','positive','She lleva is; a introduce una profesión singular.'],
      ['Estoy en la biblioteca.','I am in the library.','positive','I se combina con am para expresar ubicación.'],
      ['Mis hermanos no están cansados.','My brothers are not tired.','negative','El sujeto plural lleva are; not niega el estado.'],
      ['Este café no está caliente.','This coffee is not hot.','negative','Coffee es singular y lleva is not.'],
      ['¿Estás listo para el examen?','Are you ready for the exam?','question','Are va delante de you en la pregunta.'],
      ['¿Es tu vecina médica?','Is your neighbor a doctor?','question','Is va antes del sujeto singular.', ['Is your neighbour a doctor?']]
    ],
    past_be:[
      ['Ella era profesora en aquella época.','She was a teacher at that time.','positive','Was describe su profesión en el pasado.'],
      ['Ayer estuvimos en el museo.','We were at the museum yesterday.','positive','We lleva were; yesterday sitúa el estado en el pasado.'],
      ['Anoche no estaba preocupado.','I was not worried last night.','negative','I lleva was not para negar el estado pasado.'],
      ['Los niños no estaban en casa al mediodía.','The children were not at home at noon.','negative','Children es plural y lleva were not.'],
      ['¿Estaba abierta la tienda ayer?','Was the shop open yesterday?','question','Was precede al sujeto; open describe un estado.', ['Was the store open yesterday?']],
      ['¿Estaban tus amigos en el concierto anoche?','Were your friends at the concert last night?','question','Were va antes del sujeto plural.']
    ],
    present_simple:[
      ['Ella trabaja todos los días.','She works every day.','positive','Una rutina con she añade -s al verbo.'],
      ['Tomamos el autobús los lunes.','We take the bus on Mondays.','positive','We usa el verbo base para una rutina.'],
      ['Mi padre no come carne.','My father does not eat meat.','negative','Does not lleva eat en forma base, sin -s.'],
      ['No vivo cerca de la estación.','I do not live near the station.','negative','I lleva do not + verbo base.'],
      ['¿Tu hermana toca el piano habitualmente?','Does your sister play the piano regularly?','question','Does marca la tercera persona; play queda en forma base.'],
      ['¿A qué hora abren el mercado cada día?','What time do they open the market every day?','question','La palabra interrogativa precede a do + sujeto + verbo.']
    ],
    past_simple:[
      ['Ella trabajó ayer.','She worked yesterday.','positive','Worked es pasado regular; yesterday es un período terminado.'],
      ['Compré una bicicleta el sábado pasado.','I bought a bike last Saturday.','positive','Bought es el pasado irregular de buy.', ['I bought a bicycle last Saturday.']],
      ['No vimos la película anoche.','We did not watch the movie last night.','negative','Después de did not se usa watch, no watched.', ['We did not see the film last night.']],
      ['Él no trajo su cuaderno ayer.','He did not bring his notebook yesterday.','negative','Did not lleva bring en forma base.'],
      ['¿Visitaste a tu abuela el domingo pasado?','Did you visit your grandmother last Sunday?','question','Did va antes del sujeto y visit queda en forma base.'],
      ['¿Dónde dejaron las llaves ayer?','Where did they leave the keys yesterday?','question','Where + did + sujeto + leave pregunta por una acción terminada.']
    ],
    present_continuous:[
      ['Ella está trabajando ahora.','She is working now.','positive','Is + working expresa una acción en progreso.'],
      ['Estamos preparando la cena en este momento.','We are preparing dinner right now.','positive','Are + preparing indica lo que sucede ahora.'],
      ['No estoy escuchando música ahora.','I am not listening to music now.','negative','Not se coloca entre am y listening.'],
      ['El bebé no está durmiendo en este momento.','The baby is not sleeping at the moment.','negative','Is not + sleeping niega una acción en progreso.'],
      ['¿Estás esperando el autobús ahora?','Are you waiting for the bus now?','question','Are precede a you; waiting conserva -ing.'],
      ['¿Dónde se está alojando tu primo esta semana? Es una visita temporal.','Where is your cousin staying this week?','question','El continuo puede expresar una situación temporal, aunque no ocurra justo al hablar.']
    ],
    past_continuous:[
      ['Ella estaba trabajando ayer a las ocho; describe lo que ocurría en ese momento.','She was working yesterday at eight.','positive','Was + working enfoca la acción en progreso a esa hora.'],
      ['Ayer a las ocho de la noche, yo estaba estudiando inglés.','I was studying English yesterday at 8 PM.','positive','I lleva was; studying muestra la acción en progreso.', ['Yesterday at 8 PM, I was studying English.']],
      ['No estaba conduciendo cuando llamaste.','I was not driving when you called.','negative','La acción de conducir es el fondo; called es el evento puntual.'],
      ['Los estudiantes no estaban hablando cuando entró la directora.','The students were not talking when the principal came in.','negative','Were not talking niega la actividad en progreso.'],
      ['¿Estabas cocinando cuando se fue la luz?','Were you cooking when the power went out?','question','Were + you + cooking pregunta por la acción en curso.'],
      ['¿Qué estaban haciendo tus vecinos ayer a medianoche?','What were your neighbors doing at midnight yesterday?','question','What precede a were + sujeto + doing.', ['What were your neighbours doing at midnight yesterday?']]
    ],
    present_perfect:[
      ['Ella ha terminado su trabajo; ya está listo para entregarlo.','She has finished her work.','positive','Has + finished presenta un resultado disponible ahora.'],
      ['He visitado Perú dos veces en mi vida, hasta ahora.','I have visited Peru twice.','positive','Have + visited habla de experiencia sin fijar un período terminado.'],
      ['Todavía no hemos recibido el paquete.','We have not received the package yet.','negative','Have not + received y yet indican una espera que continúa.'],
      ['Mi hermano nunca ha probado sushi en su vida, hasta ahora.','My brother has never tried sushi.','negative','Never expresa la negación de una experiencia; no se añade not.'],
      ['¿Alguna vez has viajado en avión? Me refiero a tu vida hasta hoy.','Have you ever traveled by plane?','question','Have + sujeto + V3 con ever pregunta por una experiencia.', ['Have you ever travelled by plane?']],
      ['¿Ha llegado ya el tren? Estamos esperando su llegada.','Has the train arrived yet?','question','Has + arrived pregunta por un resultado relacionado con ahora.']
    ],
    past_perfect:[
      ['Ella ya se había ido cuando llegué.','She had already left when I arrived.','positive','Had left ocurrió antes de arrived.'],
      ['Cuando empezó la lluvia, ya habíamos guardado las sillas.','We had already put the chairs away when the rain started.','positive','Had put sitúa la acción antes del inicio de la lluvia.'],
      ['No había desayunado cuando comenzó la reunión.','I had not had breakfast when the meeting started.','negative','El primer had es auxiliar; el segundo es el participio de have.'],
      ['Ellos nunca habían visto nieve antes de ese viaje.','They had never seen snow before that trip.','negative','Had never seen describe la ausencia de experiencia hasta un momento pasado.'],
      ['¿Habías leído el libro antes de ver la película? Enfoca lo que ya estaba terminado.','Had you read the book before you watched the movie?','question','Had + sujeto + read (V3) enfatiza la acción previa; con before también puede usarse Past Simple.', ['Did you read the book before you watched the movie?']],
      ['¿Había terminado él el informe cuando llegó su jefa?','Had he finished the report when his boss arrived?','question','Had finished pregunta si el informe ya estaba completo en ese momento.']
    ],
    modal:[
      ['Ella sabe nadar; expresa su capacidad.','She can swim.','positive','Can expresa capacidad y va seguido de swim en forma base.'],
      ['Ella debería descansar; dale un consejo.','She should rest.','positive','Should expresa consejo, no obligación absoluta.'],
      ['Cuando era pequeño, no podía alcanzar el estante.','When I was little, I could not reach the shelf.','negative','Could not expresa falta de capacidad en el pasado.'],
      ['Puede que Marta no venga mañana; expresa una posibilidad incierta.','Marta might not come tomorrow.','negative','Might not expresa la posibilidad de que no venga.', ['Marta may not come tomorrow.']],
      ['¿Puedo entrar? Pide permiso de manera formal.','May I come in?','question','May puede pedir permiso; can y could también son válidos según el registro.', ['Can I come in?', 'Could I come in?']],
      ['¿Vendrías a la fiesta si tuvieras tiempo?','Would you come to the party if you had time?','question','Would + verbo base expresa una situación hipotética.']
    ],
    passive:[
      ['La puerta fue abierta por el guardia. Enfoca lo que le ocurrió a la puerta.','The door was opened by the guard.','positive','Was + opened (V3) forma la pasiva en pasado.'],
      ['Estas habitaciones se limpian todos los días. Enfoca las habitaciones.','These rooms are cleaned every day.','positive','Are + cleaned forma una pasiva habitual en presente.'],
      ['El puente no fue reparado el año pasado. Enfoca el puente.','The bridge was not repaired last year.','negative','Was not + repaired niega una acción recibida en el pasado.'],
      ['Las entradas no se venden aquí. Enfoca las entradas.','Tickets are not sold here.','negative','Are not + sold; sold es el participio de sell.'],
      ['¿Fue enviada la carta ayer? Enfoca la carta.','Was the letter sent yesterday?','question','Was precede al receptor; sent es V3 de send.'],
      ['¿Se cultiva arroz en esta región? Enfoca el arroz.','Is rice grown in this region?','question','Is + rice + grown forma una pregunta pasiva en presente.']
    ],
    tag:[
      ['Estás listo, ¿verdad? Usa una coletilla para confirmar.','You are ready, aren\'t you?','positive','La afirmación con are lleva aren’t you en la coletilla.'],
      ['Ella trabaja aquí, ¿verdad? Usa una coletilla para confirmar.','She works here, doesn\'t she?','positive','Works requiere does; la coletilla negativa es doesn’t she.'],
      ['Ellos no estaban cansados, ¿verdad? Usa una coletilla para confirmar.','They were not tired, were they?','negative','Una oración negativa con were not lleva coletilla positiva.'],
      ['Él no sabe conducir, ¿verdad? Usa una coletilla para confirmar.','He cannot drive, can he?','negative','La negación con can lleva can he en la coletilla.'],
      ['Tú visitaste Londres, ¿verdad? Usa una coletilla para confirmar.','You visited London, didn\'t you?','positive','Visited requiere did en la coletilla, con polaridad negativa.'],
      ['Ella vendrá mañana, ¿verdad? Usa una coletilla para confirmar.','She will come tomorrow, won\'t she?','positive','Will expresa una predicción; su coletilla negativa usa won’t.']
    ]
  };
  const situations = structures.flatMap(s => rows[s.id].map(([front_es,answer_en,polarity,explanation_es,alternatives_en=[]],i)=>({id:`${s.id}-${i+1}`,structure:s.id,front_es,answer_en,polarity,explanation_es,alternatives_en})));
  window.GRAMMAR = {structures,situations};
})();
