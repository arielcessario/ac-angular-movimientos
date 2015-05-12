/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function () {

    'use strict';
    var app = angular.module('acMovimientos', ['acMovimientosList']);
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    app.service('MovimientoStockFinal', [function () {
        this.stocks_finales = [];
    }]);

    app.factory('MovimientosService',
        ['$http', 'MovimientosList', 'MovimientoStockFinal',
            function ($http, MovimientosList, MovimientoStockFinal) {
                var vm = this;

                var url = currentScriptPath.replace('movimientos-service.js', 'movimientos.php');

                var service = {};

                service.armarMovimiento = armarMovimiento;
                service.getBy = getBy;
                service.get = get;
                service.save = save;
                service.getMaxAsiento = getMaxAsiento;
                service.deleteAsiento = deleteAsiento;

                function armarMovimiento(tipo_asiento, subtipo_asiento, sucursal_id, forma_pago, transferencia_desde, total, descuento, detalle, items, cliente_id, usuario_id, comentario, callback) {
                    //Tipos:
                    //001 - Venta de productos
                    //002 - Compra de productos
                    //003 - Compra de insumos
                    //004 - Venta de Servicio
                    //005 - Cancelar TC
                    //006 - Compra Moneda Extranjera
                    //007 - Pago Sueldos
                    //008 - Pago Comisiones Bancarias
                    //009 - Pago Impuestos
                    //010 - Compra Bien de Uso
                    //011 - Intereses Ganados
                    //012 - Otros Gastos
                    //013 - Retiro caja chija
                    //014 - Otros Impuestos
                    //015 - Deudores

                    // Esta variable hace que se convierta el valor en negativo en la caja, significa que sale un valor
                    var pagando = 1;


                    var asiento = [];
                    switch (tipo_asiento) {
                        case '001':
                            for (var i = 0; i < items.length; i++) {
                                asiento.push(MovimientosList.ventaMercaderias(sucursal_id, items[i].producto_id, items[i].precio_unidad, items[i].cantidad, items[i].precio_total, 'Venta de producto', usuario_id));
                                getCosto(items[i], asiento, sucursal_id, usuario_id);

                            }
                            //pagando = -1;

                            break;
                        case '002':
                            for (var i = 0; i < items.length; i++) {
                                asiento.push(MovimientosList.mercaderias(sucursal_id, items[i].precio_unidad, 'Venta de Mercaderías', items[i].producto_id, items[i].cantidad));
                            }
                            break;
                        case '003':
                            for (var i = 0; i < items.length; i++) {
                                asiento.push(MovimientosList.insumos(sucursal_id, items[i].precio_unidad, 'Venta de Mercaderías', items[i].producto_id, items[i].cantidad));
                            }
                            break;
                        case '004':
                            asiento.push(MovimientosList.ventaServicio(sucursal_id, total, comentario, cliente_id, usuario_id));
                            //sucursal_id, importe, comentario, cliente_id, usuario_id
                            break;
                        case '005':
                            asiento.push(MovimientosList.tarjetasAPagar(sucursal_id, total, comentario, usuario_id));
                            pagando = -1;
                            break;
                        case '006': // El item contiene el monto en la moneda (monto_moneda), cotizacion, moneda_id
                            console.log('entra2');
                            break;
                        case '007':
                            if(subtipo_asiento == '01'){
                                asiento.push(MovimientosList.sueldos(sucursal_id, total, comentario, usuario_id));
                            }else{
                                asiento.push(MovimientosList.aguinaldos(sucursal_id, total, comentario, usuario_id));
                            }

                            pagando = -1;
                            break;
                        case '008':
                            //01 - GASTO INTERESES
                            //02 - MANTENIMIENTO DE CUENTAS
                            //03 - COMISIONES POR VENTAS CON TARJETA
                            asiento.push(MovimientosList.interesesComisiones(sucursal_id, total, comentario, subtipo_asiento, usuario_id));
                            pagando = -1;
                            break;
                        case '009':
                            //5.2.4.01	AGUA
                            //5.2.4.02	LUZ
                            //5.2.4.03	TELEFONOS Y FAX
                            //5.2.4.04	INTERNET
                            //5.2.4.05	ALQUILERES
                            //5.2.4.06	EXPENSAS
                            asiento.push(MovimientosList.impuestosGenerales(sucursal_id, total, comentario, subtipo_asiento, usuario_id));
                            pagando = -1;
                            break;
                        case '010':
                            console.log('entra2');
                            break;
                        case '011':
                            asiento.push(MovimientosList.interesesGanados(sucursal_id, total, comentario, subtipo_asiento, usuario_id));
                            break;
                        case '012':
                            asiento.push(MovimientosList.otrosGastos(sucursal_id, total, comentario, usuario_id));
                            pagando = -1;
                            break;
                        case '014':
                            //5.2.5.01	IMPUESTOS FISCALES Y MUNICIP.
                            //5.2.5.02	MONOTRIBUTO SOCIEDAD
                            //5.2.5.03	MONOTRIBUTO PERSONAL
                            //5.2.5.04	IDB
                            //5.2.5.05	SADAIC
                            //5.2.5.06	PERCEPCION GANANCIAS
                            //5.2.5.07	PERCEPCION IIBB
                            asiento.push(MovimientosList.otrosImpuestos(sucursal_id, total, comentario, subtipo_asiento, usuario_id));
                            pagando = -1;
                            break;
                        case '015':
                            if(forma_pago == '01' ||
                               forma_pago == '02' ||
                               forma_pago == '03' ||
                               forma_pago == '04' ||
                               forma_pago == '05' ||
                               forma_pago == '06'){
                                pagando = -1;
                            }
                            asiento.push(MovimientosList.deudores(sucursal_id, pagando * total, cliente_id, comentario, usuario_id));
                            pagando = 1;
                            break;
                    }



                    formas_pagos(forma_pago, sucursal_id, total, descuento, detalle, usuario_id,cliente_id,  pagando, comentario, asiento);

                    if(transferencia_desde !== '00'){
                        pagando = -1;
                        formas_pagos(transferencia_desde, sucursal_id, total, descuento, detalle, usuario_id,cliente_id,  pagando, comentario, asiento);
                    }


                    save(callback, asiento);

                    //console.log(asiento);
                    //console.log(MovimientoStockFinal.stocks_finales);

                }

                function formas_pagos(forma_pago, sucursal_id, total, descuento, detalle, usuario_id,cliente_id,  pagando, comentario, asiento){
                    //Formas de pago
                    //01 - Efectivo
                    //02 - TD
                    //03 - TC
                    //04 - Transferencia CA
                    //05 - Transferencia CC
                    //06 - Caja General
                    //07 - Clientes
                    switch (forma_pago) {
                        case '01':
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cajaChica(sucursal_id, pagando * (total - descuento), detalle, usuario_id));
                                asiento.push(MovimientosList.descuentos(descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cajaChica(sucursal_id, pagando * total, detalle, usuario_id));
                            }
                            break;
                        case '02':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal_id, pagando * (total - descuento), 'Cobro con Tarjeta de Debito', 'TD', usuario_id));
                                asiento.push(MovimientosList.descuentos(descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal, pagando * total, 'Cobro con Tarjeta de Debito', 'TD', usuario_id));
                            }
                            break;
                        case '03':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal_id, pagando * (total - descuento), 'Cobro con Tarjeta de Crédito', 'TC', usuario_id));
                                asiento.push(MovimientosList.descuentos(descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cobroTarjeta(sucursal_id, pagando * total, 'Cobro con Tarjeta de Crédito', 'TC', usuario_id));
                            }
                            break;
                        case '04':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.bancoCA(sucursal_id, pagando * (total - descuento), comentario, usuario_id));
                                asiento.push(MovimientosList.descuentos(descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.bancoCA(sucursal_id, pagando * total, comentario, usuario_id));
                            }
                            break;
                        case '05':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.bancoCC(sucursal_id, pagando * (total - descuento), comentario, usuario_id));
                                asiento.push(MovimientosList.descuentos(descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.bancoCC(sucursal_id, pagando * total, comentario, usuario_id));
                            }
                            break;
                        case '06':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.cajaGeneral(sucursal_id, pagando * (total - descuento), comentario, usuario_id));
                                asiento.push(MovimientosList.descuentos(descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.cajaGeneral(sucursal_id, pagando * total, comentario, usuario_id));
                            }
                            break;
                        case '07':
                            //sucursal, importe, comentario, tarjeta, usuario_id
                            if (descuento !== '' && descuento > 0) {
                                asiento.push(MovimientosList.deudores(sucursal_id, pagando * (total - descuento),cliente_id,  'Ingreso a Deudores', usuario_id));
                                asiento.push(MovimientosList.descuentos(descuento, 'Descuentos Otorgados', usuario_id));
                            } else {
                                asiento.push(MovimientosList.deudores(sucursal_id, pagando * total,cliente_id,  'Ingreso a Deudores', usuario_id));
                            }
                            break;

                    }

                    return asiento;
                }

                function getCosto(item, asiento, sucursal_id, usuario_id) {


                    var cant_a_vender = item.cantidad;
                    var stock_final_item = {};
                    var stocks_finales = [];

                    for (var i = 0; i < item.stock.length; i++) {
                        //console.log(new Date(item.stock[i].fecha_compra));
                        //sucursal_id, costo, comentario, producto_id, cantidad, usuario_id

                        if (cant_a_vender > 0 && item.stock[i].sucursal_id == sucursal_id) {
                            stock_final_item.stock_id = item.stock[i].stock_id;
                            if (cant_a_vender > item.stock[i].cant_actual) {

                                stock_final_item.cant_actual = 0;
                                asiento.push(MovimientosList.cmv(sucursal_id, item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, item.stock[i].cant_actual, usuario_id));
                                asiento.push(MovimientosList.mercaderias(sucursal_id, -1 * item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, item.stock[i].cant_actual, usuario_id));
                                cant_a_vender = cant_a_vender - item.stock[i].cant_actual;

                            } else if (cant_a_vender < item.stock[i].cant_actual) {

                                stock_final_item.cant_actual = item.stock[i].cant_actual - cant_a_vender;
                                asiento.push(MovimientosList.cmv(sucursal_id, item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, usuario_id));
                                asiento.push(MovimientosList.mercaderias(sucursal_id, -1 * item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, usuario_id));
                                cant_a_vender = 0;

                            } else if (cant_a_vender == item.stock[i].cant_actual) {

                                stock_final_item.cant_actual = 0;
                                asiento.push(MovimientosList.cmv(sucursal_id, item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, usuario_id));
                                asiento.push(MovimientosList.mercaderias(sucursal_id, -1 * item.stock[i].costo_uni, 'Venta de Mercaderías', item.producto_id, cant_a_vender, usuario_id));
                                cant_a_vender = 0;

                            }
                            stocks_finales.push(stock_final_item);
                            stock_final_item = {};
                        }
                    }

                    MovimientoStockFinal.stocks_finales = stocks_finales;

                    return asiento;


                }


                function getMaxAsiento(callback) {
                    return $http.post(url,
                        {'function': 'getmaxasiento'})
                        .success(function (data) {
                            callback(data);
                        })
                        .error();
                }


                function getBy(params, callback) {
                    return $http.post(url,
                        {"function": "getby"})
                        .success(callback)
                        .error(function (data) {

                        });

                }

                function get(callback) {
                    //return $http.post('./api/login.php', { username: username, password: password });
                    return $http.post('./directives/cuentas/api/cuentas.php',
                        {"function": "get"},
                        {cache: true})
                        .success(callback)
                        .error(function (data) {
                            //console.log(data);
                            vm.error = data.Message;
                            vm.dataLoading = false;
                        });
                }

                function deleteAsiento(id, sucursal_id, callback) {
                    return $http.post(url,
                        {"function": "deleteAsiento", "id": id, "sucursal_id": sucursal_id})
                        .success(function (data) {
                            callback(data);
                        })
                        .error(error)
                }


                function save(callback, params) {
                    return $http.post(url,
                        {"function": "save", "params": JSON.stringify(params)},
                        {cache: true})
                        .success(function (data) {
                            results(callback, data)
                        })
                        .error(function (data) {
                            error(data)
                        });
                }


                function error(data) {
                    vm.error = data.Message;
                    vm.dataLoading = false;
                }

                function results(callback, data) {
                    if (data.Error === undefined) {
                        callback(data);
                    } else {
                    }
                }

                return service;
            }]);


})()
/**
 * Created by desa on 1/2/15.
 */
