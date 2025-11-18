-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql:3306
-- Tiempo de generación: 17-11-2025 a las 19:27:38
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS=0;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facturacion`
--

-- Limpieza de artefactos previos
DROP VIEW IF EXISTS `vw_factura_completa`;
DROP TABLE IF EXISTS `factura_detalle`;
DROP TABLE IF EXISTS `factura_impuesto`;
DROP TABLE IF EXISTS `factura_referencia`;
DROP TABLE IF EXISTS `factura`;
DROP TABLE IF EXISTS `condicion_pago`;
DROP TABLE IF EXISTS `tipo_detalle`;
DROP TABLE IF EXISTS `estado_factura`;
DROP TABLE IF EXISTS `forma_pago`;
DROP TABLE IF EXISTS `emisor`;
DROP TABLE IF EXISTS `cliente`;

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL,
  `rut` varchar(12) NOT NULL,
  `razon_social` varchar(150) NOT NULL,
  `giro` varchar(150) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `comuna` varchar(80) DEFAULT NULL,
  `ciudad` varchar(80) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `rut`, `razon_social`, `giro`, `direccion`, `comuna`, `ciudad`, `telefono`, `email`) VALUES
(1, '12345678-9', 'Constructora Los Robles S.A.', 'Construcción de edificios', 'Camino Los Robles 500', 'Maipú', 'Santiago', '+56222334455', 'compras@losrobles.cl'),
(2, '11111111-1', 'Juan Pérez', 'Servicios profesionales', 'Pasaje Las Flores 123', 'Ñuñoa', 'Santiago', '+56991234567', 'juan.perez@example.com'),
(3, '22222222-2', 'Inversiones Río Claro Ltda.', 'Inversiones', 'Av. Providencia 2000, Of. 702', 'Providencia', 'Santiago', '+56224567890', 'contacto@rioclaro.cl');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emisor`
--

CREATE TABLE `emisor` (
  `id_emisor` int NOT NULL,
  `rut` varchar(12) NOT NULL,
  `razon_social` varchar(150) NOT NULL,
  `giro` varchar(150) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `comuna` varchar(80) DEFAULT NULL,
  `ciudad` varchar(80) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `sitio_web` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `emisor`
--

INSERT INTO `emisor` (`id_emisor`, `rut`, `razon_social`, `giro`, `direccion`, `comuna`, `ciudad`, `telefono`, `email`, `sitio_web`) VALUES
(1, '76543210-1', 'Servicios Informáticos Chile SpA', 'Servicios de informática', 'Av. Alameda 1234, Of. 501', 'Santiago', 'Santiago', '+56223456789', 'contacto@si-chile.cl', 'www.si-chile.cl'),
(2, '76890123-4', 'Comercial ABC Ltda.', 'Comercio al por mayor', 'Av. Apoquindo 4500', 'Las Condes', 'Santiago', '+56229876543', 'ventas@comercialabc.cl', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_factura`
--

CREATE TABLE `estado_factura` (
  `id_estado_factura` tinyint NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `es_final` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `estado_factura`
--

INSERT INTO `estado_factura` (`id_estado_factura`, `codigo`, `nombre`, `descripcion`, `es_final`) VALUES
(1, 'EMITIDA', 'Emitida', 'Factura emitida aún no procesada por SII', 0),
(2, 'PEND_ENVIO_SII', 'Pendiente envío SII', 'Pendiente de envío o recepción por el SII', 0),
(3, 'ACEPTADA_SII', 'Aceptada por SII', 'Documento recibido y aceptado por el SII', 1),
(4, 'RECHAZADA_SII', 'Rechazada por SII', 'Documento rechazado por el SII', 1),
(5, 'ANULADA', 'Anulada', 'Factura anulada, sin efecto tributario/comercial', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `condicion_pago`
--

CREATE TABLE `condicion_pago` (
  `id_condicion_pago` tinyint NOT NULL,
  `codigo` tinyint NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `condicion_pago`
--

INSERT INTO `condicion_pago` (`id_condicion_pago`, `codigo`, `nombre`, `descripcion`) VALUES
(1, 1, 'Contado', 'Pago al contado'),
(2, 2, 'Crédito', 'Pago con crédito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_detalle`
--

CREATE TABLE `tipo_detalle` (
  `id_tipo_detalle` tinyint NOT NULL,
  `codigo` smallint NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipo_detalle`
--

INSERT INTO `tipo_detalle` (`id_tipo_detalle`, `codigo`, `nombre`, `descripcion`) VALUES
(33, 33, 'Factura electrónica afecta', 'Documento afecto a IVA'),
(34, 34, 'Factura electrónica exenta', 'Documento exento de IVA'),
(46, 46, 'Factura de compra', 'Factura emitida por el comprador'),
(52, 52, 'Guía de despacho', 'Guía de despacho electrónica'),
(56, 56, 'Nota de débito', 'Nota de débito electrónica'),
(61, 61, 'Nota de crédito', 'Nota de crédito electrónica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` bigint NOT NULL,
  `id_tipo_detalle` tinyint NOT NULL COMMENT 'Referencia a tipo_detalle (33=Factura afecta, 34=Exenta, 46=Factura de compra, etc.)',
  `folio` int NOT NULL,
  `fecha_emision` date NOT NULL,
  `moneda` char(3) NOT NULL DEFAULT 'CLP',
  `id_emisor` int NOT NULL,
  `id_cliente` int NOT NULL,
  `id_condicion_pago` tinyint NOT NULL,
  `id_forma_pago` tinyint NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `orden_compra` varchar(50) DEFAULT NULL,
  `neto_afecto` decimal(18,2) NOT NULL DEFAULT '0.00',
  `neto_exento` decimal(18,2) NOT NULL DEFAULT '0.00',
  `otros_cargos` decimal(18,2) NOT NULL DEFAULT '0.00',
  `impuesto_especifico` decimal(18,2) NOT NULL DEFAULT '0.00',
  `monto_iva` decimal(18,2) NOT NULL DEFAULT '0.00',
  `total` decimal(18,2) NOT NULL DEFAULT '0.00',
  `id_estado_factura` tinyint NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `factura`
--

INSERT INTO `factura` (`id_factura`, `id_tipo_detalle`, `folio`, `fecha_emision`, `moneda`, `id_emisor`, `id_cliente`, `id_condicion_pago`, `id_forma_pago`, `fecha_vencimiento`, `orden_compra`, `neto_afecto`, `neto_exento`, `otros_cargos`, `impuesto_especifico`, `monto_iva`, `total`, `id_estado_factura`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 33, 1001, '2025-11-10', 'CLP', 1, 1, 2, 1, '2025-12-10', 'OC-2025-001', 100000.00, 0.00, 0.00, 0.00, 19000.00, 119000.00, 1, '2025-11-17 12:58:40', '2025-11-17 13:35:52'),
(2, 34, 2001, '2025-11-11', 'CLP', 1, 2, 1, 2, NULL, 'OC-2025-015', 0.00, 50000.00, 0.00, 0.00, 0.00, 50000.00, 1, '2025-11-17 12:58:40', '2025-11-17 13:35:52'),
(3, 33, 1002, '2025-11-12', 'CLP', 2, 3, 2, 1, '2025-12-12', 'OC-2025-030', 200000.00, 0.00, 5000.00, 3000.00, 38000.00, 246000.00, 1, '2025-11-17 12:58:40', '2025-11-17 13:35:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura_detalle`
--

CREATE TABLE `factura_detalle` (
  `id_detalle` bigint NOT NULL,
  `id_factura` bigint NOT NULL,
  `nro_linea` int NOT NULL,
  `codigo_item` varchar(50) DEFAULT NULL,
  `descripcion` varchar(255) NOT NULL,
  `cantidad` decimal(18,4) NOT NULL DEFAULT '1.0000',
  `unidad` varchar(20) DEFAULT NULL,
  `precio_unitario` decimal(18,4) NOT NULL,
  `descuento_porcentaje` decimal(5,2) NOT NULL DEFAULT '0.00',
  `descuento_monto` decimal(18,2) NOT NULL DEFAULT '0.00',
  `recargo_monto` decimal(18,2) NOT NULL DEFAULT '0.00',
  `afecto_iva` tinyint(1) NOT NULL DEFAULT '1',
  `neto_linea` decimal(18,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `factura_detalle`
--

INSERT INTO `factura_detalle` (`id_detalle`, `id_factura`, `nro_linea`, `codigo_item`, `descripcion`, `cantidad`, `unidad`, `precio_unitario`, `descuento_porcentaje`, `descuento_monto`, `recargo_monto`, `afecto_iva`, `neto_linea`) VALUES
(1, 1, 1, 'SERV-001', 'Servicio de soporte técnico mensual', 2.0000, 'MES', 30000.0000, 0.00, 0.00, 0.00, 1, 60000.00),
(2, 1, 2, 'SERV-002', 'Mantenimiento preventivo equipos', 1.0000, 'SERV', 40000.0000, 0.00, 0.00, 0.00, 1, 40000.00),
(3, 2, 1, 'CONS-EX', 'Asesoría profesional exenta de IVA', 1.0000, 'SERV', 50000.0000, 0.00, 0.00, 0.00, 0, 50000.00),
(4, 3, 1, 'PROD-001', 'Venta de licencias de software', 5.0000, 'UNID', 20000.0000, 0.00, 0.00, 0.00, 1, 100000.00),
(5, 3, 2, 'PROD-002', 'Dispositivos de red', 2.0000, 'UNID', 25000.0000, 0.00, 0.00, 0.00, 1, 50000.00),
(6, 3, 3, 'SERV-003', 'Instalación y configuración en terreno', 1.0000, 'SERV', 50000.0000, 0.00, 0.00, 0.00, 1, 50000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura_impuesto`
--

CREATE TABLE `factura_impuesto` (
  `id_impuesto` bigint NOT NULL,
  `id_factura` bigint NOT NULL,
  `codigo_impuesto` varchar(10) NOT NULL,
  `tasa` decimal(5,2) NOT NULL,
  `monto` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura_referencia`
--

CREATE TABLE `factura_referencia` (
  `id_referencia` bigint NOT NULL,
  `id_factura` bigint NOT NULL,
  `tipo_doc_ref` smallint UNSIGNED NOT NULL,
  `folio_ref` int NOT NULL,
  `fecha_ref` date DEFAULT NULL,
  `razon_ref` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `factura_referencia`
--

INSERT INTO `factura_referencia` (`id_referencia`, `id_factura`, `tipo_doc_ref`, `folio_ref`, `fecha_ref`, `razon_ref`) VALUES
(1, 1, 52, 5001, '2025-11-09', 'Guía de despacho asociada a suministro e instalación'),
(2, 2, 801, 150, '2025-11-05', 'Orden de compra interna cliente'),
(3, 3, 802, 300, '2025-10-01', 'Contrato marco servicios TI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `forma_pago`
--

CREATE TABLE `forma_pago` (
  `id_forma_pago` tinyint NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `forma_pago`
--

INSERT INTO `forma_pago` (`id_forma_pago`, `codigo`, `nombre`, `descripcion`) VALUES
(1, 'TRANSFERENCIA', 'Transferencia bancaria', 'Pago mediante transferencia electrónica'),
(2, 'TCREDITO', 'Tarjeta de crédito', 'Pago con tarjeta de crédito'),
(3, 'TDEBITO', 'Tarjeta de débito', 'Pago con tarjeta de débito'),
(4, 'EFECTIVO', 'Efectivo', 'Pago en dinero en efectivo'),
(5, 'CHEQUE', 'Cheque', 'Pago con cheque nominativo'),
(6, 'WEBPAY', 'Webpay u otro gateway', 'Pago en línea vía portal de pago');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_factura_completa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_factura_completa` (
`afecto_iva` tinyint(1)
,`cantidad` decimal(18,4)
,`codigo_condicion_pago` tinyint
,`cliente_ciudad` varchar(80)
,`cliente_comuna` varchar(80)
,`cliente_direccion` varchar(200)
,`cliente_email` varchar(120)
,`cliente_giro` varchar(150)
,`cliente_razon_social` varchar(150)
,`cliente_rut` varchar(12)
,`cliente_telefono` varchar(30)
,`codigo_impuesto` varchar(10)
,`codigo_item` varchar(50)
,`condicion_pago_nombre` varchar(50)
,`descuento_monto` decimal(18,2)
,`descuento_porcentaje` decimal(5,2)
,`detalle_descripcion` varchar(255)
,`emisor_ciudad` varchar(80)
,`emisor_comuna` varchar(80)
,`emisor_direccion` varchar(200)
,`emisor_email` varchar(120)
,`emisor_giro` varchar(150)
,`emisor_razon_social` varchar(150)
,`emisor_rut` varchar(12)
,`emisor_telefono` varchar(30)
,`es_final` tinyint(1)
,`estado_codigo` varchar(20)
,`estado_descripcion` varchar(200)
,`estado_nombre` varchar(50)
,`fecha_actualizacion` timestamp
,`fecha_creacion` timestamp
,`fecha_emision` date
,`fecha_ref` date
,`fecha_vencimiento` date
,`folio` int
,`folio_ref` int
,`forma_pago_codigo` varchar(20)
,`forma_pago_descripcion` varchar(200)
,`forma_pago_nombre` varchar(50)
,`id_cliente` int
,`id_detalle` bigint
,`id_emisor` int
,`id_estado_factura` tinyint
,`id_factura` bigint
,`id_forma_pago` tinyint
,`id_condicion_pago` tinyint
,`impuesto_especifico` decimal(18,2)
,`impuesto_monto` decimal(18,2)
,`impuesto_tasa` decimal(5,2)
,`moneda` char(3)
,`monto_iva` decimal(18,2)
,`neto_afecto` decimal(18,2)
,`neto_exento` decimal(18,2)
,`neto_linea` decimal(18,2)
,`nro_linea` int
,`otros_cargos` decimal(18,2)
,`precio_unitario` decimal(18,4)
,`razon_ref` varchar(255)
,`recargo_monto` decimal(18,2)
 ,`tipo_doc_ref` smallint unsigned
 ,`id_tipo_detalle` tinyint
 ,`total` decimal(18,2)
 ,`unidad` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_factura_completa`
--
DROP TABLE IF EXISTS `vw_factura_completa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `vw_factura_completa`  AS SELECT `f`.`id_factura` AS `id_factura`, `f`.`id_tipo_detalle` AS `id_tipo_detalle`, `td`.`codigo` AS `tipo_detalle_codigo`, `td`.`nombre` AS `tipo_detalle_nombre`, `f`.`folio` AS `folio`, `f`.`fecha_emision` AS `fecha_emision`, `f`.`moneda` AS `moneda`, `f`.`id_condicion_pago` AS `id_condicion_pago`, `cp`.`codigo` AS `codigo_condicion_pago`, `cp`.`nombre` AS `condicion_pago_nombre`, `f`.`fecha_vencimiento` AS `fecha_vencimiento`, `f`.`neto_afecto` AS `neto_afecto`, `f`.`neto_exento` AS `neto_exento`, `f`.`otros_cargos` AS `otros_cargos`, `f`.`impuesto_especifico` AS `impuesto_especifico`, `f`.`monto_iva` AS `monto_iva`, `f`.`total` AS `total`, `f`.`fecha_creacion` AS `fecha_creacion`, `f`.`fecha_actualizacion` AS `fecha_actualizacion`, `fp`.`id_forma_pago` AS `id_forma_pago`, `fp`.`codigo` AS `forma_pago_codigo`, `fp`.`nombre` AS `forma_pago_nombre`, `fp`.`descripcion` AS `forma_pago_descripcion`, `ef`.`id_estado_factura` AS `id_estado_factura`, `ef`.`codigo` AS `estado_codigo`, `ef`.`nombre` AS `estado_nombre`, `ef`.`descripcion` AS `estado_descripcion`, `ef`.`es_final` AS `es_final`, `e`.`id_emisor` AS `id_emisor`, `e`.`rut` AS `emisor_rut`, `e`.`razon_social` AS `emisor_razon_social`, `e`.`giro` AS `emisor_giro`, `e`.`direccion` AS `emisor_direccion`, `e`.`comuna` AS `emisor_comuna`, `e`.`ciudad` AS `emisor_ciudad`, `e`.`telefono` AS `emisor_telefono`, `e`.`email` AS `emisor_email`, `c`.`id_cliente` AS `id_cliente`, `c`.`rut` AS `cliente_rut`, `c`.`razon_social` AS `cliente_razon_social`, `c`.`giro` AS `cliente_giro`, `c`.`direccion` AS `cliente_direccion`, `c`.`comuna` AS `cliente_comuna`, `c`.`ciudad` AS `cliente_ciudad`, `c`.`telefono` AS `cliente_telefono`, `c`.`email` AS `cliente_email`, `fd`.`id_detalle` AS `id_detalle`, `fd`.`nro_linea` AS `nro_linea`, `fd`.`codigo_item` AS `codigo_item`, `fd`.`descripcion` AS `detalle_descripcion`, `fd`.`cantidad` AS `cantidad`, `fd`.`unidad` AS `unidad`, `fd`.`precio_unitario` AS `precio_unitario`, `fd`.`descuento_porcentaje` AS `descuento_porcentaje`, `fd`.`descuento_monto` AS `descuento_monto`, `fd`.`recargo_monto` AS `recargo_monto`, `fd`.`afecto_iva` AS `afecto_iva`, `fd`.`neto_linea` AS `neto_linea`, `fi`.`codigo_impuesto` AS `codigo_impuesto`, `fi`.`tasa` AS `impuesto_tasa`, `fi`.`monto` AS `impuesto_monto`, `fr`.`tipo_doc_ref` AS `tipo_doc_ref`, `fr`.`folio_ref` AS `folio_ref`, `fr`.`fecha_ref` AS `fecha_ref`, `fr`.`razon_ref` AS `razon_ref` FROM (((((((( `factura` `f` join `emisor` `e` on((`e`.`id_emisor` = `f`.`id_emisor`))) join `cliente` `c` on((`c`.`id_cliente` = `f`.`id_cliente`))) join `forma_pago` `fp` on((`fp`.`id_forma_pago` = `f`.`id_forma_pago`))) join `estado_factura` `ef` on((`ef`.`id_estado_factura` = `f`.`id_estado_factura`))) join `tipo_detalle` `td` on((`td`.`id_tipo_detalle` = `f`.`id_tipo_detalle`))) join `condicion_pago` `cp` on((`cp`.`id_condicion_pago` = `f`.`id_condicion_pago`))) left join `factura_detalle` `fd` on((`fd`.`id_factura` = `f`.`id_factura`))) left join `factura_impuesto` `fi` on((`fi`.`id_factura` = `f`.`id_factura`))) left join `factura_referencia` `fr` on((`fr`.`id_factura` = `f`.`id_factura`))) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `rut` (`rut`);

--
-- Indices de la tabla `emisor`
--
ALTER TABLE `emisor`
  ADD PRIMARY KEY (`id_emisor`),
  ADD UNIQUE KEY `rut` (`rut`);

--
-- Indices de la tabla `estado_factura`
--
ALTER TABLE `estado_factura`
  ADD PRIMARY KEY (`id_estado_factura`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id_factura`),
  ADD UNIQUE KEY `tipo_detalle_folio_emisor` (`id_tipo_detalle`,`folio`,`id_emisor`),
  ADD KEY `fk_factura_emisor` (`id_emisor`),
  ADD KEY `fk_factura_cliente` (`id_cliente`),
  ADD KEY `fk_factura_forma_pago` (`id_forma_pago`),
  ADD KEY `fk_factura_estado` (`id_estado_factura`),
  ADD KEY `fk_factura_tipo_detalle` (`id_tipo_detalle`),
  ADD KEY `fk_factura_condicion_pago` (`id_condicion_pago`);

--
-- Indices de la tabla `tipo_detalle`
--
ALTER TABLE `tipo_detalle`
  ADD PRIMARY KEY (`id_tipo_detalle`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `condicion_pago`
--
ALTER TABLE `condicion_pago`
  ADD PRIMARY KEY (`id_condicion_pago`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `factura_detalle`
--
ALTER TABLE `factura_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD UNIQUE KEY `uq_detalle_linea` (`id_factura`,`nro_linea`);

--
-- Indices de la tabla `factura_impuesto`
--
ALTER TABLE `factura_impuesto`
  ADD PRIMARY KEY (`id_impuesto`),
  ADD KEY `fk_factura_impuesto` (`id_factura`);

--
-- Indices de la tabla `factura_referencia`
--
ALTER TABLE `factura_referencia`
  ADD PRIMARY KEY (`id_referencia`),
  ADD KEY `fk_factura_referencia` (`id_factura`);

--
-- Indices de la tabla `forma_pago`
--
ALTER TABLE `forma_pago`
  ADD PRIMARY KEY (`id_forma_pago`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `emisor`
--
ALTER TABLE `emisor`
  MODIFY `id_emisor` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estado_factura`
--
ALTER TABLE `estado_factura`
  MODIFY `id_estado_factura` tinyint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `condicion_pago`
--
ALTER TABLE `condicion_pago`
  MODIFY `id_condicion_pago` tinyint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `factura_detalle`
--
ALTER TABLE `factura_detalle`
  MODIFY `id_detalle` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `factura_impuesto`
--
ALTER TABLE `factura_impuesto`
  MODIFY `id_impuesto` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `factura_referencia`
--
ALTER TABLE `factura_referencia`
  MODIFY `id_referencia` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `forma_pago`
--
ALTER TABLE `forma_pago`
  MODIFY `id_forma_pago` tinyint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `fk_factura_estado` FOREIGN KEY (`id_estado_factura`) REFERENCES `estado_factura` (`id_estado_factura`),
  ADD CONSTRAINT `fk_factura_forma_pago` FOREIGN KEY (`id_forma_pago`) REFERENCES `forma_pago` (`id_forma_pago`),
  ADD CONSTRAINT `fk_factura_tipo_detalle` FOREIGN KEY (`id_tipo_detalle`) REFERENCES `tipo_detalle` (`id_tipo_detalle`),
  ADD CONSTRAINT `fk_factura_condicion_pago` FOREIGN KEY (`id_condicion_pago`) REFERENCES `condicion_pago` (`id_condicion_pago`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
