<?php

class Cronometro {
    private $inicio;
    private $tiempo;

    public function __construct() {
        $this->inicio = null;
        $this->tiempo = 0;
    }

    public function arrancar() {
        $this->inicio = microtime(true);
    }
   
    public function parar() {
        if ($this->inicio !== null) {
            $this->tiempo = microtime(true) - $this->inicio;
        }
    }

    public function mostrar() {
    $t = $this->tiempo;

    $min = floor($t / 60);

    $seg = floor($t % 60);

    $decimas = floor(($t - floor($t)) * 10);

    return sprintf("Tiempo transcurrido: %02d:%02d.%d", $min, $seg, $decimas);
    }

    public function getTiempo(){
        return $this->tiempo;
    }

}

?>