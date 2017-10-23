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