'use strict';

app.elementDetailView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('elementDetailView');

// START_CUSTOM_CODE_elementDetailView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_elementDetailView
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('elementDetailViewModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('elementDetailViewModel_delayedFetch', paramFilter || null);
                return;
            }

            if (paramFilter) {
                model.set('paramFilter', paramFilter);
            } else {
                model.set('paramFilter', undefined);
            }

            if (paramFilter && searchFilter) {
                dataSource.filter({
                    logic: 'and',
                    filters: [paramFilter, searchFilter]
                });
            } else if (paramFilter || searchFilter) {
                dataSource.filter(paramFilter || searchFilter);
            } else {
                dataSource.filter({});
            }
        },

        jsdoOptions = {
            name: 'element2',
            autoFill: false
        },
        jsdoOptionsElementsType = {
            name: 'Element_Type',
            autoFill: false
        },
        jsdoOptionsForms = {
            name: 'Forms1',
            autoFill: false
        },
        jsdoOptionsSteps = {
            name: 'Steps',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},
            error: function(e) {
                app.mobileApp.pane.loader.hide();
                if (e.xhr) {
                    var errorText = "";
                    try {
                        errorText = JSON.stringify(e.xhr);
                    } catch (jsonErr) {
                        errorText = e.xhr.responseText || e.xhr.statusText || 'An error has occurred!';
                    }
                    alert(errorText);
                } else if (e.errorThrown) {
                    alert(e.errorThrown);
                }
            },
            schema: {
                model: {
                    fields: {
                        'name': {
                            field: 'name',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,

        },
        /// start data sources
        /// end data sources
        elementDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsElementsType: jsdoOptionsElementsType,
            _jsdoOptionsForms: jsdoOptionsForms,
            _jsdoOptionsSteps: jsdoOptionsSteps,
            marker: {},
            dataSourceSteps: '',
            stepsNames: [],
            searchChange: function(e) {
                var searchVal = e.target.value,
                    searchFilter;

                if (searchVal) {
                    searchFilter = {
                        field: 'name',
                        operator: 'contains',
                        value: searchVal
                    };
                }
                fetchFilteredData(elementDetailViewModel.get('paramFilter'), searchFilter);
            },
            fixHierarchicalData: function(data) {
                var result = {},
                    layout = {};

                $.extend(true, result, data);

                (function removeNulls(obj) {
                    var i, name,
                        names = Object.getOwnPropertyNames(obj);

                    for (i = 0; i < names.length; i++) {
                        name = names[i];

                        if (obj[name] === null) {
                            delete obj[name];
                        } else if ($.type(obj[name]) === 'object') {
                            removeNulls(obj[name]);
                        }
                    }
                })(result);

                (function fix(source, layout) {
                    var i, j, name, srcObj, ltObj, type,
                        names = Object.getOwnPropertyNames(layout);

                    if ($.type(source) !== 'object') {
                        return;
                    }

                    for (i = 0; i < names.length; i++) {
                        name = names[i];
                        srcObj = source[name];
                        ltObj = layout[name];
                        type = $.type(srcObj);

                        if (type === 'undefined' || type === 'null') {
                            source[name] = ltObj;
                        } else {
                            if (srcObj.length > 0) {
                                for (j = 0; j < srcObj.length; j++) {
                                    fix(srcObj[j], ltObj[0]);
                                }
                            } else {
                                fix(srcObj, ltObj);
                            }
                        }
                    }
                })(result, layout);

                return result;
            },
            itemClick: function(e) {
                var dataItem = e.dataItem || elementDetailViewModel.originalItem;

                app.mobileApp.navigate('#components/elementDetailView/details.html?uid=' + dataItem.uid);

            },
            elementStepClick: function(id) {
                app.mobileApp.navigate('#components/elementDetailView/stepFormList.html?stepid=' + id);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = elementDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                elementDetailViewModel.setCurrentItemByUid(uid);

                /// start detail form show
                document.getElementById("defaultOpen").click();
                /// end detail form show
            },
            openQC1: function () {
                var step1 = elementDetailViewModel.currentItem.Step1,
                     step2 = elementDetailViewModel.currentItem.Step2,
                     step3 = elementDetailViewModel.currentItem.Step3,
                     step4 = elementDetailViewModel.currentItem.Step4, 
                     step5 = elementDetailViewModel.currentItem.Step5, 
                     step6 = elementDetailViewModel.currentItem.Step6;

                var stepsNames = [];

                var jsdoOptionsSteps = elementDetailViewModel.get('_jsdoOptionsSteps'),
                        jsdoSteps = new progress.data.JSDO(jsdoOptionsSteps);

                dataSourceOptions.transport.jsdo = jsdoSteps;
                var dataSourceSteps = new kendo.data.DataSource(dataSourceOptions);

                dataSourceSteps.fetch(function() {
                    var steps = dataSourceSteps.data();

                    for(var i=0; i<steps.length; i++) {
                        if(step1 != 0) {
                            if(steps[i].stageNum == 1) {
                                stepsNames[stepsNames.length] = { name: steps[i].name };
                            }
                        }
                        if(step2 != 0) {
                            if(steps[i].stageNum == 2) {
                                stepsNames[stepsNames.length] = { name: steps[i].name };
                            }
                        }
                        if(step3 != 0) {
                            if(steps[i].stageNum == 3) {
                                stepsNames[stepsNames.length] = { name: steps[i].name };
                            }
                        }
                        if(step4 != 0) {
                            if(steps[i].stageNum == 4) {
                                stepsNames[stepsNames.length] = { name: steps[i].name };
                            }
                        }
                        if(step5 != 0) {
                            if(steps[i].stageNum == 5) {
                                stepsNames[stepsNames.length] = { name: steps[i].name };
                            }
                        }
                        if(step6 != 0) {
                            if(steps[i].stageNum == 6) {
                                stepsNames[stepsNames.length] = { name: steps[i].name };
                            }
                        }
                    }

                    console.log("stepsNames")
                    console.log(stepsNames)

                        var templateContent = $("#elementStepsTemplate").html();
                        var template = kendo.template(templateContent);

                        var result = kendo.render(template, stepsNames); //render the template

                        $("#elementSteps").html(result); //append the result to the page
                });

            },
            stepFormsListShow: function(e) {
                var id = e.view.params.stepid;
                var step_id = id.substr(0, id.lastIndexOf(")"));

                var formsNames = [], tmp, tmp_id;
                var templateContent, template, result;

                templateContent = $("#formStageTemplate").html();
                template = kendo.template(templateContent);
                console.log("elementDetailViewModel.currentItem")
                console.log(elementDetailViewModel.currentItem)
                switch(step_id) {
                    case "1":
                        formsNames = elementDetailViewModel.currentItem.FormsStep1;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length-1; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "2": 
                        formsNames = elementDetailViewModel.currentItem.FormsStep2;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length-1; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "3": formsNames = elementDetailViewModel.currentItem.FormsStep3;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length-1; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "4": formsNames = elementDetailViewModel.currentItem.FormsStep4;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length-1; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "5": formsNames = elementDetailViewModel.currentItem.FormsStep5;
                            console.log("formsNames1")
                            console.log(formsNames)
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            console.log("tmp")
                            console.log(tmp)
                            formsNames = [];
                            for(var i=0; i<tmp.length-1; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                                console.log("formsNames[i]")
                                console.log(formsNames[i])
                            }
                            console.log("formsNames2")
                            console.log(formsNames)
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "6": formsNames = elementDetailViewModel.currentItem.FormsStep6;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length-1; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                }
                /*if(step_id == "0") {
                    $("#stage1Forms").hide();
                     $("#stage2Forms").hide();
                     $("#stage3Forms").hide();
                     $("#stage4Forms").hide();
                     $("#stage5Forms").hide();
                     $("#stage6Forms").hide();

                     app.mobileApp.navigate('#components/surveyorMarking/edit.html?id=' + step_id);
                }
                else if(step_id == "1") {
                     $("#stage1Forms").show();
                     $("#stage2Forms").hide();
                     $("#stage3Forms").hide();
                     $("#stage4Forms").hide();
                     $("#stage5Forms").hide();
                     $("#stage6Forms").hide();
                }
                else if(step_id == "2") { 
                    $("#stage1Forms").hide();
                     $("#stage2Forms").show();
                     $("#stage3Forms").hide();
                     $("#stage4Forms").hide();
                     $("#stage5Forms").hide();
                     $("#stage6Forms").hide(); 
                }
                else if(step_id == "3") { 
                    $("#stage1Forms").hide();
                     $("#stage2Forms").hide();
                     $("#stage3Forms").show();
                     $("#stage4Forms").hide();
                     $("#stage5Forms").hide();
                     $("#stage6Forms").hide(); 
                }
                else if(step_id == "4") { 
                    $("#stage1Forms").hide();
                     $("#stage2Forms").hide();
                     $("#stage3Forms").hide();
                     $("#stage4Forms").show();
                     $("#stage5Forms").hide();
                     $("#stage6Forms").hide(); 
                }
                else if(step_id == "5") { 
                    $("#stage1Forms").hide();
                     $("#stage2Forms").hide();
                     $("#stage3Forms").hide();
                     $("#stage4Forms").hide();
                     $("#stage5Forms").show();
                     $("#stage6Forms").hide(); 
                }
                else if(step_id == "6") { 
                    $("#stage1Forms").hide();
                     $("#stage2Forms").hide();
                     $("#stage3Forms").hide();
                     $("#stage4Forms").hide();
                     $("#stage5Forms").hide();
                     $("#stage6Forms").show(); 
                }*/
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = elementDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                elementDetailViewModel.set('originalItem', itemModel);
                elementDetailViewModel.set('currentItem',
                    elementDetailViewModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            openFormStage: function(id) {
                alert(id)
                switch(id) {
                    case "surveyor_Marking": 
                        app.mobileApp.navigate('#components/surveyorMarking/edit.html?elementUid=' + this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "GENERAL_ADJUSTEMENT": 
                        app.mobileApp.navigate('#components/generalAdjustement2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "E&B": 
                        app.mobileApp.navigate('#components/eandB2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "DROPPERS":
                        app.mobileApp.navigate('#components/droppers2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CONTACT_WIRE_LAYING":
                        app.mobileApp.navigate('#components/contactWireLaying2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "MESSENGER_WIRE_LAYING":
                        app.mobileApp.navigate('#components/messengerWireLaying2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_LAYING_2":
                        app.mobileApp.navigate('#components/returnWireLaying22/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_LAYING_1":
                         app.mobileApp.navigate('#components/returnWireLaying12/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "Tie-Rods": 
                    case "Clamps'_Insulators":
                    case "Cross-Bars_and":
                        app.mobileApp.navigate('#components/tieRoadsClampsInsulatorsCrossBarAndMipd2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANTILEVER_INSTALLATION":
                        app.mobileApp.navigate('#components/cantileverInstallation2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANTILEVERS_MANUFACTURE":
                        app.mobileApp.navigate('#components/cantileverManufacture2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "COUNTERW_WEIGHT":
                        app.mobileApp.navigate('#components/counterwWeight2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "COUNTERW_PULLEY":
                         app.mobileApp.navigate('#components/counterwPulley2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_2_&SUPPORT&connection": 
                         app.mobileApp.navigate('#components/returnWire2AndSupportAndConnection2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANTILEVER_SUPPORT_&_counterweights":
                        app.mobileApp.navigate('#components/cantileverSupportAndCounterWeight2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "PORTAL":
                        app.mobileApp.navigate('#components/portal2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "POLE":
                        app.mobileApp.navigate('#components/pole2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "POLE_SUPPORT_DRILLING_(IF)+TRANS_PLATES":
                        app.mobileApp.navigate('#components/poleSupportDrillingIfTransPlatesForm22/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_2_DRILLING":
                        app.mobileApp.navigate('#components/returnWire2Driliing2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANT/COUNTERW_/ANCHORS_DRILLING":
                         app.mobileApp.navigate('#components/cantCounterwAnchorsDrilling2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "EXCAVATION":
                        app.mobileApp.navigate('#components/excavation2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "REINFORCEMENT":
                        app.mobileApp.navigate('#components/reinforcement2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CONCRETING": 
                        app.mobileApp.navigate('#components/concreting2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                }
            },
            /*openFormStage1: function(id) {
                switch(id) {
                    case "form1": //app.mobileApp.navigate('#components/poleSupportDrillingIfTransPlatesForm/view.html?elementUid='+this.currentItem.uid);//uid??
                                //app.mobileApp.navigate('#components/poleSupportDrillingIfTransPlatesForm2/view.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                app.mobileApp.navigate('#components/poleSupportDrillingIfTransPlatesForm22/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form2": app.mobileApp.navigate('#components/cantCounterwAnchorsDrilling2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form3": //app.mobileApp.navigate('#components/returnWire2Drilling/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/returnWire2Driliing2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form4": //app.mobileApp.navigate('#components/concreting/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/concreting2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form5": //app.mobileApp.navigate('#components/reinforcement/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/reinforcement2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form6": //app.mobileApp.navigate('#components/excavation/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/excavation2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                }
            },*/
            /*openFormStage2: function(id) {
                switch(id) {
                    case "form1": //app.mobileApp.navigate('#components/cantileverSupportAndCounterWeights/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/cantileverSupportAndCounterWeight2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form2": //app.mobileApp.navigate('#components/portal/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/portal2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form3": //app.mobileApp.navigate('#components/pole/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/pole2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form4": //app.mobileApp.navigate('#components/returnWire2AndSupportAndConnection/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/returnWire2AndSupportAndConnection2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                }
            },*/
            /*openFormStage3: function(id) {
                switch(id) {
                    case "form1": //app.mobileApp.navigate('#components/cantileverInstallation/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/cantileverInstallation2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form2": //app.mobileApp.navigate('#components/cantileversManufacture/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/cantileverManufacture2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form3": //app.mobileApp.navigate('#components/counterwWeight/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/counterwWeight2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form4": //app.mobileApp.navigate('#components/couterwPulley/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/counterwPulley2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                }
            },*/
            /*openFormStage4: function(id) {
                switch(id) {
                    case "form1": //app.mobileApp.navigate('#components/contactWireLaying/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/contactWireLaying2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form2": //app.mobileApp.navigate('#components/droppers/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/droppers2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form3": //app.mobileApp.navigate('#components/messengerWireLaying/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/messengerWireLaying2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form4": //app.mobileApp.navigate('#components/returnWireLaying1/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/returnWireLaying12/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form5": //app.mobileApp.navigate('#components/returnWireLaying2/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/returnWireLaying22/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                    case "form6": //app.mobileApp.navigate('#components/tieRodsClampsInsulatorsCrossBarsAndMidp/view.html?id=' + id);//uid??
                                app.mobileApp.navigate('#components/tieRoadsClampsInsulatorsCrossBarAndMipd2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                                break;
                }
            },*/
            /*openFormStage5: function(id) {
                 //app.mobileApp.navigate('#components/eandB/view.html?id=' + id);//uid??
                 app.mobileApp.navigate('#components/eandB2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
            },*/
            /*openFormStage6: function(id) {
                //app.mobileApp.navigate('#components/generalAdjustement/view.html?id=' + id);//uid??
                app.mobileApp.navigate('#components/generalAdjustement2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
            },*/
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('elementDetailViewModel', elementDetailViewModel);
            var param = parent.get('elementDetailViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('elementDetailViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('elementDetailViewModel', elementDetailViewModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            //stepName = e.view.params.stageName,
            stepId = parseInt(e.view.params.stageId),
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = elementDetailViewModel.get('_dataSourceOptions'),
            dataSource;

        if (param || isListmenu) {
            backbutton.show();
            backbutton.css('visibility', 'visible');
        } else {
            if (e.view.element.find('header [data-role="navbar"] [data-role="button"]').length) {
                backbutton.hide();
            } else {
                backbutton.css('visibility', 'hidden');
            }
        }

        if (!elementDetailViewModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = elementDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);

                //console.log("stepId:" + stepId)
                //R363890883
                //dataSource.filter({ field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") });
                dataSource.filter({ field: "R363890883", operator: "==", value: stepId });
                /*dataSource.filter({
                    logic: "and",
                    filters: [
                        {field: "R363890883", operator: "==", value: stepId},
                        {field: "locationId", operator: "==", value: sessionStorage.getItem("locationId")}
                        ]
                });*/            
               
                elementDetailViewModel.set('dataSource', dataSource);
                
                //fetchFilteredData(param);
            });
        } else {
            var dataSource = elementDetailViewModel.get('dataSource');
             dataSource.filter({ field: "R363890883", operator: "==", value: stepId });
             /*dataSource.filter({
                    logic: "and",
                    filters: [
                        {field: "R363890883", operator: "==", value: stepId},
                        {field: "locationId", operator: "==", value: sessionStorage.getItem("locationId")}
                        ]
                });*/ 
                
                elementDetailViewModel.set('dataSource', dataSource);
            //fetchFilteredData(param);
        }

    });

})(app.elementDetailView);

// START_CUSTOM_CODE_elementDetailViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.elementDetailView.elementDetailViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.elementDetailView.elementDetailViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_elementDetailViewModel