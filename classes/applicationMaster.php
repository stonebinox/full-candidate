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
        $app=$this->app;
        if($this->application_id!=NULL)
        {
            $appID=$this->application_id;
            $am="SELECT idapplication_master,user_master_iduser_master FROM application_master WHERE stat!='0' AND idapplication_master='$appID'";
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
            $am="SELECT * FROM application_master WHERE idapplication_master='$appID'";
            $am=$app['db']->fetchAssoc($am);
            if(($am!="")&&($am!=NULL))
            {
                $userID=$am['user_master_iduser_master'];
                userMaster::__construct($userID);
                $user=$this->getUser();
                $am['user_master_iduser_master']=$user;
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
            $am="SELECT idapplication_master FROM application_master WHERE stat!='0' AND user_master_iduser_master='$userID' ORDER BY idapplication_master DESC LIMIT 100";
            $appArray=array();
            $am=$app['db']->fetchAll($am);
            for($i=0;$i<count($am);$i++)
            {
                $applicationRow=$am[$i];
                $appID=$applicationRow['idapplication_master'];
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
    function createApplication($applicationTitle,$applicationDescription,$userID) //to create an application
    {
        $app=$this->app;
        $applicationTitle=trim(addslashes(htmlentities($applicationTitle)));
        if(($applicationTitle!="")&&($applicationTitle!=NULL))
        {
            $applicationDescription=trim(addslashes(htmlentities($applicationDescription)));
            if(($applicationDescription!="")&&($applicationDescription!=NULL))
            {
                $userID=addslashes(htmlentities($userID));
                userMaster::__construct($userID);
                if($this->userValid)
                {
                    $am="SELECT idapplication_master FROM application_master WHERE stat!='0' AND application_title='$applicationTitle' AND application_description='$applicationDescription' AND user_master_iduser_master='$userID'";
                    $am=$app['db']->fetchAssoc($am);
                    if(($am=="")||($am==NULL))
                    {
                        $in="INSERT INTO application_master (timestamp,stat,application_title,application_description,user_master_iduser_master) VALUES (NOW(),'2','$applicationTitle','$applicationDescription','$userID')";
                        $in=$app['db']->executeQuery($in);
                        return "APPLICATION_CREATED";
                    }
                    else
                    {
                        return "APPLICATION_ALREADY_EXISTS";
                    }
                }
                else
                {
                    return "INVALID_USER_ID";
                }
            }
            else
            {
                return "INVALID_APPLICATION_DESCRIPTION";
            }
        }
        else
        {
            return "INVALID_APPLICATION_TITLE";
        }
    }
    function getApplicationOwner() //to get application owner
    {
        if($this->applicationValid)
        {
            $app=$this->app;
            $appID=$this->application_id;
            $am="SELECT user_master_iduser_master FROM application_master WHERE idapplication_master='$appID'";
            $am=$app['db']->fetchAssoc($am);
            if(($am!="")&&($am!=NULL))
            {
                return $am['user_master_iduser_master'];
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
    function makeApplicationLive() //to make an application live
    {
        if($this->applicationValid)
        {
            $app=$this->app;
            $appID=$this->application_id;
            $appOwner=$this->getApplicationOwner();
            if($appOwner==$app['session']->get("uid"))
            {
                $up="UPDATE application_master SET stat='1' WHERE idapplication_master='$appID'";
                $up=$app['db']->executeUpdate($up);
                return "APPLICATION_UPDATED";
            }
            else
            {
                return "NO_PERMISSION";
            }
        }
        else
        {
            return "INVALID_APPLICATION_ID";
        }
    }
    function deleteApplication() //to delete an application
    {
        if($this->applicationValid)
        {
            $app=$this->app;
            $appID=$this->application_id;
            $owner=$this->getApplicationOwner();
            if($owner==$app['session']->get("uid"))
            {
                $up="UPDATE application_master SET stat='0' WHERE idapplication_master='$appID'";
                $up=$app['db']->executeUpdate($up);
                $this->applicationValid=false;
                return "APPLICATION_DELETED";
            }
            else
            {
                return "NO_PERMISSION";
            }
        }
        else
        {
            return "INVALID_APPLICATION_ID";
        }
    }
    function getLiveApplications($offset=0) //to get list of live applications
    {
        $app=$this->app;
        $offset=addslashes(htmlentities($offset));
        if(($offset!="")&&($offset!=NULL)&&(is_numeric($offset))&&($offset>=0))
        {
            $am="SELECT idapplication_master FROM application_master WHERE stat='1' ORDER BY idapplication_master DESC LIMIT $offset,100";
            $am=$app['db']->fetchAll($am);
            $appArray=array();
            for($i=0;$i<count($am);$i++)
            {
                $applicationRow=$am[$i];
                $appID=$applicationRow['idapplication_master'];
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
            return "INVALID_OFFSET_VALUE";
        }
    }
}
?>