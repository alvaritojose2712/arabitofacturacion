ALTER TABLE `cierres` ADD `debito_digital` DECIMAL(10,2) NULL AFTER `transferencia`, ADD `efectivo_digital` DECIMAL(10,2) NULL AFTER `debito_digital`, ADD `transferencia_digital` DECIMAL(10,2) NULL AFTER `efectivo_digital`, ADD `biopago_digital` DECIMAL(10,2) NULL AFTER `transferencia_digital`;
ALTER TABLE `cierres` ADD `descuadre` DECIMAL(10,2) NULL AFTER `transferencia`; 
ALTER TABLE `inventarios` ADD `cantidad_garantia` DECIMAL(10,2) NULL AFTER `cantidad`, ADD `cantidad_entransito` DECIMAL(10,2) NULL AFTER `cantidad_garantia`, ADD `cantidad_porentregar` DECIMAL(10,2) NULL AFTER `cantidad_entransito`; 
ALTER TABLE `garantias` ADD `cantidad_salida` DECIMAL(8,2) NULL AFTER `motivo`, ADD `motivo_salida` TEXT NULL AFTER `cantidad_salida`, ADD `ci_cajero` INT(11) NULL AFTER `motivo_salida`, ADD `ci_autorizo` INT(11) NULL AFTER `ci_cajero`, ADD `dias_desdecompra` INT(11) NULL AFTER `ci_autorizo`, ADD `ci_cliente` INT(11) NULL AFTER `dias_desdecompra`, ADD `telefono_cliente` VARCHAR(20) NULL AFTER `ci_cliente`, ADD `nombre_cliente` VARCHAR(100) NULL AFTER `telefono_cliente`, ADD `nombre_cajero` VARCHAR(100) NULL AFTER `nombre_cliente`, ADD `nombre_autorizo` VARCHAR(100) NULL AFTER `nombre_cajero`, ADD `trajo_factura` VARCHAR(100) NULL AFTER `nombre_autorizo`, ADD `motivonotrajofact` VARCHAR(100) NULL AFTER `trajo_factura`; 
ALTER TABLE `garantias` ADD `numfactoriginal` INT NULL AFTER `motivonotrajofact`, ADD `numfactgarantia` INT NULL AFTER `numfactoriginal`; 



//////////////////////////////////////////////



ALTER TABLE `inventarios` DROP FOREIGN KEY `inventarios_id_proveedor_foreign`;
ALTER TABLE `inventarios` DROP FOREIGN KEY `inventarios_id_categoria_foreign`;
ALTER TABLE `inventarios` DROP INDEX `inventarios_id_proveedor_foreign`; 
ALTER TABLE `inventarios` DROP INDEX `inventarios_id_categoria_foreign`; 
ALTER TABLE `inventarios` CHANGE `id_proveedor` `id_proveedor` INT(10) NULL DEFAULT NULL, CHANGE `id_categoria` `id_categoria` INT(10) NULL DEFAULT NULL; 
ALTER TABLE `facturas` CHANGE `fechaemision` `fechaemision` DATE NULL, CHANGE `fechavencimiento` `fechavencimiento` DATE NULL; 
ALTER TABLE `facturas` DROP FOREIGN KEY `facturas_id_proveedor_foreign`;
ALTER TABLE `facturas` DROP FOREIGN KEY `facturas_id_usuario_foreign`;
ALTER TABLE `facturas` DROP INDEX `facturas_id_usuario_foreign`; 
ALTER TABLE `facturas` DROP INDEX `facturas_id_proveedor_foreign`; 
ALTER TABLE `facturas` DROP INDEX `facturas_numfact_id_proveedor_unique`; 
ALTER TABLE `facturas` CHANGE `id_proveedor` `id_proveedor` INT(10) NULL DEFAULT NULL; 
ALTER TABLE `facturas` CHANGE `id_usuario` `id_usuario` INT(10) NULL DEFAULT NULL; 
DELETE FROM `items_facturas`;
DELETE FROM `facturas`;
ALTER TABLE `facturas` ADD `id_pedido_central` INT(12) NULL DEFAULT NULL AFTER `nota`; 


/////////////////////////////////////


ALTER TABLE `cajas` ADD `id_beneficiario` INT NULL AFTER `tipo`, ADD `id_departamento` INT NULL AFTER `id_beneficiario`; 
///////////////////////////////////////////


ALTER TABLE `inventarios` ADD `activo` INT(5) NOT NULL DEFAULT '1' AFTER `id_vinculacion`; 
UPDATE `inventarios` SET activo=0 WHERE push=0;
UPDATE `inventarios` SET activo=0 WHERE cantidad=0;

UPDATE `inventarios` SET activo=1 WHERE cantidad=0 AND push=1;
UPDATE `inventarios` SET activo=1;

////////////////////////////

  -- Reactivar las restricciones de clave foránea
  SET foreign_key_checks = 0;

  ALTER TABLE `inventarios` ADD `super` INT(5) NOT NULL DEFAULT '0' AFTER `id_vinculacion`; 

  ALTER TABLE sinapsis.fallas DROP FOREIGN KEY fallas_id_producto_foreign;
  ALTER TABLE sinapsis.garantias DROP FOREIGN KEY garantias_id_producto_foreign;
  ALTER TABLE sinapsis.inventarios_novedades DROP FOREIGN KEY inventarios_novedades_id_producto_foreign;
  ALTER TABLE sinapsis.items_pedidos DROP FOREIGN KEY items_pedidos_id_producto_foreign;
  ALTER TABLE sinapsis.items_facturas DROP FOREIGN KEY items_facturas_id_producto_foreign;
  ALTER TABLE sinapsis.movimientos_inventariounitarios DROP FOREIGN KEY movimientos_inventariounitarios_id_producto_foreign;


  ALTER TABLE inventarios DROP INDEX IF EXISTS inventarios_codigo_barras_unique;
  ALTER TABLE inventarios DROP INDEX IF EXISTS inventarios_id_vinculacion_unique;
  ALTER TABLE `items_pedidos` DROP INDEX IF EXISTS `items_pedidos_id_producto_id_pedido_unique`;

  ALTER TABLE inventarios MODIFY id BIGINT;
  ALTER TABLE items_pedidos MODIFY id_producto BIGINT;
  ALTER TABLE garantias MODIFY id_producto BIGINT;
  ALTER TABLE fallas MODIFY id_producto BIGINT;
  ALTER TABLE movimientos_inventarios MODIFY id_producto BIGINT;
  ALTER TABLE vinculosucursales MODIFY id_producto BIGINT;
  ALTER TABLE inventarios_novedades MODIFY id_producto BIGINT;
  ALTER TABLE items_facturas MODIFY id_producto BIGINT;
  ALTER TABLE movimientos_inventariounitarios MODIFY id_producto BIGINT;


  ALTER TABLE `pedidos` ADD `fiscal` BOOLEAN NOT NULL DEFAULT FALSE AFTER `ticked`; 
  ALTER TABLE `pedidos` ADD `retencion` INT NOT NULL DEFAULT '0' AFTER `fiscal`; 
  ALTER TABLE `inventarios` ADD `last_mov` INT NULL DEFAULT '0' AFTER `activo`; 


/*   ALTER TABLE sinapsis.fallas ADD CONSTRAINT fallas_id_producto_foreign FOREIGN KEY (id_producto) REFERENCES inventarios(id) ON DELETE CASCADE;
  ALTER TABLE sinapsis.garantias ADD CONSTRAINT garantias_id_producto_foreign FOREIGN KEY (id_producto) REFERENCES inventarios(id) ON DELETE CASCADE;
  ALTER TABLE sinapsis.items_pedidos ADD CONSTRAINT items_pedidos_id_producto_foreign FOREIGN KEY (id_producto) REFERENCES inventarios(id) ON DELETE CASCADE;
  ALTER TABLE sinapsis.items_facturas ADD CONSTRAINT items_facturas_id_producto_foreign FOREIGN KEY (id_producto) REFERENCES inventarios(id) ON DELETE CASCADE;
 */

  drop table if exists inventario_allmovs;
  CREATE TABLE `inventario_allmovs` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `ct` decimal(15,3) NOT NULL,
    `id_producto` int(11) NOT NULL,
    `type` varchar(191) NOT NULL,
    `id_usuario` int(11) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `inventario_allmovs_id_producto_created_at_unique` (`id_producto`,`created_at`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*   UPDATE `inventarios` SET iva=1;
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "MACHETE%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "PEINILLA%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "MOTOBOMBA%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "ELECTROBOMBA%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "DESMALEZADORA%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "MOTOSIERRA%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "CUCHILLA%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "FUMIGADORA%";
  UPDATE `inventarios` SET iva=0 WHERE descripcion LIKE "MANGUERA%"; */

  -- Reactivar las restricciones de clave foránea
  SET foreign_key_checks = 1;

  ALTER TABLE `inventarios` CHANGE `id` `id` BIGINT(20) NOT NULL AUTO_INCREMENT; 


  /////////////////////

  ALTER TABLE `pedidos` ADD `is_printing` BOOLEAN NOT NULL DEFAULT FALSE AFTER `estado`; 

  CREATE TABLE transferencias_inventarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_transferencia_central INT NULL,
    id_destino INT NOT NULL,
    id_usuario INT NOT NULL,
    estado INT NOT NULL,
    observacion TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE transferencias_inventario_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_transferencia INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    cantidad DECIMAL(13, 3) NOT NULL,
    cantidad_original_stock_inventario DECIMAL(13, 3) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_transferencia_inventario_items_transferencia
        FOREIGN KEY (id_transferencia)
        REFERENCES transferencias_inventarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_transferencia_inventario_items_producto
        FOREIGN KEY (id_producto)
        REFERENCES inventarios(id)  -- Asumiendo que la tabla 'inventarios' existe y tiene una columna 'id'
        ON DELETE CASCADE
        ON UPDATE CASCADE
);