<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Faker\Generator as Faker;

class CreateInventariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $faker = new Faker;
        
        Schema::create('inventarios', function (Blueprint $table) {
            $table->increments('id');

            $table->string("codigo_barras")->unique();
            $table->string("codigo_proveedor")->nullable()->default(null);

            $table->integer("id_proveedor")->unsigned();
            $table->foreign('id_proveedor')->references('id')->on('proveedores');
            

            $table->integer("id_categoria")->unsigned();
            $table->foreign('id_categoria')->references('id')->on('categorias');

            $table->string("id_marca")->nullable()->default("GENÉRICO");

            $table->string("unidad")->nullable()->default("UND");

            $table->string("id_deposito")->nullable()->default(1);

            
            
            $table->string("descripcion");

            $table->decimal("iva",5,2)->nullable()->default(0);

            $table->decimal("porcentaje_ganancia",3,2)->nullable()->default(0);
            $table->decimal("precio_base",8,3)->nullable()->default(0);
            $table->decimal("precio",8,3)->default(0);

            $table->decimal("precio1",8,3)->nullable();
            $table->decimal("precio2",8,3)->nullable();
            $table->decimal("precio3",8,3)->nullable();
            $table->integer("bulto")->nullable();

            $table->integer("stockmin")->nullable();
            $table->integer("stockmax")->nullable();

            $table->decimal("cantidad",9,2)->default(0);

            $table->boolean("push")->nullable()->default(0);

            $table->integer('id_vinculacion')->nullable();
            $table->unique(["id_vinculacion"]);

            $table->timestamps();
        });

        $inventario = [
            ["DIS-605","DISCO ABRASIVO 8 X 1 X 1 G36","24","5.99","4.96","6.5"],
["DIS-600","DISCO ABRASIVO 6 X 1/2 X 5/8 G36","24","2.99","2.48","3.5"],
["COP-109","CEPILLO ACERO RIZADO 5 CON ROSCA 5/8","24","3.24","2.68","3.5"],
["LIJ-120","LIJA DE BANDA 21 X 75mm GRANO 40","30","0.73","0.60","0.8"],
["LIJ-121","LIJA DE BANDA 21 X 75mm GRANO P60","30","0.73","0.60","0.8"],
["LIJ-122","LIJA DE BANDA 21 X 75mm GRANO P80","30","0.73","0.60","0.8"],
["LIJ-128","LIJA DE BANDA 21 X 75mm GRANO P100","30","0.73","0.60","0.8"],
["DIS-A101","ALMOHADILLA DE RESPALDO 4 1/2 ROSCA 5/8-11 PARA DISCO DE LIJADO","24","1.18","0.98","1.3"],
["SER-100","FIXTOP SERRUCHO 10 MANGO MADERA","24","3.21","2.66","3.5"],
["HOJ-002","LENOX HOJA DE SEGUETA N18 E/1","10","0.66","0.55","0.8"],
["TIZ-100","TIZA PARA HERRERIA","2","19.19","15.89","21"],
["TIR-100","TIRA LINEAS PARA ALBAÑILERIA  50M","12","1.90","1.57","1.9"],
["GUA-101","GUANTES DE CARNAZA/TELA SENCILLO","20","2.22","1.84","2.4"],
["VID-103","VIDRIO TRANSPARENTE P-CARETA DE SOLDAR","50","0.14","0.12","0.18"],
["PIN-102","PINZA DE TIERRA 300AMP","40","2.68","2.22","2.9"],
["PIN-100","PINZA PORTA ELECTRODO 300 AMP 162grs LIVIANA","30","2.26","1.87","2.5"],
["GLP-102","YEE DE BRONCE GLP","20","0.81","0.67","0.9"],
["GLP-101","TEE DE BRONCE GLP","20","0.88","0.73","1"],
["GPL-103","UNION DE BRONCE GLP","20","0.67","0.55","0.8"],
["MAN-805","MANGUERA ALTA PRESION 1/4 6MM 300PSI C/MT","1","75.14","62.22","80"],
["MAN-806","MANGUERA ALTA PRESION 5/16 8MM 300PSI C/MT","1","101.31","83.88","110"],
["MAN-807","MANGUERA ALTA PRESION 3/8 10MM 300PSI C/MT","1","111.00","91.91","120"],
["PIC-300","PICO PUNTA PALA 1.5KG NEGRO","3","9.57","7.92","9.9"],
["7702956232896","BELLOTA TOBO ALBAÑILERIA 12LTS PLASTICO","12","3.57","2.96","3.9"],
["7702956230298","BELLOTA TOBO ALBAÑILERIA 8LTS PLASTICO","20","2.39","1.98","2.6"],
["SAL-100","MAQUINA SALPICADORA DE CEMENTO MANUAL","6","8.92","7.39","9.8"],
["RAS-100","RASTRILLO TIPO ABANICO METAL 22D S-CABO","20","1.95","1.61","2.2"],
["ROD-F16","RODILLO 2 M-PLASTICO","24","1.16","0.96","1.3"],
["CAM-F19","CAMISA RODILLO 2 GOMA ESPUMA","30","0.28","0.23","0.35"],
["CAM-F17","CAMISA PARA RODILLO 2 F-17","30","0.28","0.23","0.35"],
["ESP-117","JUEGO DE ESPATULA METAL 4PZAS","20","0.87","0.72","1"],
["BUJ-100","LLAVE SACA BUJIA 16mm 5/8 DOBLE ROSC","24","2.78","2.30","3"],
["UNI-100","UNION PVC 1/2 ROSCA A/F","200","0.31","0.26","0.35"],
["UNI-101","UNION PVC 3/4 ROSCA A/F","100","0.44","0.36","0.5"],
["UNI-102","UNION PVC 1 ROSCA A/F","100","0.70","0.58","0.8"],
["TEE-100","TEE PVC 1/2 ROSCA A/F","200","0.50","0.41","0.6"],
["TEE-101","TEE PVC 3/4 ROSCA A/F","100","0.64","0.53","0.7"],
["TEE-102","TEE PVC 1 ROSCA A/F","100","1.32","1.09","1.5"],
["BUS-100","BUSHING PVC 1 x 1/2 ROSCA A/F","50","0.31","0.26","0.4"],
["BUS-101","BUSHING PVC 1 x 3/4 ROSCA A/F","50","0.27","0.22","0.3"],
["BUS-103","BUSHING PVC 3-4 x 1-2 ROSCA A-F","50","0.23","0.19","0.25"],
["COD-101","CODO PVC 3/4 ROSCA A/F","200","0.45","0.37","0.5"],
["COD-102","CODO PVC 1 ROSCA A/F","100","0.89","0.74","1"],
["TAPON-1-2","TAPON A/F 1/2 ROSCA MACHO","100","0.14","0.12","0.18"],
["TAPON-3-4","TAPON A/F 3/4 ROSCA MACHO","100","0.16","0.13","0.18"],
["TAPON-1PLG","TAPON PVC 1 A/F ROSCA MACHO","100","0.30","0.25","0.35"],
["TAPA-3-4","TAPA PVC 3/4 ROSCADA","100","0.23","0.19","0.25"],
["TAPA-1P","TAPA PVC 1 ROSCADA","100","0.35","0.29","0.38"],
["LLA-B9","LLAVE DE BOLA PLAST 1/2 LISA","200","0.58","0.48","0.65"],
["LLA-B10","LLAVE DE BOLA PLAST 3/4 LISA B-10","100","0.71","0.59","0.8"],
["LLA-B27","LLAVE DE BOLA PLAST 1 LISA B-27","100","1.11","0.92","1.2"],
["LLA-105","VALVULA 1/2 D/COMPUERTA","20","3.58","2.96","3.9"],
["TAP-300","TAPA HUECO ACERO INOX. P-FREG 1 1-2 C-UNI","100","0.30","0.25","0.33"],
["FLA-100","FLAPPER GOMA PARA HERRAJE DE POCETA","30","0.87","0.72","1"],
["REG-302","REGADERA REDONDA 6 PLAST","24","3.12","2.58","3.5"],
["REG-305","REGADERA 6 REDONDA PLANA ACERO INOXIDABLE","12","3.63","3.01","3.9"],
["BIS-CCF002","BISAGRA CAZOLETA C/FRENO C/UNID","24","0.93","0.77","1"],
["JUE-104","AIWA JUEGO DE DADOS 40PZAS 1/4 Y 3/8","10","7.19","5.95","7.8"],
["DRI-8-12W","DRIVER PARA PANEL 8-12W 110/220V","12","1.32","1.09","1.5"],
["DRI-18-24W","DRIVER PARA PANEL 18-24W 110/220V","12","2.02","1.67","2.2"],
["TAP-104","TAPA CIEGA PLASTICA BLANCA","200","0.19","0.16","0.25"],
["SOC-G5","SOCATE CONVERTIDOR ROSCA E-27 A E-40 PLAST.","36","1.21","1.00","1.3"],
["ENCHUFE-3T","ENCHUFE 3 TOMAS GOMA BLANCO","100","0.35","0.29","0.4"],
["6905795217029","CINTA ADHESIVA DOBLE FAZ 900G","36","1.02","0.84","1.2"],
["ABR-108","ABRAZADERA 1/2 C-TORNILLO","10","6.30","5.22","7"],
["ABR-109","ABRAZADERA 3/4 C-TORNILLO","10","7.42","6.14","8"],
["ABR-110","ABRAZADERA 1 C-TORNILLO","5","9.57","7.92","11"],
["T1206-0023","INDUMA TAPA CIEGA REDONDA PVC CONDUIT","100","0.46","0.38","0.5"],
        ];
        $arr = [];
    foreach ($inventario as $key => $value) {
        array_push($arr, 
            [
                // "id" => $value[0],
                "codigo_proveedor" => $value[0],
                "codigo_barras" => "MAN".$value[0],
                "id_proveedor" => 1,
                "id_categoria" => 1,
                "id_marca" => 1,
                "unidad" => "UND",
                "id_deposito" => 1,
                "descripcion" => $value[1],
                "iva" => 0,
                "porcentaje_ganancia" => 0,
                "cantidad" => $value[2],
                "precio_base" => $value[4],
                "precio" => $value[5],
                "precio3" => $value[3],

            ]
        );
    }
    DB::table("inventarios")->insert($arr); 
        
        /* $arrinsert = [];
        
        $con = new Mysqli("localhost","root","","administrativo2");
        
        $sql = $con->query("
        SELECT articulos.*,
        (SELECT SUM(cantidad) 
            FROM inventario
            WHERE articulo = articulos.id) ct
            
            FROM articulos articulos order by ct desc");
            
        $i = 1;
        while($row = $sql->fetch_assoc()){
            array_push($arrinsert,[
                'codigo_barras' => $row['id'],
                'codigo_proveedor' => $row['codigo'],
                'id_proveedor' => 1,
                'id_categoria' => 14,
                'descripcion' => $row['descripcion'],
                'precio_base' => $row['costod'],
                'precio' => $row['preciod'],
                'cantidad' => $row['ct']?$row['ct']:0,  
            ]);
            if ($i==1000 OR $i==2000 OR $i==3583) {
                DB::table("inventarios")->insert($arrinsert);
                $arrinsert = [];
            }
            
            $i++;
                
        } */

        
        



        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventarios');
    }


}


