

/**
 * @ngdoc service
 * @name angularJs01App.login
 * @description
 * # login
 * Service in the angularJs01App.
 */
(function(){

    'use strict';
    var app = angular.module('acMovimientos', ['acMovimientosList']);
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    app.service('MovimientoStockFinal', [function(){
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

                function armarMovimiento(tipo_asiento, sucursal, forma_pago, total, descuento, detalle, items, callback){
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




                    var asiento = [];
                    switch (tipo_asiento){
                        case '001':
                            for(var i = 0; i<items.length; i++){
                                asiento.push(MovimientosList.ventaMercaderias(items[i].producto_id, items[i].precio_unidad, items[i].cantidad, items[i].precio_total, 'Venta de producto'));


                                //console.log(asiento);
                                getCosto(items[i], asiento);
                                //for(var x =0; x<items[0].stocks; x++){
                                //    asiento.push(MovimientosList.mercaderias(items[i].costo, detalle, items[i].producto_id));
                                //    asiento.push(MovimientosList.cmv(items[i].costo, detalle, items[i].producto_id));
                                //}
                                //console.log(asiento);

                            }

                            break;
                        case '002':
                            console.log('entra2');
                            break;
                        case '003':
                            console.log('entra2');
                            break;
                        case '004':
                            console.log('entra2');
                            break;
                        case '005':
                            console.log('entra2');
                            break;
                        case '006': // El item contiene el monto en la moneda (monto_moneda), cotizacion, moneda_id
                            console.log('entra2');
                            break;
                        case '007':
                            console.log('entra2');
                            break;
                        case '008':
                            console.log('entra2');
                            break;
                        case '009':
                            console.log('entra2');
                            break;
                        case '010':
                            console.log('entra2');
                            break;
                        case '011':
                            console.log('entra2');
                            break;
                        case '012':
                            console.log('entra2');
                            break;
                    }


                    //Formas de pago
                    //01 - Efectivo
                    //02 - TD
                    //03 - TC
                    //04 - Transferencia CA
                    //05 - Transferencia CC
                    switch (forma_pago){
                        case '01':
                            if(descuento !== '' && descuento>0){
                                asiento.push(MovimientosList.cajaChica(sucursal, total - descuento, detalle));
                                asiento.push(MovimientosList.descuentos(descuento, detalle));
                            }else{
                                asiento.push(MovimientosList.cajaChica(sucursal, total, detalle));
                            }
                            break;
                        case '02':
                            break;
                        case '03':
                            break;
                        case '04':
                            break;
                        case '05':
                            break;

                    }


                    save(callback, asiento);

                    //console.log(asiento);
                    //console.log(MovimientoStockFinal.stocks_finales);

                }

                function getCosto(item, asiento){


                    var cant_a_vender = item.cantidad;
                    var stock_final_item = {};
                    var stocks_finales= [];

                    for(var i = 0; i<item.stock.length; i++){
                        //console.log(new Date(item.stock[i].fecha_compra));

                        if(cant_a_vender > 0){
                            stock_final_item.stock_id = item.stock[i].stock_id;
                            if(cant_a_vender > item.stock[i].cant_actual){

                                stock_final_item.cant_final = 0;
                                asiento.push(MovimientosList.cmv(item.stock[i].costo_uni,'',item.producto_id, item.stock[i].cant_actual));
                                asiento.push(MovimientosList.mercaderias(item.stock[i].costo_uni,'',item.producto_id, item.stock[i].cant_actual));
                                cant_a_vender = cant_a_vender - item.stock[i].cant_actual;

                            }else if(cant_a_vender < item.stock[i].cant_actual){

                                stock_final_item.cant_final = item.stock[i].cant_actual - cant_a_vender;
                                asiento.push(MovimientosList.cmv(item.stock[i].costo_uni,'',item.producto_id, cant_a_vender));
                                asiento.push(MovimientosList.mercaderias(item.stock[i].costo_uni,'',item.producto_id, cant_a_vender));
                                cant_a_vender = 0;

                            }else if (cant_a_vender == item.stock[i].cant_actual){

                                stock_final_item.cant_final = 0;
                                asiento.push(MovimientosList.cmv(item.stock[i].costo_uni,'',item.producto_id, cant_a_vender));
                                asiento.push(MovimientosList.mercaderias(item.stock[i].costo_uni,'',item.producto_id, cant_a_vender));
                                cant_a_vender = 0;

                            }
                            stocks_finales.push(stock_final_item);
                            stock_final_item = {};
                        }
                    }

                    MovimientoStockFinal.stocks_finales = stocks_finales;

                    return asiento;


                }




                function getMaxAsiento(callback){
                    return $http.post(url,
                        {'function': 'getmaxasiento'})
                        .success(function(data){
                            callback(data);
                        })
                        .error();
                }


                function getBy(params, callback){
                    return $http.post(url,
                        {"function":"getby"})
                        .success(callback)
                        .error(function(data){

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

                function deleteAsiento(id){
                    return $http.post(url,
                        {"function": "deleteasiento", "id":id})
                        .success(function (data){results(function(){}, data)})
                        .error(error)
                }


                function save(callback, params) {
                    return $http.post(url,
                        {"function": "save", "params": JSON.stringify(params)},
                        {cache: true})
                        .success(function(data){results(callback,data)})
                        .error(function (data) {error(data)});
                }


                function error(data){
                    vm.error = data.Message;
                    vm.dataLoading = false;
                }

                function results(callback, data){
                    if(data.Error=== undefined){
                        callback(data);
                    }else{
                    }
                }

                return service;
            }]);


})()/**
 * Created by desa on 1/2/15.
 */
