<?php
/*-----------------------------
Author: Anoop Santhanam
Date Created: 24/10/17 11:44
Last Modified: 24/10/17 11:44
Comments: Main class file for
response_master table.
----------------------------*/
class responseMaster extends applicationMaster
{
    public $app=NULL;
    public $responseValid=false;
    private $response_id=NULL;
    function __construct($responseID=NULL)
    {
        $this->app=$GLOBALS['app'];
        if($responseID!=NULL)
        {
            $this->response_id=addslashes(htmlentities($responseID));
            $this->responseValid=$this->verifyResponse();
        }
    }
    function verifyResponse() //to verify a response
    {
        if($this->response_id!=NULL)
        {
            $app=$this->app;
            $responseID=$this->response_id;
            $rm="SELECT application_master_idapplication_master FROM response_master WHERE stat='1' AND idresponse_master='$responseID'";
            $rm=$app['db']->fetchAssoc($rm);
            if(($rm!="")&&($rm!=NULL))
            {
                $appID=$rm['application_master_idapplication_master'];
                applicationMaster::__construct($appID);
                if($this->applicationValid)
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
    function saveResponse($userEmail,$userName,$youtubeURL,$appID) //to apply for a job
    {
        $app=$this->app;
        $userEmail=trim(addslashes(htmlentities($userEmail)));
        if(filter_var($userEmail, FILTER_VALIDATE_EMAIL)){
            $userName=trim(addslashes(htmlentities($userName)));
            if(($userName!="")&&($userName!=NULL))
            {
                $youtubeURL=trim(addslashes(htmlentities($youtubeURL)));
                if(filter_var($youtubeURL, FILTER_VALIDATE_URL))
                {
                    $appID=addslashes(htmlentities($appID));
                    applicationMaster::__construct($appID);
                    if($this->applicationValid)
                    {
                        $rm="SELECT idresponse_master FROM response_master WHERE stat='1' AND user_email='$userEmail' AND application_master_idapplication_master='$appID'";
                        $rm=$app['db']->fetchAssoc($rm);
                        if(($rm=="")||($rm==NULL))
                        {
                            $in="INSERT INTO response_master (timestamp,user_email,user_name,application_master_idapplication_master,user_video_url) VALUES (NOW(),'$userEmail','$userName','$appID','$youtubeURL')";
                            $in=$app['db']->executeQuery($in);
                            return "RESPONSE_SUBMITTED";
                        }
                        else
                        {
                            return "RESPONSE_ALREADY_EXISTS";
                        }
                    }
                    else
                    {
                        return "INVALID_APPLICATION_ID";
                    }
                }
                else
                {
                    return "INVALID_YOUTUBE_URL";
                }
            }
            else
            {
                return "INVALID_USER_NAME";
            }
        }
        else
        {
            return "INVALID_EMAIL_ID";
        }
    }
}
?>