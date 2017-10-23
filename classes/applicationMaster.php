<?php
/*--------------------------------
Author: Anoop Santhanam
Date Created: 21/10/17 22:58
Last Modified: 21/10/17 22:58
Comments: Main class file for 
application_master table.
---------------------------------*/
class applicationMaster extends userMaster
{
    public $app=NULL;
    public $applicationValid=false;
    private $appication_id=NULL;
    function __construct($appID=NULL)
    {
        $this->app=$GLOBALS['app'];
        if($appID!=NULL)
        {
            $this->application_id=addslashes(htmlentities($appID));
            $this->applicationValid=$this->verifyApplication();
        }
    }
    function verifyApplication()
    {
        if($this->application_id!=NULL)
        {
            $appID=$this->application_id;
            $am="SELECT idapplication_master,user_master_iduser_master FROM application_master WHERE stat='1' AND idapplication_master='$appID'";
            $am=$app['db']->fetchAssoc($am);
            if(($am!="")&&($am!=NULL))
            {
                $userID=$am['user_master_iduser_master'];
                userMaster::__construct($userID);
                if($this->userValid)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    function getApplication() //to get an application
    {
        if($this->applicationValid)
        {
            $app=$this->app;
            $appID=$this->application_id;
            $am="SELECT * FROM application_master WHERE stat='1' AND idapplication_master='$appID'";
            $am=$app['db']->fetchAssoc($am);
            if(($am!="")&&($am!=NULL))
            {
                return $am;
            }
            else
            {
                return "INVALID_APPLICATION_ID";
            }
        }
        else
        {
            return "INVALID_APPLICATION_ID";
        }
    }
    function getApplications($userID) //to get application
    {
        $app=$this->app;
        $userID=addslashes(htmlentities($userID));
        userMaster::__construct($userID);
        if($this->userValid)
        {
            $am="SELECT idapplication_master FROM application_master WHERE stat='1' AND user_master_iduser_master='$userID' ORDER BY idapplication_master DESC LIMIT 100";
            $appArray=array();
            $am=$app['db']->fetchAssoc($am);
            for($i=0;$i<count($am);$i++)
            {
                $appID=$am['idapplication_master'];
                $this->__construct($appID);
                $application=$this->getApplication();
                if(is_array($application))
                {
                    array_push($appArray,$application);
                }
            }
            if(count($appArray)>0)
            {
                return $appArray;
            }
            else
            {
                return "NO_APPLICATIONS_FOUND";
            }
        }
        else
        {
            return "INVALID_USER_ID";
        }
    }
}
?>