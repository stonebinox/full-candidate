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
      'dbname' => 'heroku_39e3086099b39f3',
      'user' => 'b66219b6e365b3',
      'password' => '4efa1857',
      'host'=> "us-cdbr-iron-east-05.cleardb.net",
    )
));

$app->get('/', function() use($app){
    return $app->redirect('/applications');
});

$app->get('/applications',function() use($app){
    return $app['twig']->render('index.html.twig'); 
});

$app->run();
?>