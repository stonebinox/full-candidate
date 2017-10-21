<?php

ini_set('display_errors', 0);

require_once __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../src/app.php';
require __DIR__.'/../config/prod.php';
require __DIR__.'/../src/controllers.php';

$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => 'php://stderr',
  ));
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
      'driver' => 'pdo_mysql',
      'dbname' => 'heroku_bc01d6c27e92b76',
      'user' => 'root',
      'password' => 'adminspin#123',
      'host'=> "cloud.spectralinsights.com",
    )
));

$app->get('/applications',function() use($app){
    return $app['twig']->render('index.html.twig'); 
});

$app->run();
?>