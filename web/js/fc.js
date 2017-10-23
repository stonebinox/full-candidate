var app=angular.module('login',[]);
app.controller('auth',function($scope){
    
});
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
            messageBox("Invalid Name","Please enter a valid full name.");
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
            response=$.trim(response.data);
            if(response=="INVALID_USER_ID"){
                window.location='logout';
            }
            else if(response=="NO_APPLICATIONS_FOUND"){
                var p=document.createElement("p");
                $(p).html("No applications found.");
                $("#appHolder").html(p);
            }
            else{
                response=JSON.parse(response);
                $scope.applicationArray=response.slice();
                $scope.displayApplications();
            }
        }, function error(response){
            messageBox("Problem","Something went wrong while loading your list of applications. Please try again later. This is the error we see: "+response);
        });
    }; 
    $scope.displayApplications=function(){
        var applications=$scope.applicationArray.slice();

    };
    $scope.createApplicationForm=function(){
        var form=document.createElement("form");
        $(form).attr("method","post");
        $(form).attr("action","createApplication");
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
            var appDesc=$.trim(document.createpp.appdesc.value);
            if(appDesc!=""){
                $("#appdescgroup").removeClass("has-error");
                document.createapp.submit();
            }
            else{
                $("#appdescgroup").addClass("has-error");
            }
        }
        else{
            $("#apptitlegroup").addClass("has-error");
        }
    };
});