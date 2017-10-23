<?php

ini_set('display_errors', 1);

require_once __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../src/app.php';
require __DIR__.'/../config/prod.php';
require __DIR__.'/../src/controllers.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

$app->register(new Silex\Provider\SessionServiceProvider, array(
    'session.storage.save_path' => dirname(__DIR__) . '/tmp/sessions'
));

$app->before(function(Request $request) use($app){
    $request->getSession()->start();
});

$app->get('/', function() use($app){
    if($app['session']->get('uid')!=NULL)
    {
        return $app->redirect('/applications');
    }
    else
    {  
        return $app->redirect('/login');
    }
});

$app->get('/applications',function() use($app){
    if($app['session']->get('uid')!=NULL)
    {
        return $app['twig']->render('applications.html.twig'); 
    }
    else
    {
        return $app->redirect('/login');
    }
});

$app->get('/login',function() use($app){
    return $app['twig']->render('index.html.twig'); 
});

$app->post('/login_action',function(Request $request) use($app){
    require("../classes/userMaster.php");
    $user=new userMaster;
    $response=$user->authenticateUser($request->get('user_email'),$request->get('user_password'));
    if($response=="AUTHENTICATE_USER")
    {
        return $app->redirect('/applications');
    }
    else
    {
        return $app->redirect('/login_error');
    }
});

$app->get('/registration',function() use($app){
    return $app['twig']->render('registration.html.twig');
});

$app->post('/create_account',function(Request $request) use($app){
    require("../classes/userMaster.php");
    $user=new userMaster;
    $response=$user->createAccount($request->get('user_name'),$request->get('user_email'),$request->get('user_password'),$request->get('user_password2'));
    if($response=="ACCOUNT_CREATED")
    {
        return $app->redirect('/login');
    }
    else
    {
        return $app->redirect('/registration');
    }
});

$app->run();
?>