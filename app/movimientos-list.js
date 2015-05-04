(function () {
    angular.module('acMovimientosList', [])
        .service('MovimientosList', MovimientosList);


    function MovimientosList() {
        this.cajaGeneral = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.10', // Movimiento de caja
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            };
        };

        this.cajaChica = function (sucursal, importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.' + sucursal, // Venta / Pago
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            };
        };

        this.cobroTarjeta = function (importe, comentario, tarjeta, usuario_id) {
            return {
                cuenta_id: '1.1.4.01', // Cobro con tarjeta
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '10', /* Tipo Tarjeta TC TD*/ 'valor': tarjeta}]
            };
        };

        this.tarjetasAPagar = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '2.1.2.01', // Tarjetas a pagar
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            };
        };

        this.sueldos = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '5.2.1.01', // Sueldos pagados
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            };
        };

        this.ventaMercaderias = function (producto_id, precio_unidad, cantidad, precio_total, comentario, usuario_id) {
            return {
                cuenta_id: '4.1.1.01', // venta de mercaderias
                importe: precio_total,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio por Unidad*/ 'valor': precio_unidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id}
                ]
            };
        };

        this.ventaServicio = function (importe, comentario, cliente_id, usuario_id) {
            return {
                cuenta_id: '4.1.1.02', // venta de servicios
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '3', /* cliente_id*/ 'valor': cliente_id}
                ]
            };
        };

        this.insumos = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.5.01', // Insumos
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}
                ]
            };
        };

        this.aguinaldos = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '5.2.1.02', // Aguinaldos
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}
                ]
            };
        };

        this.bancoCC = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.21', // CC
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}
                ]
            };
        };

        this.bancoCA = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.1.1.22', // CA
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}
                ]
            };
        };

        this.bancoMonedaExtranjera = function (importe, comentario, moneda_id, cotizacion, monto_moneda, usuario_id) {
            return {
                cuenta_id: '1.1.1.23', // Moneda extranjera
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '5', /* moneda_id*/ 'valor': moneda_id},
                    {'movimiento_id': -1, 'detalle_tipo_id': '6', /* cotizacion*/ 'valor': cotizacion},
                    {'movimiento_id': -1, 'detalle_tipo_id': '7', /* monto_moneda*/ 'valor': monto_moneda}
                ]
            };
        };

        this.cmv = function (costo, comentario, producto_id, cantidad, usuario_id) {
            return {
                cuenta_id: '5.1.1.01', // CMV
                importe: costo * cantidad,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio Unidad */ 'valor': costo},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id}
                ]
            };
        };

        this.bienesDeUso = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.2.1.01', // Bienes de Uso
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}
                ]
            };
        };

        this.bienesDeUso = function (importe, comentario, usuario_id) {
            return {
                cuenta_id: '1.2.1.01', // Bienes de Uso
                importe: importe,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}
                ]
            };
        };

        this.mercaderias = function (costo, comentario, producto_id, cantidad, usuario_id) {
            return {
                cuenta_id: '1.1.7.01', // Mercaderias
                importe: costo * cantidad,
                usuario_id: 1,
                detalles: [
                    {'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario},
                    {'movimiento_id': -1, 'detalle_tipo_id': '9', /* Precio Unidad */ 'valor': costo},
                    {'movimiento_id': -1, 'detalle_tipo_id': '13', /* Cantidad*/ 'valor': cantidad},
                    {'movimiento_id': -1, 'detalle_tipo_id': '8', /* Código de Producto*/ 'valor': producto_id}
                ]
            };
        };

        this.descuentos = function (importe, comentario, usuario_id) {
            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '4.1.4.01', // Descuentos otorgados
                'importe': importe,
                usuario_id: 1,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            }
        };

        this.interesesComisiones = function (importe, comentario, tipo_id, usuario_id) {
            //01 - GASTO INTERESES
            //02 - MANTENIMIENTO DE CUENTAS
            //03 - COMISIONES POR VENTAS CON TARJETA

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.8.' + tipo_id, // Intereses y Comisiones
                'importe': importe,
                usuario_id: 1,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            }
        };

        this.impuestosGenerales = function (importe, comentario, tipo_id, usuario_id) {
            //5.2.4.01	AGUA
            //5.2.4.02	LUZ
            //5.2.4.03	TELEFONOS Y FAX
            //5.2.4.04	INTERNET
            //5.2.4.05	ALQUILERES
            //5.2.4.06	EXPENSAS

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.4.' + tipo_id, // Impuestos y gastos generales
                'importe': importe,
                usuario_id: 1,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            }
        };

        this.otroImpuestos = function (importe, comentario, tipo_id, usuario_id) {
            //5.2.5.01	IMPUESTOS FISCALES Y MUNICIP.
            //5.2.5.02	MONOTRIBUTO SOCIEDAD
            //5.2.5.03	MONOTRIBUTO PERSONAL
            //5.2.5.04	IDB
            //5.2.5.05	SADAIC
            //5.2.5.06	PERCEPCION GANANCIAS
            //5.2.5.07	PERCEPCION IIBB

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.5.' + tipo_id, // Otros Impuestos
                'importe': importe,
                usuario_id: 1,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            }
        };

        this.otroImpuestos = function (importe, comentario, tipo_id, usuario_id) {
            //4.2.1.01	INTERESES GANADOS
            //4.2.1.02	INTERESES GANADOS CA
            //4.2.1.03	INTERESES GANADOS CA MONEDA EXTRANJERA
            //4.2.1.04	CREDITOS POR IDB
            //4.2.1.05	DEVOLUCIÓN IVA TD

            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '4.2.1.' + tipo_id, // Otros Impuestos
                'importe': importe,
                usuario_id: 1,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            }
        };

        this.publicidad = function (importe, comentario, usuario_id) {
            return {
                //'idAsiento': vm.asiento,
                'cuenta_id': '5.2.2.01', // publicidad
                'importe': importe,
                usuario_id: 1,
                'detalles': [{'movimiento_id': -1, 'detalle_tipo_id': '2', /* Detalle*/ 'valor': comentario}]
            }
        };


    }

})();
