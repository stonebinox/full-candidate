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
app.controller('apps',function($scope,$http){
    $scope.applicationArray=[];
    $scope.application_id=null;
    $scope.appCount=0;
    $scope.getApplications=function(){
        $http({
            method: 'GET',
            url: 'getApplications'
        }).then(function success(response){
            response=response.data;
            console.log(response);
        }, function error(response){
            messageBox("Problem","Something went wrong while loading your list of applications. Please try again later. This is the error we see: "+response);
        });
    }; 
    $scope.displayApplications=function(){

    };
    $scope.createApplicationForm=function(){
        var form=document.createElement("form");
        $(form).attr("method","post");
        $(form).attr("action","createApplication");
        $(form).attr("autocomplete","off");
        $(form).attr("name","createapp");
            var appTitleGroup=document.createElement("div");
            $(appTitleGroup).addClass("form-group");
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
        messageBox("Create Application",form);
        $compile("#myModal")($scope);
    };
});