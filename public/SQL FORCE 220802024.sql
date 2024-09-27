ALTER TABLE `cierres` ADD `debito_digital` DECIMAL(10,2) NULL AFTER `transferencia`, ADD `efectivo_digital` DECIMAL(10,2) NULL AFTER `debito_digital`, ADD `transferencia_digital` DECIMAL(10,2) NULL AFTER `efectivo_digital`, ADD `biopago_digital` DECIMAL(10,2) NULL AFTER `transferencia_digital`;
ALTER TABLE `cierres` ADD `descuadre` DECIMAL(10,2) NULL AFTER `transferencia`; 
ALTER TABLE `inventarios` ADD `cantidad_garantia` DECIMAL(10,2) NULL AFTER `cantidad`, ADD `cantidad_entransito` DECIMAL(10,2) NULL AFTER `cantidad_garantia`, ADD `cantidad_porentregar` DECIMAL(10,2) NULL AFTER `cantidad_entransito`; 
ALTER TABLE `garantias` ADD `cantidad_salida` DECIMAL(8,2) NULL AFTER `motivo`, ADD `motivo_salida` TEXT NULL AFTER `cantidad_salida`, ADD `ci_cajero` INT(11) NULL AFTER `motivo_salida`, ADD `ci_autorizo` INT(11) NULL AFTER `ci_cajero`, ADD `dias_desdecompra` INT(11) NULL AFTER `ci_autorizo`, ADD `ci_cliente` INT(11) NULL AFTER `dias_desdecompra`, ADD `telefono_cliente` VARCHAR(20) NULL AFTER `ci_cliente`, ADD `nombre_cliente` VARCHAR(100) NULL AFTER `telefono_cliente`, ADD `nombre_cajero` VARCHAR(100) NULL AFTER `nombre_cliente`, ADD `nombre_autorizo` VARCHAR(100) NULL AFTER `nombre_cajero`, ADD `trajo_factura` VARCHAR(100) NULL AFTER `nombre_autorizo`, ADD `motivonotrajofact` VARCHAR(100) NULL AFTER `trajo_factura`; 
ALTER TABLE `garantias` ADD `numfactoriginal` INT NULL AFTER `motivonotrajofact`, ADD `numfactgarantia` INT NULL AFTER `numfactoriginal`; 



//////////////////////////////////////////////
