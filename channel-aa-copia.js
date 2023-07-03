/*jshint node:true*/
'use strict';

const mysql = require('mysql')
const moment = require('moment')

const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123',
    database:'lab3sistel'
})

conexion.connect( function(error){
	if(error){
		throw error;
	}else{
		console.log('conexion base de datos exitosa');
	}
/////////////////////////////////////////////////////////////////////////////////////////////

	var ari = require('ari-client');
	var util = require('util');

	ari.connect('http://localhost:8088', 'asterisk', 'asterisk', configuracion);

	var menu = {
	  // menu de options
	  opciones: [1, 2, 3],
	  //sounds: ['sound:press-1', 'sound:press-2', 'sound:press-3']
	};



	function configuracion(err,client){
			if(err){
			throw err;
			};
			console.log('Conexion exitosa');
			client.on('StasisStart', INGRESO);
			client.on('StasisEnd',SALIDA);


		function INGRESO(event,channel){
		console.log('ingresó el usuario %s con id unica %s',channel.name,channel.id);
		channel.on('ChannelDtmfReceived', VERIFICACION);

		console.log('Bienvenido a la veteriaria de coco... Marque 1 para consultar productos... Marque 2 para agendar Cita... Marque 3 para comunicarse con un asesor');
		               channel.play({ media: 'sound:menumio' }, (err) => {
                         if (err) {
                         //console.error('Error al reproducir el audio:', err);
                         } else {
                         //console.log('Audio reproducido exitosamente');
                              }
                        });

		////////////////////////////////encontrar asesor
		 client.channels.list(function(err, channels) {
		    if (err) {
		      throw err;
		    }
		    var targetExtension = 'ext201'; // La extensión que deseas buscar

		    // Buscar el canal por la extensión
		     var targetChannel = channels.find(function(channel) {

		      // Comparar la extensión del canal con la extensión objetivo
		      return channel.name.includes(targetExtension);
		    });

		    if ( channel.name.includes(targetExtension)) {
		      // console.log('Canal encontrado:', targetChannel); //para ver las caracteristicas del asesor
		      // Realiza las acciones que desees con el canal encontrad
			console.log('Asesor 1 Disponible');
			}

		    var targetExtension = 'ext700'; // La extensión que deseas buscar

		    // Buscar el canal por la extensión
		     var targetChannel = channels.find(function(channel) {
		      // Comparar la extensión del canal con la extensión objetivo
		      return channel.name.includes(targetExtension);
		    });
		    if ( channel.name.includes(targetExtension)) {
		      // console.log('Canal encontrado:', targetChannel); //para ver las caracteristicas del asesor
		      // Realiza las acciones que desees con el canal encontrad
			console.log('Asesor 2 Disponible');
			}



		  });
		////////////////////////////////termina encontrar asesor
		};

		function SALIDA(event,channel){
		console.log('Salió el usuario %s con id unica %s',channel.name,channel.id);
		channel.removeListener('ChannelDtmfReceived', VERIFICACION);
		}

		function VERIFICACION(event,channel){
		var digito = parseInt(event.digit);
		console.log('NUMERO MARCADO ',digito);
			if(~menu.opciones.indexOf(digito)){
			channel.removeListener('ChannelDtmfReceived', VERIFICACION);
			MARCADO(channel,digito,event);
			}else{
			console.log('opcion no valida');
			console.log('volver a reproducir las opciones');

		     

let audioReproducido = false;
  if (!audioReproducido) {
    channel.play({ media: 'sound:opcionincorrecta' }, (err) => {
      if (err) {
        //console.error('Error al reproducir el audio:', err);
      } else {
        //console.log('Audio reproducido exitosamente');
      }
    });
    audioReproducido = true;
  }

			INGRESO(event,channel);
			}
		}

		///////////
		function MARCADO(channel,digito,event){

		var ext = channel.caller.number;
		switch (digito){
		case 1:
		console.log('SERVICIOS');

		                channel.play({ media: 'sound:productoss' }, (err) => {
                         if (err) {
                         //console.error('Error al reproducir el audio:', err);
                         } else {
                         //console.log('Audio reproducido exitosamente');
                              }
                        });
		INGRESO(event,channel);


		break;

		case 2:
			console.log('AGENDAR CITA');
			var digitosfecha='';
			var digitoscedula ='';
			console.log("Digite fecha en formato; DDMMAAAA");
				channel.play({ media: 'sound:fecha' }, (err) => {
		     	 if (err) {
		       	 //console.error('Error al reproducir el audio:', err);
		     	 } else {
		       	 //console.log('Audio reproducido exitosamente');
  			      }
			});

			function fechainvalida(event,channel){
			 digitosfecha='';
			event.digit='';
			console.log("Digite nuevamente la fecha en el formato DDMMAAAA");
			channel.play({ media: 'sound:digitenuevamente' }, (err) => {
		     	 if (err) {
		       	 //console.error('Error al reproducir el audio:', err);
		     	 } else {
		       	 //console.log('Audio reproducido exitosamente');
  			      }
			});

			GUARDARFECHA(event,channel);
			}

			channel.on('ChannelDtmfReceived',GUARDARFECHA);
			 function GUARDARFECHA(event, channel){
	  		var digito = event.digit;
			digitosfecha += digito;
		//	console.log("digitos",digitosfecha);  //verificacion
				if(digitosfecha.length === 8){
				const textoFecha = digitosfecha;
				const fecha = moment(textoFecha, 'DDMMYYYY').toDate();
				console.log("fecha capturada",fecha);
					if(moment(fecha).isValid()){
					}else{
					console.log('FORMATO INVALIDO');
					digitosfecha ='';
	 				fechainvalida(event,channel);
					return;
					}

				channel.removeListener('ChannelDtmfReceived', GUARDARFECHA);
				console.log('AHORA DIGITE SU CEDULA');

			channel.play({ media: 'sound:cedula' }, (err) => {
		     	 if (err) {
		       	 //console.error('Error al reproducir el audio:', err);
		     	 } else {
		       	 //console.log('Audio reproducido exitosamente');
  			      }
			});




					channel.on('ChannelDtmfReceived', function(event, channel){
					var digitoc = event.digit;

					digitoscedula += digitoc;
				if(event.digit === '*'){
					//	if(digitoscedula.length === 10){
							var cedula=digitoscedula.slice(0, -1);
						console.log("cedula capturada", cedula);
/////////////////////////////////////////////////////////////////////////////////
							// Transformar el texto en una fecha utilizando Moment.js
							const fecha = moment(textoFecha, 'DDMMYYYY').toDate();
							// Insertar la fecha y la cédula en la base de datos MySQL
							const insertar = 'INSERT INTO reserva (cedula, fecha) VALUES (?, ?)';
							const values = [cedula, fecha];
							conexion.query(insertar, values, (error, results) => {
							if (error) throw err
							console.log('Datos insertados correctamente en la base de datos.');
							digitosfecha='';
							digitoscedula='';
											
				  channel.play({ media: 'sound:confirmareserva' }, (err) => {
				                         if (err) {
				                         //console.error('Error al reproducir el audio:', err);
				                         } else {
				                         //console.log('Audio reproducido exitosamente');
				                              }
				                        });
						


							INGRESO(event,channel);

							});
/////////////////////////////////////////////////////////////////////////////////
					//	}

				}
					});
				};
			};
		break;

		case 3:
		const params = {
		 extension: '611', // Número de destino
		  endpoint: `SIP/ext201`, // Número de origen
		  app: 'channel-aa-copia', // Nombre de la aplicación en ARI
		  appArgs: 'some arguments', // Argumentos de la aplicación (opcional)
		  context: 'default' // Contexto de llamada (opcional)
		};

		channel.originate(params, (err, channel) => {
		  if (err) {
		    console.error('Error al realizar la llamada:', err);
		  } else {
		    console.log('Llamada realizada correctamente:', channel.id);
	
		  }
		});

	INGRESO(event,channel);
		break;
		}

		//////////
		}

		client.start('channel-aa-copia');
	};

})
