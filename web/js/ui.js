function messageBox(title,content,sizeFlag){
    title=$.trim(title);
	var modal=document.getElementById("myModal");
	$(modal).html('');
    if(sizeFlag==0){
        sizeFlag='modal-sm';
    }
    else{
        sizeFlag='modal-lg';
	}
	var dialog=document.createElement("div");
	$(dialog).addClass("modal-dialog "+sizeFlag);
		var modalContent=document.createElement("div");
		$(modalContent).addClass("modal-content");
			var modalHeader=document.createElement("div");
			$(modalHeader).addClass("modal-header");
				var close=document.createElement("a");
				//$(close).attr("type","button");
				$(close).attr("href","#");
				$(close).attr("data-dismiss","modal");
				$(close).html('&times;');
				$(close).addClass("close");
				$(modalHeader).append(close);
				var h4=document.createElement("h4");
				$(h4).addClass("modal-title");
				$(h4).html(title);
				$(modalHeader).append(h4);
			var modalBody=document.createElement("div");
			$(modalBody).addClass("modal-body");
				var p=document.createElement("p");
				$(p).append(content);
				$(modalBody).append(p);
			var modalFooter=document.createElement("div");
			$(modalFooter).addClass("modal-footer");
				var closebut=document.createElement("button");
				$(closebut).attr("type","button");
				$(closebut).attr("data-dismiss","modal");
				$(closebut).addClass("btn btn-default");
				$(closebut).html("Close");
				$(modalFooter).append(closebut);
			$(modalContent).append(modalHeader);
			$(modalContent).append(modalBody);
			$(modalContent).append(modalFooter);
		$(dialog).append(modalContent);
	$(modal).append(dialog);
	$("#myModal").modal("show");
}