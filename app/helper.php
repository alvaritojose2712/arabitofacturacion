<?php 



if (! function_exists('zero_fill')) {
    function zero_fill($val) {
        return sprintf("%08d", $val);
    }
}

if (! function_exists('moneda')) {
    function moneda($val) {
        
        return number_format(floatval($val),2,".",",");
    }
}
if (! function_exists('removemoneda')) {
    function removemoneda($money) {
        
        $cleanString = preg_replace('/([^0-9\.,])/i', '', $money);
        $onlyNumbersString = preg_replace('/([^0-9])/i', '', $money);

        $separatorsCountToBeErased = strlen($cleanString) - strlen($onlyNumbersString) - 1;

        $stringWithCommaOrDot = preg_replace('/([,\.])/', '', $cleanString, $separatorsCountToBeErased);
        $removedThousandSeparator = preg_replace('/(\.|,)(?=[0-9]{3,}$)/', '',  $stringWithCommaOrDot);

        return (float) str_replace(',', '.', $removedThousandSeparator);
    }
}

if (! function_exists('toLetras')) {
    function toLetras($val)
    {
        $letras = [
            "1"=>"L",
            "2"=>"R",
            "3"=>"E",
            "4"=>"A",
            "5"=>"S",
            "6"=>"G",
            "7"=>"F",
            "8"=>"B",
            "9"=>"P",
            "0"=>"X",
        ];


        foreach ($letras as $numero => $letra) {
            
           $val = str_replace($numero, $letra, $val);
        }

        return $val;
    }

    function destoLetras($val)
    {
        $letras = [
            "L"=>"1",
            "R"=>"2",
            "E"=>"3",
            "A"=>"4",
            "S"=>"5",
            "G"=>"6",
            "F"=>"7",
            "B"=>"8",
            "P"=>"9",
            "X"=>"0",
        ];


        foreach ($letras as $numero => $letra) {
            
           $val = str_replace($numero, $letra, $val);
        }
        $val = str_replace(",","",$val);
        $val = str_replace(".",",",$val);
        return $val;
    }
}

  
 ?>