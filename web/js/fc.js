var app=angular.module('login',[]);
app.controller('auth',function($scope){});
var app=angular.module('registration',[]);
app.controller('create',function($scope){
    $scope.validateForm=function(){
        var fullname=$.trim(document.accountform.user_name.value);
        if(fullname!=""){
            var email=$.trim(document.accountform.user_email.value);
            if(email!=""){
                var pass1=document.accountform.user_password.value;
                if(pass1.length>=8){
                    var pass2=document.accountform.user_password2.value;
                    if(pass2===pass1){
                        $(".btn-primary").addClass("disabled");
                        document.accountform.submit();
                    }
                    else{
                        messageBox("Password Mismatch","Please ensure that the password you repeat matches the first password.");    
                    }
                }
                else{
                    messageBox("Invalid Password","Please enter a valid password with at least 8 characters.");    
                }
            }
            else{
                messageBox("Invalid Email","Please enter a valid email ID.");    
            }
        }
        else{
            messageBox("Invalid Name","Please enter a valid company name.");
        }
    };
});
var app=angular.module('applications',[]);
app.controller('apps',function($scope,$http,$compile){
    $scope.applicationArray=[];
    $scope.application_id=null;
    $scope.appCount=0;
    $scope.getApplications=function(){
        $http({
            method: 'GET',
            url: 'getApplications'
        }).then(function success(response){
            if(typeof response=='object'){
                response=response.data;
                $scope.applicationArray=response.slice();
                $scope.displayApplications();
            }
            else{
                response=$.trim(response);
                if((response!="")&&(response!="INVALID_PARAMETERS")){
                    if(response=="INVALID_USER_ID"){
                        window.location='logout';
                    }
                    else if(response=="NO_APPLICATIONS_FOUND"){
                        var p=document.createElement("p");
                        $(p).html("No applications found.");
                        $("#appHolder").html(p);
                    }
                    else{
                        messageBox("Problem","Something went wrong while loading your list of applications. This is the error we see: "+response);    
                    }
                }
                else{
                    messageBox("Problem","Something went wrong while loading your list of applications.");
                }
            }
        }, function error(response){
            messageBox("Problem","Something went wrong while loading your list of applications. Please try again later. This is the error we see: "+response);
        });
    }; 
    $scope.displayApplications=function(){
        var applications=$scope.applicationArray.slice();
        if(applications.length>0){
            var count=applications.length;
            $("#appCount").html(count);
            var table=document.createElement("table");
            $(table).addClass("table");
                var thead=document.createElement("thead");
                    var tr1=document.createElement("tr");
                        var th1=document.createElement("th");
                        $(th1).html("Title");
                    $(tr1).append(th1);
                        var th2=document.createElement("th");
                        $(th2).html("Description");
                    $(tr1).append(th2);
                        var th3=document.createElement("th");
                        $(th3).html("Status");
                    $(tr1).append(th3);
                        var th4=document.createElement("th");
                        $(th4).html("Actions");
                    $(tr1).append(th4);
                $(thead).append(tr1);
            $(table).append(thead);
                var tbody=document.createElement("tbody");
            for(var i=0;i<applications.length;i++){
                var application=applications[i];
                var appID=application.idapplication_master;
                var appTitle=stripslashes(application.application_title);
                var appDesc=nl2br(stripslashes(application.application_description));
                var stat=application.stat;
                if(stat==1){    
                    stat='Live';
                }
                else if(stat==2){
                    stat='Incomplete';
                }
                else{
                    stat='Deleted';
                }
                var tr=document.createElement("tr");
                    var td1=document.createElement("td");
                        var a=document.createElement("a");
                        $(a).attr("href","jobs#!/job/"+appID);
                        $(a).html(appTitle);
                        $(a).attr("target","_blank");
                        $(a).attr("title","Open application");
                        $(a).attr("data-toggle","tooltip");
                        $(a).attr("data-placement","auto");
                    $(td1).html(a);   
                $(tr).append(td1);
                    var td2=document.createElement("td");
                    $(td2).html(appDesc);
                $(tr).append(td2);
                    var td3=document.createElement("td");
                    $(td3).html(stat);
                $(tr).append(td3);
                    var td4=document.createElement("td");
                        var btnGroup=document.createElement("div");
                        $(btnGroup).addClass("btn-group");
                        if(stat=="Incomplete"){
                            var button=document.createElement("button");
                            $(button).addClass("btn btn-info btn-xs");
                            $(button).attr("type","button");
                            $(button).html("Make live");
                            $(button).attr("ng-click","makeApplicationLive("+appID+")");
                            $(btnGroup).append(button);
                        }
                        else if(stat=="Live"){
                            var button3=document.createElement("button");
                            $(button3).addClass("btn btn-xs");
                            $(button3).attr("type","button");
                            $(button3).html("See applicants");
                            $(btnGroup).append(button3);
                        }
                            var button2=document.createElement("button");
                            $(button2).addClass("btn btn-danger btn-xs");
                            $(button2).attr("type","button");
                            $(button2).attr("ng-click","deleteApplication("+appID+")");
                            $(button2).html("Delete");
                        $(btnGroup).append(button2);
                    $(td4).html(btnGroup);
                $(tr).append(td4);
                $(tbody).append(tr);
            }
            $(table).append(tbody);
            var well=document.createElement("div");
            $(well).addClass("well");
            $(well).html(table);
            $("#appHolder").html("<hr>");
            $("#appHolder").append(well);
            $compile("#appHolder")($scope);
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover'
            });
        }
        else{
            var p=document.createElement("p");
            $(p).html("No applications found.");
            $("#appHolder").html(p);
        }
    };
    $scope.createApplicationForm=function(){
        var form=document.createElement("form");
        $(form).attr("autocomplete","off");
        $(form).attr("name","createapp");
            var appTitleGroup=document.createElement("div");
            $(appTitleGroup).addClass("form-group");
            $(appTitleGroup).attr("id","apptitlegroup");
                var appTitleLabel=document.createElement("label");
                $(appTitleLabel).attr("for","apptitle");
                $(appTitleLabel).html("Application title");
                $(appTitleGroup).append(appTitleLabel);
                var appTitle=document.createElement("input");
                $(appTitle).attr("type","text");
                $(appTitle).addClass("form-control");
                $(appTitle).attr("id","apptitle");
                $(appTitle).attr("name","apptitle");
                $(appTitle).attr("placeholder","Enter a valid application name");
                $(appTitle).attr("required","true");
                $(appTitleGroup).append(appTitle);
            $(form).append(appTitleGroup);
            var appDescGroup=document.createElement("div");
            $(appDescGroup).addClass("form-group");
            $(appDescGroup).attr("id","appdescgroup");
                var appDescLabel=document.createElement("label");
                $(appDescLabel).attr("for","appdesc");
                $(appDescLabel).html("Application description");
                $(appDescGroup).append(appDescLabel);
                var appDescTA=document.createElement("textarea");
                $(appDescTA).addClass("form-control");
                $(appDescTA).attr("rows","5");
                $(appDescTA).attr("id","appdesc");
                $(appDescTA).attr("name","appdesc");
                $(appDescTA).attr("placeholder","Enter some description of this application.");
                $(appDescGroup).append(appDescTA);
            $(form).append(appDescGroup);
            var button=document.createElement("button");
            $(button).attr("type","button");
            $(button).addClass("btn btn-primary");
            $(button).attr("ng-click","createApplication()");
            $(button).html("Create");
            $(form).append(button);
        messageBox("Create Application",form);
        $compile("#myModal")($scope);
        $("#apptitle").focus();
    };
    $scope.createApplication=function(){
        var appTitle=$.trim(document.createapp.apptitle.value);
        if(appTitle!=""){
            $("#apptitlegroup").removeClass("has-error");
            var appDesc=$.trim(document.createapp.appdesc.value);
            if(appDesc!=""){
                $("#appdescgroup").removeClass("has-error");
                var dt=new Date().getTime();
                $.ajax({
                    url:"createApplication",
                    method: "POST",
                    data: {
                        application_title: appTitle,
                        application_description: appDesc,
                        dt: dt
                    },
                    error: function(xhr,stat,err){
                        messageBox("Problem","Something went wrong while creating this application. Please try again in a bit. This is the error we see: "+err);
                    },
                    success:function(responseText){
                        responseText=$.trim(responseText);
                        $("#myModal").find(".btn-primary").removeClass("disabled");
                        if((responseText!="")&&(responseText!=null)&&(responseText!=undefined)&&(responseText!="INVALID_PARAMETERS")){
                            if(responseText=="INVALID_USER_ID"){
                                window.location="logout";
                            }
                            else if(responseText=="INVALID_APPLICATION_TITLE"){
                                $("#apptitlegroup").addClass("has-error");
                            }
                            else if(responseText=="INVALID_APPLICATION_DESCRIPTION"){
                                $("#appdescgroup").addClass("has-error");
                            }
                            else if(responseText=="APPLICATION_ALREADY_EXISTS"){
                                messageBox("Application Exists","This application already exists.");
                            }
                            else if(responseText=="APPLICATION_CREATED"){
                                messageBox("Application Created","Your application was created successfully. Your application is not live, please make sure the details are correct before making it live on the jobs page.");
                                $scope.getApplications();
                            }
                            else{
                                messageBox("Problem","Something went wrong while creating your application. This is the error we see: "+responseText);
                            }
                        }
                        else{
                            messageBox("Problem","Something went wrong while updating your application. Please try again in a bit. This is the error we see: "+responseText);
                        }
                    },
                    beforeSend:function(){
                        $("#myModal").find(".btn-primary").addClass("disabled");
                    }
                });
            }
            else{
                $("#appdescgroup").addClass("has-error");
            }
        }
        else{
            $("#apptitlegroup").addClass("has-error");
        }
    };
    $scope.makeApplicationLive=function(appID){
        if(confirm("Are you sure you want to perform this action?")){
            var dt=new Date().getTime();
            $.ajax({
                url:"makeApplicationLive",
                method: "GET",
                data: {
                    application_id: appID,
                    dt: dt
                },
                error: function(xhr,stat,err){
                    messageBox("Problem","Something went wrong while updating this application. Please try again in a bit. This is the error we see: "+err);
                },
                success:function(responseText){
                    responseText=$.trim(responseText);
                    if((responseText!="")&&(responseText!=null)&&(responseText!=undefined)&&(responseText!="INVALID_PARAMETERS")){
                        if(responseText=="INVALID_APPLICATION_ID"){
                            messageBox("Invalid Application","The application you are trying to make changes to is invalid or doesn't exist.");
                        }
                        else if(responseText=="NO_PERMISSION"){
                            messageBox("No Permission","You do not have have permission to perform this action.");
                        }
                        else if(responseText=="APPLICATION_UPDATED"){
                            messageBox("Application Update",'Your application is now live! Candidates can now apply from the <a href="jobs" target="_blank">jobs</a> page.');
                            $scope.getApplications();
                        }
                        else{
                            messageBox("Problem","Something went wrong while updating your application. This is the error we see: "+responseText);
                        }
                    }
                    else{
                        messageBox("Problem","Something went wrong while updating your application. Please try again in a bit. This is the error we see: "+responseText);
                    }
                }
            });
        }
    };
    $scope.deleteApplication=function(appID){
        if(confirm("Are you sure you want to perform this action?")){
            var dt=new Date().getTime();
            $.ajax({
                url:"deleteApplication",
                method: "GET",
                data: {
                    application_id: appID,
                    dt: dt
                },
                error: function(xhr,stat,err){
                    messageBox("Problem","Something went wrong while deleting this application. Please try again in a bit. This is the error we see: "+err);
                },
                success:function(responseText){
                    responseText=$.trim(responseText);
                    if((responseText!="")&&(responseText!=null)&&(responseText!=undefined)&&(responseText!="INVALID_PARAMETERS")){
                        if(responseText=="INVALID_APPLICATION_ID"){
                            messageBox("Invalid Application","The application you are trying to make changes to is invalid or doesn't exist.");
                        }
                        else if(responseText=="NO_PERMISSION"){
                            messageBox("No Permission","You do not have have permission to perform this action.");
                        }
                        else if(responseText=="APPLICATION_DELETED"){
                            messageBox("Application Deleted",'The application was deleted successfully.');
                            $scope.getApplications();
                        }
                        else{
                            messageBox("Problem","Something went wrong while deleting your application. This is the error we see: "+responseText);
                        }
                    }
                    else{
                        messageBox("Problem","Something went wrong while deleting your application. Please try again in a bit. This is the error we see: "+responseText);
                    }
                }
            });
        }
    };
});
var app=angular.module("jobs",['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when("/job/:jobID",{
        controller: 'joblist'
    });
});
app.controller("joblist",function($scope,$compile,$routeParams){
    $scope.application_id=null;
    $scope.jobArray=[];
    $scope.jobOffset=0;
    $scope.getLiveApplications=function(){
        var dt=new Date().getTime();
        $.ajax({
            url:"getLiveApplications",
            method: "GET",
            data: {
                offset: $scope.jobOffset,
                dt: dt
            },
            error: function(xhr,stat,err){
                messageBox("Problem","Something went wrong while getting fresh jobs. Please try again in a bit. This is the error we see: "+err);
            },
            success:function(responseText){
                responseText=$.trim(responseText);
                if((responseText!="")&&(responseText!=null)&&(responseText!=undefined)&&(responseText!="INVALID_PARAMETERS")){
                    if(responseText=="INVALID_APPLICATION_ID"){
                        messageBox("Invalid Application","The application you are trying to make changes to is invalid or doesn't exist.");
                    }
                    else if(responseText=="NO_PERMISSION"){
                        messageBox("No Permission","You do not have have permission to perform this action.");
                    }
                    else if(responseText=="APPLICATION_DELETED"){
                        messageBox("Application Deleted",'The application was deleted successfully.');
                        $scope.getApplications();
                    }
                    else{
                        responseText=JSON.parse(responseText);
                        $scope.jobArray=responseText.slice();
                        $scope.displayJobs();
                        //$scope.jobOffset+=100;
                    }
                }
                else{
                    messageBox("Problem","Something went wrong while deleting your application. Please try again in a bit. This is the error we see: "+responseText);
                }
            }
        });
    };
    $scope.displayJobs=function(){
        if($routeParams.length!=0){
            var jobID=$routeParams.jobID;
            $scope.openApplication(jobID);
        }
        var jobs=$scope.jobArray.slice();
        if(jobs.length>0){
            var table=document.createElement("table");
            $(table).addClass("table");
                var thead=document.createElement("thead");
                    var tr1=document.createElement("tr");
                        var th1=document.createElement("th");
                        $(th1).html("Title");
                    $(tr1).append(th1);
                        var th2=document.createElement("th");
                        $(th2).html("Description");
                    $(tr1).append(th2);
                        var th3=document.createElement("th");
                        $(th3).html("Company");
                    $(tr1).append(th3);
                        var th4=document.createElement("th");
                        $(th4).html("Posted");
                    $(tr1).append(th4);
                $(thead).append(tr1);
            $(table).append(thead);
                var tbody=document.createElement("tbody");
            for(var i=0;i<jobs.length;i++){
                var job=jobs[i];
                var appID=job.idapplication_master;
                var appTitle=stripslashes(job.application_title);
                var appDesc=nl2br(stripslashes(job.application_description));
                var timestamp=job.timestamp;
                var sp=timestamp.split(" ");
                timestamp=dateFormat(sp[0])+" at "+sp[1];
                var jobPoster=job.user_master_iduser_master;
                var jobPosterName=stripslashes(jobPoster.user_name);
                var tr=document.createElement("tr");
                    var td1=document.createElement("td");
                        var a=document.createElement("a");
                        $(a).attr("href","#!/job/"+appID);
                        $(a).html(appTitle);
                        $(a).attr("title","Open application");
                        $(a).attr("data-toggle","tooltip");
                        $(a).attr("data-placement","auto");
                        $(a).attr("ng-click","openApplication("+appID+")");
                    $(td1).html(a);  
                $(tr).append(td1);
                    var td2=document.createElement("td");
                    $(td2).html(appDesc);
                $(tr).append(td2);
                    var td3=document.createElement("td");
                    $(td3).html(jobPosterName);
                $(tr).append(td3);
                    var td4=document.createElement("td");
                    $(td4).html(timestamp);
                $(tr).append(td4);
                $(tbody).append(tr);
            }
            $(table).append(tbody);
            $("#joblist").html(table);
            $compile("#joblist")($scope);
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover'
            });
        }
        else{
            var p=document.createElement("p");
            $(p).addClass("text-center");
            $(p).html("No jobs to display.");
            $("#joblist").html(p);
        }
    };
    $scope.openApplication=function(appID){
        if((appID!="")&&(appID!=null)&&(appID!=undefined)){
            var jobs=$scope.jobArray.slice();
            var pos=null;
            for(var i=0;i<jobs.length;i++){
                var job=jobs[i];
                if(appID==job.idapplication_master){
                    pos=i;
                    break;
                }
            }
            if(pos!=null){
                var job=jobs[pos];
                var jobTitle=stripslashes(job.application_title);
                var jobDesc=nl2br(stripslashes(job.application_description));
                var timestamp=job.timestamp;
                var sp=timestamp.split(" ");
                timestamp=dateFormat(sp[0])+" at "+sp[1];
                var jobPoster=job.user_master_iduser_master;
                var jobPosterName=stripslashes(jobPoster.user_name);
                var well=document.createElement("div");
                $(well).addClass("well");
                    var h5=document.createElement("h5");
                    $(h5).html("Job posted by");
                $(well).append(h5);
                    var h3=document.createElement("h3");
                    $(h3).html(jobPosterName);
                $(well).append(h3);
                var mainDiv=document.createElement("div");
                $(mainDiv).append(well);
                var well2=document.createElement("div");
                $(well2).addClass("well");
                var txt='<form name="jobapply"><div class="form-group" id="appemailgroup"><label for="appemail">Your email</label><input type="email" name="appemail" id="appemail" placeholder="Enter a valid email ID" class="form-control"></div><div class="form-group" id="user_namegroup"><label for="user_name">Your full name</label><input type="text" name="user_name" id="user_name" placeholder="Enter your full name" class="form-control"></div><div class="form-group" id="youtubegroup"><label for="youtubegroup">Youtube video URL</label><input type="url" name="youtube" id="youtube" placeholder="Paste a YouTube link here" class="form-control" ng-blur="getYoutubeVideo()"></div><div id="youtuberesult"></div><button type="button" class="btn btn-primary">Apply</button></form>';
                $(well2).html(txt);
                $(mainDiv).append(well2);
                messageBox(jobTitle,mainDiv);
            }
            else{
                messageBox("Invalid Application","We were unable to find this job application. Please refresh the page and try again.");
            }
        }
    };
    $scope.getYoutubeVideo=function(){
        var url=$.trim($("#youtube").val());
        console.log(url);
        if(url.indexOf("http")!=-1){
            if(url.indexOf("youtube")!=-1){
                $("#youtubegroup").removeClass("has-error");
                var sp=url.split("watch?v=");
                var videoID=$.trim(sp[1]);
                var txt='<iframe width="100%" height="315" src="https://www.youtube.com/embed/'+videoID+'" frameborder="0" allowfullscreen></iframe>';
                $("#youtuberesult").html(txt);
            }
            else{
                $("#youtubegroup").addClass("has-error");
                $("#youtube").val("Invalid URL");
            }
        }
        else{
            $("#youtubegroup").addClass("has-error");
            $("#youtube").val("Invalid URL");
        }
    }
    $scope.applyJob=function(jobID){
        var userEmail=$.trim($("#appemail").val());
        if(userEmail!=""){
            $("#appemailgroup").removeClass("has-error");
            var userName=$.trim($("#user_name").val());
            if(userName!=""){
                $("#user_namegroup").removeClass("has-error");    
                var youtube=$.trim($("#youtube").val());
                if((youtube!="")&&(youtube.indexOf(" ")==-1)){
                    $("#youtubegroup").removeClass("has-error");        

                }
                else{
                    $("#youtubegroup").addClass("has-error");        
                }
            }
            else{
                $("#user_namegroup").addClass("has-error");    
            }
        }
        else{
            $("#appemailgroup").addClass("has-error");
        }

    };
});