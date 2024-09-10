var audioFiles = ['/content/dam/mca/audio/captcha/calm-waves-1.wav', '/content/dam/mca/audio/captcha/gentle-ocean-waves-4.wav', '/content/dam/mca/audio/captcha/nature-jungle-2.wav', '/content/dam/mca/audio/captcha/waves-3.wav'];

function playRandomAudio(firstNumber, secondNumber) {
    var randomIndex = Math.floor(Math.random() * audioFiles.length);
    var audio = new Audio(audioFiles[randomIndex]);
    audio.play();
    setTimeout(() =>{
        const firstNumberSpeech = new SpeechSynthesisUtterance(); 
        const secondNumberSpeech = new SpeechSynthesisUtterance();
        const plus = new SpeechSynthesisUtterance();
        firstNumberSpeech.text = firstNumber;
        plus.text="plus";
        secondNumberSpeech.text = secondNumber;
        const speechSynthesis = window.speechSynthesis;
        speechSynthesis.speak(firstNumberSpeech);
        speechSynthesis.speak(plus);
        speechSynthesis.speak(secondNumberSpeech);
    }, 2000)
}

let searchtype;
let advSearchFlag = false;
let isGenerateTable = false;
sessionStorage.removeItem("curentTarget");
sessionStorage.removeItem("companyDetails");
$("#customCaptchaInput").val("");
$(document).ready(function() {
    console.log("location",window.location.pathname);
    if(window.location.pathname==="/content/mca/global/en/mca/master-data/View-Companies-Directors-under-prosecution-V3.html"){
        $(".refine-search").hide();
        sessionStorage.clear()
    }
	sessionStorage.removeItem("curentTarget");
    sessionStorage.removeItem("companyDetails");
    $("#customCaptchaInput").val("");
    document.getElementById("closeCaptchaBtn").style.display = "none";
    $("#captchaModal").removeClass("hide");
    generateCaptcha();

    $("#collapseOne").removeClass("show");
    $('input[name="optradio-masterdata"]').on("click", function() {
        advSearchFlag = false;
        if ($(this).val() === "") {
            $("#masterdata-search-box").prop("disabled", false);
        } else {
            $("#masterdata-search-box")
                .prop("disabled", false)
                .val("");
            let searchtype;
            let advSearchFlag = false;

            $(document).ready(function() {

                $("#collapseOne").removeClass("show");
                $('input[name="optradio-masterdata"]').on("click", function() {
                    advSearchFlag = false;
                    if ($(this).val() === "") {
                        $("#masterdata-search-box").prop("disabled", false);
                    } else {
                        $("#masterdata-search-box")
                            .prop("disabled", false)
                            .val("");
                    }
                });



                $('.border-switch-control-input').change(function() {

                    document.getElementById('refine-searchbox').value = "";
                    document.getElementById('dropdownMenuButton').textContent = "Select ROC";
                    document.getElementById('dropdownMenuButton1').textContent = "Select State";

                    let isAdvancedSearchClicked = document.querySelector('.border-switch-control-input').classList.contains('collapsed');
                    console.log(isAdvancedSearchClicked);
                    if (isAdvancedSearchClicked == false) {
                        document.querySelector('.table.two-advsearchdata.table-borderless').style.display = "block";


                    }


                });



                $('input[name="optradio-masterdata"]').on("change", function() {
                    clearAndHideTables();
                });

                $("#searchicon").on('click', function(e) {
                    if ($("#masterdata-search-box").val() == "") {
                        $("#EnterDataInSearchBoxModal").modal("show");
                    } else if ($("#masterdata-search-box").val() != "") {
                        $('.masterdata-results select').addClass("pageselectclass");
                        $('.masterdata-results select').removeClass("pageselectclassrefine");
                        $("#captchaModal").removeClass("hide");
                        sessionStorage.removeItem("curentTarget");
                        sessionStorage.removeItem("companyDetails");
                        $("#customCaptchaInput").val("");
                        generateCaptcha();
                        generateMasterDatatable();
                        generateTable(e);
                    }
                    if (e.which == 38) {
                        highlightRow(-1);
                    }
                    if (e.which == 40) {
                        highlightRow(1);
                    }
                    if ($("#masterdata-search-box").val().length <= 2) {
                        $("table.one").hide();
                        $("table.one tbody").empty();
                        flag = false;
                    }
                });

                var pageSize = 5;
                var current_page = 1;
                var dataCount;
                var rowsCount = 10;
                var result;
                const autoSuggestionResultRows = 10;
                $("#masterdata-search-box").val("");

                $("#masterdata-search-box").on("input keydown", e => {

                    if ($("#masterdata-search-box").val() == "" && e.which == 13) {
                        $("#EnterDataInSearchBoxModal").modal("show");
                    } else if ($("#masterdata-search-box").val() != "" && e.which == 13) {
                        sessionStorage.removeItem("curentTarget");
                        sessionStorage.removeItem("companyDetails");
                        $("#customCaptchaInput").val("");
                        $("#captchaModal").removeClass("hide");
                        generateCaptcha();
                        generateMasterDatatable();
                        //isGenerateTable == true;
                        generateTable(e);

                    }
                    if (e.which == 38) {
                        highlightRow(-1);
                    }
                    if (e.which == 40) {
                        highlightRow(1);
                    }
                    if ($("#masterdata-search-box").val().length <= 2) {
                        $("table.one").hide();
                        $("table.one tbody").empty();
                        flag = false;
                    }
                });
                const generateTable = e => {
                    e.target.blur();
                    $("table.two-masterdata tbody").empty();
                    $(".results span:nth-child(1),.results-pagin span:nth-child(1)").html(
                        rowsCount
                    );
                    $(".results span:nth-child(2),.results-pagin span:nth-child(2)").html(
                        dataCount
                    );
                    setResultRows();
                    setPagination();
                    $("table.one tbody").empty();
                    $(
                        ".masterdatasearch .masterdata-results, .masterdata-results-pagin"
                    ).show();
                    $(".refine-search").off("keydown keypress keyup click contextmenu");
                    $(".refine-search").css("opacity", "1");
                    $(".refine-btn").prop("disabled", false);
                };

			$(".masterdata-results select").change(function() {
                    current_page = 1;
                    rowsCount = $(this)
                        .children(":selected")
                        .val();
                    setResultRows();
                    setPagination();
                });
                $("#masterdata-wrapper").on("click", "#next", function() {
                    current_page = current_page + 1;
                    setResultRows();
                    setPagination();
                });
                $("#masterdata-wrapper").on("click", "#prev", function() {
                    current_page = current_page - 1;
                    setResultRows();
                    setPagination();
                });
                $("#masterdata-wrapper").on("click", "a", function(e) {
                    current_page = Number($(e.target).text());
                    setResultRows();
                    setPagination();
                });
                var modal = document.getElementById("myModal");
                var btn = document.getElementById("myBtn");
                var span = document.getElementsByClassName("btn cancel")[0];
                $(".masterdatasearch table.two-masterdata tbody ").on("click", "tr", function(
                    e
                ) {

                    $("#customCaptchaInput").val("");
                    document.getElementById("closeCaptchaBtn").style.display = "block";
                    $("#captchaModal").removeClass("hide");

                    sessionStorage.setItem(
                        "curentTarget",
                        $(e.currentTarget.childNodes)
                        .find(".company-id")
                        .text()
                    );
                    generateCaptcha();
                });



                $(".masterdatasearch table.two-directordata tbody ").on("click", "tr", function(
                    e
                ) {
                    $("#customCaptchaInput").val("");
                    document.getElementById("closeCaptchaBtn").style.display = "block";
                    $("#captchaModal").removeClass("hide");
                    sessionStorage.setItem(
                        "curentTarget",
                        $(e.currentTarget.childNodes)
                        .find(".company-id")
                        .text()
                    );
                    generateCaptcha();
                });

                document.getElementById('refine-searchbox').addEventListener('submit', function(e) {
                    if (input.value.trim() === '') {

                        e.preventDefault();

                        alert("please enter registration Number")
                    }

                })




                $(".masterdatasearch table.two-directordata tbody ").on(
                    "click",
                    "tr",
                    function() {}
                );

                $(".masterdatasearch table.one tbody ").on("click", "tr", function(e) {
                    $("#customCaptchaInput").val("");
                    document.getElementById("closeCaptchaBtn").style.display = "block";
                    $("#captchaModal").removeClass("hide");
                    sessionStorage.setItem(
                        "curentTarget",
                        $(e.currentTarget.childNodes)
                        .find(".company-id")
                        .text()
                    );
                    generateCaptcha();
                });

                $("#refresh-img").on("click", function(e) {
                    generateCaptcha();
                    $("#customCaptchaInput").val("");
                    $("#customCaptchaInput").css("border", "1px solid black");
                });

                var captchaResult;

                function generateCaptcha() {
                    var first;
                    var second;
                    debugger;
                   $.ajax({
			url: "/bin/mca/generateCaptcha",
			type: "GET",
			success: function(response) {
                console.log("response",response);
				var responseDecoded = decodeURIComponent(response);
      			var result = JSON.parse(decrypt(responseDecoded));
                console.log("result",result);
            	$("#showResult").empty();
        		$("#result").val(" ");
        		var c = document.getElementById("captchaCanvas");
        		var ctx = c.getContext("2d");
        		var img = document.getElementById("captcha-img");
        		ctx.drawImage(img, 0, 0);
        		first = result.firstNumber;
        		second = result.secondNumber;
        		captchaResult = first + second;
        		var challenge = first + "+" + second;
        		var ctxText = c.getContext("2d");
        		ctxText.font = "20px Arial";
        		ctxText.fillText(challenge, 70, 50);

           }
        })
        var yes = document.getElementById("captcha_play_image");
       			yes.onclick = function() {

                        let num1=parseInt(first,10);
                    	let num2=parseInt(second,10);
						playRandomAudio(num1,num2);
        		}


                }


                $("#check").click(function() {


                    validateCaptcha();
                });

                function validateCaptcha() {
		   var userValue=$("#customCaptchaInput").val()
           var requestDataOne = "userInput=" + userValue + "&captcha="+captchaResult;
			$.ajax({
                url: "/bin/mca/validateCaptcha",
                type: "POST",
                dataType: "json",
                data: "data=" + encrypt(requestDataOne),
                async: false,
                success: function(response) {
					if(response.isValid==true){
						console.log('advSearchFlag===', advSearchFlag);
                    console.log('in validatecaptcha ', captchaResult);
                    searchtype = $("input[name='optradio-masterdata']:checked").val();
                    console.log('SEARCHTYPE IN CAPTCHA VALIDATION >> ', searchtype);
                    $("#showResult").empty();
                    if (($("#customCaptchaInput").val() == captchaResult) || ($("#customCaptchaInput").val() != captchaResult)) {
                        captchaValidationResult = true;
                        $("#customCaptchaInput").css("border", "1px solid black");
                        debugger;
                        if (captchaValidationResult) {
                            if (advSearchFlag) {
                                // advance search

                            } else {
                                if (searchtype === "company" && null != sessionStorage.getItem("curentTarget")) {

                                    var requestData = "ID=" + sessionStorage.getItem("curentTarget") + "&requestID=cin";
                                    console.log("FORM DATA  : ", requestData);
                                    $.ajax({
                                        url: "/bin/MDSMasterDataServlet",
                                        type: "POST",
                                        dataType: "json",
                                        data: "data=" + encrypt(requestData),
                                        async: false,
                                        success: function(response) {
                                            //result = $(response.data.);
                                            console.log(
                                                "<< Company Details response is >> : " + JSON.stringify(response.data)
                                            );
                                            sessionStorage.setItem(
                                                "companyDetails",
                                                JSON.stringify(response.data)
                                            );
                                            sessionStorage.removeItem("currentTarget");

                                        }
                                    });
                                    if (sessionStorage.getItem("companyDetails") != null) {
                                        var redirect = document.getElementById(
                                            "redirectToCompanyMaster"
                                        ).value;

                                        window.location.href = redirect + ".html";

                                    }
                                } else if (searchtype === "director") {
                                    const DIN = sessionStorage.getItem("curentTarget");
                                    if(window.location.pathname==="/content/mca/global/en/mca/master-data/View-Companies-Directors-under-prosecution-V3.html"){
                        				const DIN = sessionStorage.getItem("curentTarget");
                        				var redirect = document.getElementById("redirectToDirectorMaster").value;
										if(DIN!=null){
                                            sessionStorage.setItem("DIN",DIN);
											window.location.href="/content/mca/global/en/mca/master-data/View-Companies-Directors-under-prosecution-V3/company-prosecution.html"
                          				}
									}
                       				else if(window.location.pathname==="/content/mca/global/en/mca/master-data/MDS.html"){
                        				const DIN = sessionStorage.getItem("curentTarget");
                        				var redirect = document.getElementById("redirectToDirectorMaster").value;
										if(DIN!=null){
											window.location.href = redirect + `.html?DIN=${encrypt(DIN)}`;
                          				}
									}

                                }
                            }

                        }
                        $("#captchaModal").addClass("hide");
                    } else if ($("#customCaptchaInput").val() == "") {
                        $("#customCaptchaInput").css("border", "1px solid red");
                        $("#showResult").append("Please enter captcha.");
                        captchaValidationResult = false;
                    } else {
                        $("#customCaptchaInput").css("border", "1px solid red");
                        $("#showResult").append(
                            "The captcha entered is incorrect. Please retry."
                        );
                        captchaValidationResult = false;
                    }

					}
			}
			})



                }

                function saveSelectedCompanyDetails(scope) {
                    var statustype = $(scope)
                        .find(".statustype")
                        .html();
                    var company = $(scope)
                        .find(".companyname")
                        .html();
                    var dateofincorporation = $(scope)
                        .find(".dateofincorporation")
                        .html();
                    var cnNmbr = $(scope)
                        .find(".company-id")
                        .html();
                    var companystatus = $(scope)
                        .find(".statustype")
                        .html();
                    var state = $(scope)
                        .find(".state")
                        .html();

                    if (statustype.trim() == "Active") {
                        redirectToDocumentCategory(
                            company,
                            dateofincorporation,
                            cnNmbr,
                            companystatus,
                            state
                        );
                    } else {
                        var status = $(scope)
                            .find(".statustype")
                            .html();
                        sessionStorage.setItem("company", company.trim());
                        sessionStorage.setItem("dateofincorporation", dateofincorporation.trim());
                        sessionStorage.setItem("cnNmbr", cnNmbr.trim());
                        sessionStorage.setItem("companystatus", companystatus.trim());
                        sessionStorage.setItem("state", state);
                        var data =
                            "Company selected has status as " +
                            sessionStorage.getItem("companystatus").trim() +
                            ". Are you sure you want to proceed? ";
                        setCompanyStatusToModal(data);
                        $("#myModal").modal("show");
                    }
                }

                function redirectToSearch(searchkeyword) {
                    var searchtype = $('input[name="optradio-masterdata"]:checked').val();
                    var redirect;
                    if (searchtype.toUpperCase() === "company".toUpperCase()) {
                        redirect =
                            "/content/mca/global/en/mca/master-data/company-results.html?searchkeyword=" +
                            searchkeyword;
                    } else if (searchtype.toUpperCase() === "director".toUpperCase()) {
                        redirect =
                            "/content/mca/global/en/mca/master-data/director-results.html?searchkeyword=" +
                            searchkeyword;
                    }
                    window.location.href = redirect;
                }

                function redirectToDocumentCategory(
                    company,
                    dateofincorporation,
                    cnNmbr,
                    companystatus,
                    state
                ) {
                    sessionStorage.setItem("company", company);
                    sessionStorage.setItem("dateofincorporation", dateofincorporation);
                    sessionStorage.setItem("cnNmbr", cnNmbr);
                    sessionStorage.setItem("companystatus", companystatus);
                    sessionStorage.setItem("state", state);

                    var redirectToDocumentCategoryUrl = document.getElementById(
                        "redirectToDocumentCategoryUrl"
                    ).value;

                    redirect = redirectToDocumentCategoryUrl + ".html";
                    window.location.href = redirect;
                }
                $("#masterdata-search-box").on("focus", function(e) {
                    $(".autosuggest-table table.one").show();
                    if ($("#masterdata-search-box").val().length >= 3) {}
                });
                $(".autosuggest-table table.one tr").on("keydown", function(e) {
                    console.log("keydown func");
                });

                function highlightRow(direction) {
                    var rows = $("table.one tbody tr");
                    var current = rows.filter(".highlight_row").index();
                    var next = current + direction;
                    if (direction < 0 && next < 0) next = 0;
                    if (direction > 0 && next >= rows.length) next = rows.length - 1;
                    rows.removeClass("highlight_row");
                    rows.eq(next).addClass("highlight_row");
                }
                $(document).click(function(e) {
                    if ($(e.target).attr("class") != "table.one") {
                        $("table.one").hide();
                    }
                });
                $("#radio2").click(function() {
                    console.log("clicked radio2");
                    $("#masterdata-search-box").attr("placeholder", "Enter name, DIN, DPIN");
                });
                $("#radio1").click(function() {
                    console.log("clicked radio2");
                    $("#masterdata-search-box").attr(
                        "placeholder",
                        "Enter Company/LLP name, CIN/FCRN/LLPIN/FLLPIN"
                    );
                });
                //Close the captcha modal window
                $(".close").click(function() {
                    $("#captchaModal").addClass("hide");
                });
            });

            function changePlaceholderCompany() {
                $("#refine-search-accordion .border-switch-control-input").prop(
                    "checked",
                    false
                );
                $("#refine-search-accordion #collapseOne").removeClass("show");
                $("#masterdata-search-box").attr(
                    "placeholder",
                    "Enter Company/LLP name, CIN/FCRN/LLPIN/FLLPIN"
                );
            }

            function changePlaceholder() {
                $("#refine-search-accordion .border-switch-control-input").prop(
                    "checked",
                    false
                );
                $("#refine-search-accordion #collapseOne").removeClass("show");
                $("#masterdata-search-box").attr("placeholder", "Enter name, DIN, DPIN");
            }

            function setCompanyStatusToModal(input) {
                document.getElementById("modalparagraph").innerHTML = input;
            }

            function checkRadioResponse() {
                var radiochecked = document.getElementById("Yes");
                if (radiochecked.checked == true) {
                    window.location.href =
                        "/content/mca/global/en/mca/master-data/document-categories.html";
                } else {
                    window.location.href =
                        "/content/mca/global/en/mca/document-related-services/VPD.html";
                }
            }

            /** Starting for Director */

            const changePlaceholderDirector = () => {
                $("#refine-search-accordion .border-switch-control-input").prop(
                    "checked",
                    false
                );
                $("#refine-search-accordion #collapseOne").removeClass("show");
                $("#masterdata-search-box").attr("placeholder", " Enter name, DIN, DPIN");
            };

            const clearAndHideTables = () => {
                $(".masterdata-results").hide();
                $(".masterdata-results-pagin").hide();
                $("table.two-masterdata tbody").empty();
                $("table.two-directordata tbody").empty();
                $(".two-directordata").hide();
                $(".two-masterdata").hide();
            };


            $(document).on("click", ".btn-outline-primary", function() {
                advSearchFlag = true;

            });



        }
    });
    $('input[name="optradio-masterdata"]').on("change", function() {
        clearAndHideTables();
        $(".two-advsearchdata").hide();
        $("table.two-advsearchdata tbody").empty();
        current_page = 1;


    });

    $("#searchicon").on('click', function(e) {
        if ($("#masterdata-search-box").val() == "") {
            $("#EnterDataInSearchBoxModal").modal("show");
        } else if ($("#masterdata-search-box").val() != "") {
            $('.masterdata-results select').addClass("pageselectclass");
            $('.masterdata-results select').removeClass("pageselectclassrefine");
            sessionStorage.removeItem("curentTarget");
            sessionStorage.removeItem("companyDetails");
            $("#customCaptchaInput").val("");
            document.getElementById("closeCaptchaBtn").style.display = "none";
            $("#captchaModal").removeClass("hide");
            generateCaptcha();
            generateMasterDatatable();
            generateTable(e);
        }
        if (e.which == 38) {
            highlightRow(-1);
        }
        if (e.which == 40) {
            highlightRow(1);
        }
        if ($("#masterdata-search-box").val().length <= 2) {
            $("table.one").hide();
            $("table.one tbody").empty();
            flag = false;
        }
    });


    var pageSize = 5;
    var current_page = 1;
    var dataCount;
    var rowsCount = 10;
    var result;
    const autoSuggestionResultRows = 10;

    $("#masterdata-search-box").on("input keydown", e => {
        if ($("#masterdata-search-box").val() == "" && e.which == 13) {
            $("#EnterDataInSearchBoxModal").modal("show");
        } else if ($("#masterdata-search-box").val() != "" && e.which == 13) {
            sessionStorage.removeItem("curentTarget");
            sessionStorage.removeItem("companyDetails");
            $("#customCaptchaInput").val("");
            $("#captchaModal").removeClass("hide");
            generateCaptcha();
            generateMasterDatatable();
            generateTable(e);

        }
        if (e.which == 38) {
            highlightRow(-1);
        }
        if (e.which == 40) {
            highlightRow(1);
        }
        if ($("#masterdata-search-box").val().length <= 2) {
            $("table.one").hide();
            $("table.one tbody").empty();
            flag = false;
        }
    });
    const generateTable = e => {
        e.target.blur();
        $("table.two-masterdata tbody").empty();
        $(".results span:nth-child(1),.results-pagin span:nth-child(1)").html(
            rowsCount
        );
        $(".results span:nth-child(2),.results-pagin span:nth-child(2)").html(
            dataCount
        );
        setResultRows();
        setPagination();
        $("table.one tbody").empty();
        $(
            ".masterdatasearch .masterdata-results, .masterdata-results-pagin"
        ).show();
        $(".refine-search").off("keydown keypress keyup click contextmenu");
        $(".refine-search").css("opacity", "1");
        $(".refine-btn").prop("disabled", false);
    };


    function generateMasterDatatable() {

        searchtype = $("input[name='optradio-masterdata']:checked").val();

        var searchkeyword = $("#masterdata-search-box").val().replace("&", encodeURIComponent("&"));
        if ($("#masterdata-search-box").val().length != 0) {

            $("table.one").show();
            let reqData = "module=MDS&searchKeyWord=" + searchkeyword + "&searchType=autosuggest&mdsSearchType=searchedName&mdsSearchType="+searchtype;
            $.ajax({
                url: "/bin/mca/mds/commonSearch",
                type: "GET",
                data:"data=" +encrypt(reqData),
                dataType: "json",
                success: function(response) {
                    result = $(response.data.result);
                    dataCount = result.length;
                    console.log("MDSresp",response);

                    console.log("dataCount",dataCount);
                    console.log('result line no 1343  ', result);

                    if (dataCount == 0) {



                        $("table.two-masterdata tbody").empty();
                        $("table.one tbody").empty();
                        var row = '<tr><td colspan = "7" style="text-align:center"> No Results Found </td></tr>';
                        $("table.two-masterdata tbody").append(row);



                    } else {

                        setResultRows();
                        setPagination();
                    }
                }
            });
        }
    }

    function setResultRows() {
        $(".two-directordata").show();
        $(".two-masterdata").show();
        $(".two-advsearchdata").show();
       $("table.two-masterdata tbody").empty();
       $("table.two-directordata tbody").empty();
       $("table.two-advsearchdata tbody").empty();
        searchtype = $("input[name='optradio-masterdata']:checked").val();
        var markup_two;
        var startIndex = (current_page - 1) * rowsCount;
        var endIndex = Math.min(startIndex + (rowsCount - 1), dataCount - 1);
        for (i = startIndex; i <= endIndex; i++) {
            var srNo = i + 1;
            var stateOne;
            if (result[i].state != "") {
                stateOne = result[i].state;
            } else {
                stateOne = "-";
            }
            if (searchtype.toUpperCase() === "company".toUpperCase()) {
                markup_two =
                    "<tr><td>" +
                    srNo +
                    " </td><td class=companyname> " +
                    result[i].cmpnyNm +
                    " </td><td><u class=company-id>" +
                    result[i].cnNmbr +
                    "</u></td class=state><td> " +
                    stateOne +
                    "</td><td class=statustype> " +
                    result[i].cmpnySts +
                    "</td><td class=dateofincorporation>" +
                    result[i].dateOfIncorporation +
                    "</td></tr>";
                $("table.two-masterdata tbody").append(markup_two);
            } else if (searchtype.toUpperCase() === "director".toUpperCase()) {
                var markup_two =
                    "<tr><td>" +
                    srNo +
                    " </td><td>" +
                    result[i].drNm.replace(/[.-]/g,'') +
                    " </td><td><u class=company-id>" +
                    result[i].dpnNmbr +
                    "</u></td>";
                $("table.two-directordata tbody").append(markup_two);
            }
        }
        if (searchtype.toUpperCase() === "company".toUpperCase()) {
            $("table.two-directordata thead").hide();
            $("table.two-masterdata thead").show();
        } else if (searchtype.toUpperCase() === "director".toUpperCase()) {
            $("table.two-masterdata thead").hide();
            $("table.two-directordata thead").show();
        }
        $(
            ".masterdata-results span:nth-child(1),.masterdata-results-pagin span:nth-child(1)"
        ).html(endIndex + 1);
        $(
            ".masterdata-results span:nth-child(2),.masterdata-results-pagin span:nth-child(2)"
        ).html(dataCount);
        console.log("dc",dataCount);

    }

    function setPagination() {
        $(".pagination ul #masterdata-wrapper").empty();
        if (dataCount && dataCount > 0) {
            var page = $(".pagination ul #masterdata-wrapper");
            var pages = Math.ceil(dataCount / rowsCount);
            var maxIterations = 5;
            var iterations = Math.min(pages, maxIterations);
            var center = Math.round(maxIterations / 2);
            var offset = current_page - center;
            var label;
            if (current_page < center) {
                offset = 0;
            }
            if (offset + iterations > pages) {
                offset -= offset + iterations - pages;
            }
            page.append(
                '<span id="prev"><img src="/content/dam/mca/icons/previous-deactive.png" tabindex="0" alt="previous"></img>Previous</span><li><p class="mr-2">Page</p></li>'
            );
            for (var i = 0; i < iterations; i++) {
                label = i + 1 + offset;
                if (current_page == label) {
                    page.append(
                        '<li><a class="active mr-1">' + label + "</a></div></li>"
                    );
                } else {
                    page.append('<li><a class="mr-1">' + label + "</a></div></li>");
                }
            }
            page.append(
                '<span id="next">Next<img src="/content/dam/mca/icons/next-active.png" tabindex="0" alt="next"></img></span>'
            );
            if (current_page == 1) {
                $("#prev").css({
                    "pointer-events": "none",
                    opacity: "40%"
                });
            }
            if (current_page == label) {
                $("#next").css({
                    "pointer-events": "none",
                    opacity: "40%"
                });
            }
        }
    }
    $(".masterdata-results select").change(function() {
        current_page = 1;
        rowsCount = $(this)
            .children(":selected")
            .val();
        setResultRows();
        setPagination();
    });
    $("#masterdata-wrapper").on("click", "#next", function() {
        current_page = current_page + 1;
        setResultRows();
        setPagination();
    });
    $("#masterdata-wrapper").on("click", "#prev", function() {
        current_page = current_page - 1;
        setResultRows();
        setPagination();
    });
    $("#masterdata-wrapper").on("click", "a", function(e) {
        current_page = Number($(e.target).text());
        setResultRows();
        setPagination();
    });
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("btn cancel")[0];
    $(".masterdatasearch table.two-masterdata tbody ").on("click", "tr", function(
        e
    ) {
        $("#customCaptchaInput").val("");
        document.getElementById("closeCaptchaBtn").style.display = "block";
        $("#captchaModal").removeClass("hide");
        sessionStorage.setItem(
            "curentTarget",
            $(e.currentTarget.childNodes)
            .find(".company-id")
            .text()
        );
        generateCaptcha();
    });
    $(".masterdatasearch table.two-directordata tbody ").on("click", "tr", function(
        e
    ) {
        $("#customCaptchaInput").val("");
        document.getElementById("closeCaptchaBtn").style.display = "block";
        $("#captchaModal").removeClass("hide");
        sessionStorage.setItem(
            "curentTarget",
            $(e.currentTarget.childNodes)
            .find(".company-id")
            .text()
        );
        generateCaptcha();
    });

    $(".masterdatasearch table.two-directordata tbody ").on(
        "click",
        "tr",
        function() {}
    );

    $(".masterdatasearch table.two-advsearchdata tbody ").on("click", "tr", function(
        e
    ) {
        $("#customCaptchaInput").val("");
        document.getElementById("closeCaptchaBtn").style.display = "block";

        $("#captchaModal").removeClass("hide");
        sessionStorage.setItem(
            "curentTarget",
            $(e.currentTarget.childNodes)
            .find(".company-id")
            .text()
        );
        generateCaptcha();
    });


    $(".masterdatasearch table.one tbody ").on("click", "tr", function(e) {
        $("#customCaptchaInput").val("");
        document.getElementById("closeCaptchaBtn").style.display = "block";
        $("#captchaModal").removeClass("hide");
        sessionStorage.setItem(
            "curentTarget",
            $(e.currentTarget.childNodes)
            .find(".company-id")
            .text()
        );
        generateCaptcha();
    });

    $("#refresh-img").on("click", function(e) {
        generateCaptcha();
        $("#customCaptchaInput").val("");
        $("#customCaptchaInput").css("border", "1px solid black");
    });

    var captchaResult;

    function generateCaptcha() {
        var first;
        var second;
        $("#showResult").empty();
        $("#result").val(" ");
        $.ajax({
			url: "/bin/mca/generateCaptcha",
			type: "GET",
			success: function(response) {
                console.log("response",response);
				var responseDecoded = decodeURIComponent(response);
      			var result = JSON.parse(decrypt(responseDecoded));
                console.log("result",result);
				var c = document.getElementById("captchaCanvas");
        		var ctx = c.getContext("2d");
        		var img = document.getElementById("captcha-img");
        		ctx.drawImage(img, 0, 0);
        		first = result.firstNumber;
        		second = result.secondNumber;
        		captchaResult = first + second;
        		var challenge = first + "+" + second;
        		var ctxText = c.getContext("2d");
        		ctxText.font = "20px Arial";
        		ctxText.fillText(challenge, 70, 50);
			},
            error:function(xhr,status,error){
                console.log(error);

            }
        });
        var yes = document.getElementById("captcha_play_image");
       			yes.onclick = function() {

                        let num1=parseInt(first,10);
                    	let num2=parseInt(second,10);
						playRandomAudio(num1,num2);
        		}



    }
    $("#check").click(function() {

        validateCaptcha();
    });

    function validateCaptcha() {

           var userValue=$("#customCaptchaInput").val()
           var requestDataOne = "userInput=" + userValue + "&captcha="+captchaResult;
			$.ajax({
                url: "/bin/mca/validateCaptcha",
                type: "POST",
                dataType: "json",
                data: "data=" + encrypt(requestDataOne),
                async: false,
                success: function(response) {
                	$("#showResult").empty();
					if(response.isValid==true){
						console.log('advSearchFlag===', advSearchFlag);
						console.log('in validatecaptcha ', captchaResult);
						console.log('SEARCHTYPE IN CAPTCHA VALIDATION >> ', searchtype);
						searchtype = $("input[name='optradio-masterdata']:checked").val();
						$("#showResult").empty();
						captchaValidationResult = true;
						$("#customCaptchaInput").css("border", "1px solid black");
						if (captchaValidationResult) {
							if (advSearchFlag && null != sessionStorage.getItem("curentTarget")) {
							//start advance company search
							var requestData = "ID=" + sessionStorage.getItem("curentTarget") + "&requestID=cin";
							console.log("FORM DATA  : ", requestData);
							$.ajax({
								url: "/bin/MDSMasterDataServlet",
								type: "POST",
								dataType: "json",
								data: "data=" + encrypt(requestData),
								async: false,
								success: function(response) {
								//result = $(response.data.);
								console.log("<< Company Details response is >> : " + JSON.stringify(response.data));
								sessionStorage.setItem("companyDetails",JSON.stringify(response.data));
								sessionStorage.removeItem("currentTarget");

                                 }
							});
						if (sessionStorage.getItem("companyDetails") != null) {
							var redirect = document.getElementById("redirectToCompanyMaster").value;
							window.location.href = redirect + ".html";
						}
						//end advance company search

						} else {
							if (searchtype === "company" && null != sessionStorage.getItem("curentTarget")) {
								var requestData = "ID=" + sessionStorage.getItem("curentTarget") + "&requestID=cin";
								console.log("FORM DATA  : ", requestData);
								$.ajax({
									url: "/bin/MDSMasterDataServlet",
									type: "POST",
									dataType: "json",
									data: "data=" + encrypt(requestData),
									async: false,
									success: function(response) {
									//result = $(response.data);
									console.log("<< Company Details response is >> : " + JSON.stringify(response.data));
									sessionStorage.setItem("companyDetails",JSON.stringify(response.data));
									sessionStorage.removeItem("currentTarget");

									}
								});
							if (sessionStorage.getItem("companyDetails") != null) {
								if(window.location.pathname==="/content/mca/global/en/mca/master-data/View-Companies-Directors-under-prosecution-V3.html"){
									window.location.href="/content/mca/global/en/mca/master-data/View-Companies-Directors-under-prosecution-V3/company-prosecution.html"
								}
								else{
									var redirect = document.getElementById("redirectToCompanyMaster").value;
									window.location.href = redirect + ".html";}
								}
							} else if (searchtype === "director") {
								if(window.location.pathname==="/content/mca/global/en/mca/master-data/View-Companies-Directors-under-prosecution-V3.html"){
									const DIN = sessionStorage.getItem("curentTarget");
									var redirect = document.getElementById("redirectToDirectorMaster").value;
									if(DIN!=null){
										sessionStorage.setItem("DIN",DIN);
										window.location.href="/content/mca/global/en/mca/master-data/View-Companies-Directors-under-prosecution-V3/company-prosecution.html"
									}
								}
								else if(window.location.pathname==="/content/mca/global/en/mca/master-data/MDS.html"){
									const DIN = sessionStorage.getItem("curentTarget");
									var redirect = document.getElementById("redirectToDirectorMaster").value;
									if(DIN!=null){
										window.location.href = redirect + `.html?DIN=${encrypt(DIN)}`;
									}
								}
							}
							else{
								$("#captchaModal").addClass("hide");
							}
						}
					}
            $("#captchaModal").addClass("hide");
        } else if ($("#customCaptchaInput").val() == "") {
            $("#customCaptchaInput").css("border", "1px solid red");
            $("#showResult").append("Please enter captcha.");
            captchaValidationResult = false;
        } else {
            $("#customCaptchaInput").css("border", "1px solid red");
            $("#showResult").append(
                "The captcha entered is incorrect. Please retry."
            );
            captchaValidationResult = false;
        }

			}
            })
        }

        function saveSelectedCompanyDetails(scope) {
        var statustype = $(scope)
            .find(".statustype")
            .html();
        var company = $(scope)
            .find(".companyname")
            .html();
        var dateofincorporation = $(scope)
            .find(".dateofincorporation")
            .html();
        var cnNmbr = $(scope)
            .find(".company-id")
            .html();
        var companystatus = $(scope)
            .find(".statustype")
            .html();
        var state = $(scope)
            .find(".state")
            .html();

        if (statustype.trim() == "Active") {
            redirectToDocumentCategory(
                company,
                dateofincorporation,
                cnNmbr,
                companystatus,
                state
            );
        } else {
            var status = $(scope)
                .find(".statustype")
                .html();
            sessionStorage.setItem("company", company.trim());
            sessionStorage.setItem("dateofincorporation", dateofincorporation.trim());
            sessionStorage.setItem("cnNmbr", cnNmbr.trim());
            sessionStorage.setItem("companystatus", companystatus.trim());
            sessionStorage.setItem("state", state);
            var data =
                "Company selected has status as " +
                sessionStorage.getItem("companystatus").trim() +
                ". Are you sure you want to proceed? ";
            setCompanyStatusToModal(data);
            $("#myModal").modal("show");
        }
    }

    function redirectToSearch(searchkeyword) {
        var searchtype = $('input[name="optradio-masterdata"]:checked').val();
        var redirect;
        if (searchtype.toUpperCase() === "company".toUpperCase()) {
            redirect =
                "/content/mca/global/en/mca/master-data/company-results.html?searchkeyword=" +
                searchkeyword;
        } else if (searchtype.toUpperCase() === "director".toUpperCase()) {
            redirect =
                "/content/mca/global/en/mca/master-data/director-results.html?searchkeyword=" +
                searchkeyword;
        }
        window.location.href = redirect;
    }

    function redirectToDocumentCategory(
        company,
        dateofincorporation,
        cnNmbr,
        companystatus,
        state
    ) {
        sessionStorage.setItem("company", company);
        sessionStorage.setItem("dateofincorporation", dateofincorporation);
        sessionStorage.setItem("cnNmbr", cnNmbr);
        sessionStorage.setItem("companystatus", companystatus);
        sessionStorage.setItem("state", state);

        var redirectToDocumentCategoryUrl = document.getElementById(
            "redirectToDocumentCategoryUrl"
        ).value;

        redirect = redirectToDocumentCategoryUrl + ".html";
        window.location.href = redirect;
    }
    $("#masterdata-search-box").on("focus", function(e) {
        $(".autosuggest-table table.one").show();
        if ($("#masterdata-search-box").val().length >= 3) {}
    });
    $(".autosuggest-table table.one tr").on("keydown", function(e) {
        console.log("keydown func");
    });

    function highlightRow(direction) {
        var rows = $("table.one tbody tr");
        var current = rows.filter(".highlight_row").index();
        var next = current + direction;
        if (direction < 0 && next < 0) next = 0;
        if (direction > 0 && next >= rows.length) next = rows.length - 1;
        rows.removeClass("highlight_row");
        rows.eq(next).addClass("highlight_row");
    }
    $(document).click(function(e) {
        if ($(e.target).attr("class") != "table.one") {
            $("table.one").hide();
        }
    });
    $("#radio2").click(function() {
        console.log("clicked radio2");
        $("#masterdata-search-box").attr("placeholder", "Enter name, DIN, DPIN");
    });
    $("#radio1").click(function() {
        console.log("clicked radio2");
        $("#masterdata-search-box").attr(
            "placeholder",
            "Enter Company/LLP name, CIN/FCRN/LLPIN/FLLPIN"
        );
    });
    //Close the captcha modal window
    $(".close").click(function() {
        $("#captchaModal").addClass("hide");
    });
});

function changePlaceholderCompany() {
    $("#refine-search-accordion .border-switch-control-input").prop(
        "checked",
        false
    );
    $("#refine-search-accordion #collapseOne").removeClass("show");
    $("#masterdata-search-box").attr(
        "placeholder",
        "Enter Company/LLP name, CIN/FCRN/LLPIN/FLLPIN"
    );
}

function changePlaceholder() {
    $("#refine-search-accordion .border-switch-control-input").prop(
        "checked",
        false
    );
    $("#refine-search-accordion #collapseOne").removeClass("show");
    $("#masterdata-search-box").attr("placeholder", "Enter name, DIN, DPIN");
}

function setCompanyStatusToModal(input) {
    document.getElementById("modalparagraph").innerHTML = input;
}

function checkRadioResponse() {
    var radiochecked = document.getElementById("Yes");
    if (radiochecked.checked == true) {
        window.location.href =
            "/content/mca/global/en/mca/master-data/document-categories.html";
    } else {
        window.location.href =
            "/content/mca/global/en/mca/document-related-services/VPD.html";
    }
}

/** Starting for Director */

const changePlaceholderDirector = () => {
    $("#refine-search-accordion .border-switch-control-input").prop(
        "checked",
        false
    );
    $("#refine-search-accordion #collapseOne").removeClass("show");
    $("#masterdata-search-box").attr("placeholder", " Enter name, DIN, DPIN");
};

const clearAndHideTables = () => {
    $(".masterdata-results").hide();
    $(".masterdata-results-pagin").hide();
    $("table.two-masterdata tbody").empty();
    $("table.two-directordata tbody").empty();
    $(".two-directordata").hide();
    $(".two-masterdata").hide();
};


$(document).on("click", ".btn-outline-primary", function() {
    advSearchFlag = true;

});


$(document).ready(function() {

    $("#privileges").on('change', function() {
        $("#shw").show();
        $("#" + $(this).val()).fadeIn(600);
    }).change();

});

function closeEnterDataInSearchBoxModal() {
    $("#EnterDataInSearchBoxModal").modal("hide");
}
$(document).ready(function() {

   $('.dropdown.t').on('show.bs.dropdown.t', function() {

        $('body').append($('.dropdown.t .dropdown-menu').css({
            position: 'absolute',
            width: '21%'
        }));

    });



    $(".border-switch-control-input").on('click', function() {
        $("#director").prop('checked', false);
        $("#company").prop('checked', false);

    });

    function debounce(callback, delay) {
        let timeoutID;
        return function() {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(callback, delay);
        }
    }



    function handleInput() {
        var regNo = document.getElementById("Rno").value;
        var digits = /^[0-9]+$/;

        if (!regNo.match(digits)) {
            document.getElementById("warning").innerHTML = "Enter numbers only";
            document.getElementById("Rno").style.border = "1px solid red";
        }
        if (regNo.match(digits) && regNo.length > 9) {
            document.getElementById("warning").innerHTML = "Enter 9-digit Registration Number";
            document.getElementById("Rno").style.border = "1px solid red";
        }
        if (regNo.match(digits) && regNo.length < 9) {
            document.getElementById("warning").innerHTML = "Enter 9-digit Registration Number";
            document.getElementById("Rno").style.border = "1px solid red";
        }
        if (regNo.match(digits) && regNo.length == 9) {
            document.getElementById("warning").innerHTML = "";
            document.getElementById("Rno").style.border = "none";
        }
        if (regNo.length == "") {
            document.getElementById("warning").innerHTML = "Please enter Registration Number";
            document.getElementById("Rno").style.border = "1px solid red";
        }
    }

 //   $("#refine-searchbox").click(function(){
 //       alert("hello");

  //  })

    //newly started
    $(".custom-control").click(function(){
    let input = document.getElementById('refine-searchbox');
    let button = document.getElementById('mybtn');
    let button1=document.getElementById("dropdownMenuButton");
    let button2=document.getElementById("dropdownMenuButton1");
        $(".bottom-form").hide();
        $("button").css({"opacity":0.4});
        $(".container-fluid").css({"padding-top":"17%"});


    button.disabled = true;
          button.style.cursor='default';
    input.addEventListener('keyup', function(event){

       let val = event.target.value;

       if(val===''){

       button.disabled = true;



            }
        else{
       $(".container-fluid").css({"padding-top":"30%"});
       $(".bottom-form").show();
       $("#dropdownMenuButton").css({"opacity":1});
         $("#dropdownMenuButton1").css({"opacity":1});

            $('.dropdown-menu').click(function(){
                  button.style.cursor='pointer';
                	   $("button").css({"opacity":1});
                        button.disabled = false;

            })

            }
   
        });

        })


    //newly ended

   $('#dropdownItems1').empty(); 
    $.ajax({
        url: "/bin/VPDGetROCServlet?data="+encrypt("type=MCA_ROC_LIST"),
        type: 'GET',
        dataType: 'json',



        success: function(resp) {
            console.log(resp);
            var roc = resp.data;
            console.log(roc);
            $.each(roc, function(i) {

                $('#dropdownItems1').append('<a class="dropdown-item" href="#">' + roc[i].name + '</a>');

            });


            $('#dropdownItems1 a').click(function(e) {
                e.preventDefault();
                console.log("dropdown value clicked " + this.text);
                var rocDD = this.text;
                console.log("rocDD " + rocDD);



                $('#dropdownMenuButton').text(rocDD);
                $('.dropdown-menu').removeClass('show');

            });



        },
        error: function(resp) {
            //("ERROR: "+ resp.statusText);
            console.log("ERROR: " + resp.statusText);
        }
    });


    $('#dropdownItems2').empty();

    $.ajax({
        url: "/bin/VPDGetStatesServlet?data="+encrypt("type=STATE_ABBREV"),
        type: 'GET',
        dataType: 'json',

        success: function(resp) {
            var states = resp.data;

            $.each(states, function(i) {

                $('#dropdownItems2').append('<a class="dropdown-item" href="#">' + states[i].state + '</a>');

            });


            $('#dropdownItems2 a').click(function(e) {
                e.preventDefault();
                $('#dropdownMenuButton1').text($(this).text());
                $('.dropdown-menu').removeClass('show');

            });
        },
        error: function(resp) {
            console.log("ERROR: " + resp.statusText);
        }
    });


   $(function() {

        
        $(".btn-outline-primary").click(function() {
             document.querySelector('.table.two-advsearchdata.table-borderless').style.display = "table";

        	$("table.two-masterdata tbody").empty();
        	$("table.two-directordata tbody").empty();

            clearAndHideTables();

            var compRegNo = $("#refine-searchbox").val();
            var ROCdata = $("#dropdownMenuButton").text();
            var statedata = $("#dropdownMenuButton1").text();

            //Setting searchType as company to redirect to company page
            var state;
            var ROC;


            if (compRegNo.trim() == '' &&  (statedata.trim() == 'Select State' && ROCdata.trim() == 'Select ROC')) {
                    document.getElementById('crn').innerHTML = "Company Registration number must not be blank";
                    document.getElementById('rocname').innerHTML = "ROC Name must not be blank";
                    document.getElementById('statename').innerHTML = "State Name must not be blank";


            }else if(compRegNo.trim() != '' &&  (statedata.trim() == 'Select State' && ROCdata.trim() == 'Select ROC')){
                    document.getElementById('crn').innerHTML = "";
                    document.getElementById('rocname').innerHTML = "ROC Name must not be blank";
                    document.getElementById('statename').innerHTML = "State Name must not be blank";
            }else {
                    document.getElementById('crn').innerHTML = "";
                    document.getElementById('rocname').innerHTML = "";
                    document.getElementById('statename').innerHTML = "";
                    state = (statedata.trim() == 'Select State' ? '' : statedata);
                    ROC = (ROCdata.trim() == 'Select ROC' ? '' : ROCdata);
                	debugger;
                	let reqData = "module=MDS&searchKeyWord=&searchType=refine&limit=10&offset=0&compRegNo=" + compRegNo + "&ROC=" + ROC + "&state=" + state;
                    $.ajax({

                        type: "GET",
                        data:"data=" +encrypt(reqData),
                        dataType: "json",
                        url: "/bin/RefineSearchCompanyData",
                        success: function(response) {

                            var rocJson = JSON.stringify(response);

                        	var dobj = JSON.parse(rocJson);
                        
                            console.log("<< ROC JSON >> ", rocJson);
                        	console.log("<< SEARCH TYPE 1 >> ", dobj["data"]["searchType"]);

                        	var count = 0;
                            $("table.two-masterdata tbody").empty();


                            var result = $(response.data.result);
                        	console.log("//////////////////////res////////////////////",result);
                            dataCount = result.length;
                        	debugger;
                        	console.log("<< DATACOUNT >> ", dataCount);
                        	debugger;
                            var markup_two;
                        	var table_heading;

                            for (var i = 0; i < dataCount; i++) {
                                 var stateOne;
                                 if (result[i].state != "") {
                                        stateOne = result[i].state;
                                 } else {
                                        stateOne = "-";
                                 }
                                console.log("advstateOne",stateOne);

                                var cmpnyNm = result[i].cmpnyNm;
                                var cnNmbr = result[i].cnNmbr;
                                var state = stateOne;
                                var cmpnySts = result[i].cmpnySts;

                                console.log('cmpnyNm ' + cmpnyNm + ' cnNmbr ' + cnNmbr + ' state ' + state + ' cmpnySts ' + cmpnySts);


                        		table_heading =  "<th>S.No.</th><th>Company/LLP name</th><th>CIN/FCRN/LLPIN/FLLPIN</th><th>State</th><th>Status</th>";
                                markup_two = "<tr><td>" + (i+ 1) + " </td><td class=companyname> " + result[i].cmpnyNm + " </td><td><u class=company-id>" + result[i].cnNmbr + "</u></td class=state><td> " + stateOne  + "</td><td class=statustype> " + result[i].cmpnySts + "</td></tr>";

                        	//	$("table.two-advsearchdata tbody").empty();
                               
                       		   if(dataCount==1 ){

                        	    $("table.two-advsearchdata tbody").empty();
                        	   $("table.two-advsearchdata tbody").append(table_heading);
                               $("table.two-advsearchdata tbody").append(markup_two);

                                }
                           else {

                           if(i==0){
                                $("table.two-advsearchdata tbody").empty();
                          $("table.two-advsearchdata tbody").append(table_heading);
                            }

						 $("table.two-advsearchdata tbody").append(markup_two);
                           }




                              }

                            if( dataCount == 0 ){
                                
                        		$("table.two-advsearchdata tbody").empty();

                        		markup_two = "<tr><td >" + "No Results Found" + "</td></tr>";

                                $("table.two-advsearchdata tbody").append(markup_two);

                    		}

                			console.log("<< SEARCH TYPE 2 >> ", dobj["data"]["searchType"]);

                        },
                        error: function(res) {
                            console.log("ERROR: " + resp.statusText);
                        }
                    });

            }

        });

    });

   $(function() {
        $('input[type="radio"]').click(function() {
           /* $('#dropdownItems2').empty();
            $('#dropdownItems1').empty(); 
            $('#dropdownMenuButton1').text("Selct ROC"); */
            var indianStatesJson;
            var foreignJson;

            if ($(this).is(':checked') && $(this).val() == 'india') {


                $("#dropdownMenuButton1").text("Select State");

                $.ajax({
                    url: "/bin/VPDGetStatesServlet?data="+encrypt("type=STATE_ABBREV"),
                    type: 'GET',
                    dataType: 'json',

                    success: function(resp) {
                        var states = resp.data;

                        $.each(states, function(i) {

                            $('#dropdownItems2').append('<a class="dropdown-item" href="#">' + states[i].state + '</a>');

                        });


                        $('#dropdownItems2 a').click(function(e) {
                            e.preventDefault();
                            $('#dropdownMenuButton1').text($(this).text());
                            $('.dropdown-menu').removeClass('show');

                        });
                    },
                    error: function(resp) {
                        console.log("ERROR: " + resp.statusText);
                    }
                });

            } else if ($(this).is(':checked') && $(this).val() == 'foreign') {
                var relation;
                $("#dropdownMenuButton2").text("Select Country");

                $.getJSON(foreignJson, function(data) {
                    $.each(data.data, function(i, field) {
                        $('#dropdownItems2').append('<a class="dropdown-item" style="color:#666666;font-size:14px;width:298px;height:40px;font-family: "Poppins", sans-serif;" href="#" rel=' + field.key + '>' + field.name + '</a>');
                    });
                    $('#dropdownItems2 a').click(function() {
                        $('#dropdownMenuButton2').text($(this).text());
                        $('#dropdownMenuButton2').removeClass('dropdown-toggle');
                        fillRoc($(this).attr("rel"));

                    });
                });
            }
        }); 
    }); 





});

function stateROC() {

    $('#dropdownItems1').empty();
    $.ajax({
        url: "/bin/VPDGetROCServlet?data="+encrypt("type=MCA_ROC_LIST"),
        type: 'GET',
        dataType: 'json',



        success: function(resp) {
            console.log(resp);
            var roc = resp.data;
            console.log(roc);
            $.each(roc, function(i) {

                $('#dropdownItems1').append('<a class="dropdown-item" href="#">' + roc[i].name + '</a>');

            });


            $('#dropdownItems1 a').click(function(e) {
                e.preventDefault();
                console.log("dropdown value clicked " + this.text);
                var rocDD = this.text;
                console.log("rocDD " + rocDD);



                $('#dropdownMenuButton').text(rocDD);
                $('.dropdown-menu').removeClass('show');

            });



        },
        error: function(resp) {
            //("ERROR: "+ resp.statusText);
            console.log("ERROR: " + resp.statusText);
        }
    });


    $('#dropdownItems2').empty();

    $.ajax({
        url:  "/bin/VPDGetStatesServlet?data="+encrypt("type=STATE_ABBREV"),
        type: 'GET',
        dataType: 'json',

        success: function(resp) {
            var states = resp.data;

            $.each(states, function(i) {

                $('#dropdownItems2').append('<a class="dropdown-item" href="#">' + states[i].state + '</a>');

            });


            $('#dropdownItems2 a').click(function(e) {
                e.preventDefault();
                $('#dropdownMenuButton1').text($(this).text());
                $('.dropdown-menu').removeClass('show');

            });
        },
        error: function(resp) {
            console.log("ERROR: " + resp.statusText);
        }
    });

}






