sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, BusyIndicator, UIComponent) {
        "use strict";
        var selectedTable = "";

        return Controller.extend("sapvim.controller.MyInvoice", {
            onInit: function () {
                // let key = "S"

                // if(localStorage.getItem("userData")){
                //     let data = JSON.parse( localStorage.getItem("userData") ) 
                //     // console.log(data.Username)
                //     this.byId('vendNo').setText(data.Username);
                // }else{
                //     var routerObj = this.getOwnerComponent().getRouter();
                //     routerObj.navTo("Screen7");
                // }
                
                // this.getInvStatus(key)
                
                // this.getCountDatas(this.byId("vendNo").getText())
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.attachRouteMatched(this.setDataonUI, this);
            },
            setDataonUI: function(){
                if(localStorage.getItem("userData")){
                    let data = JSON.parse( localStorage.getItem("userData") ) 
                    // console.log(data.Username)
                    this.byId('vendNo').setText(data.Username);
                }else{
                    var routerObj = this.getOwnerComponent().getRouter();
                    routerObj.navTo("Screen7");
                }
                
                // this.getInvStatus(key)
                this.onclickSubmitted()
                
                this.getCountDatas(this.byId("vendNo").getText())
            },
            getCountDatas: function (venId) {
                BusyIndicator.show();
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                // console.log(venId);
                console.log(oModel)

                oModel.setUseBatch(false);

                oModel.read(`/po_totSet('${venId}')`, {
                    success: function (oData) {
                        console.log("countData",oData);
                        oData["blocked"] = oData["blocked"].replaceAll(" ", "");
                        oData["cleared"] = oData["cleared"].replaceAll(" ", "");
                        oData["submited"] = oData["submited"].replaceAll(" ", "");
                        oData["verified"] = oData["verified"].replaceAll(" ", "");
                        console.log(oData);
                        var jModel = new JSONModel(oData);
                        // console.log(jModel);
                        that.getView().setModel(jModel, "countData")

                        setTimeout(() => {
                            BusyIndicator.hide();
                          }, 2000);
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },
            getInvStatus: function (key) {
                BusyIndicator.show();
                var that = this;
                var venId = that.byId("vendNo").getText();
                
                this.byId("invDate").setDateValue(null)
                this.byId("RefN").setValue(null)

                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

               

                oModel.read(`/po_headerSet(VenderNo='${venId}',PoNo='',key='${key}')`, {
                    urlParameters: {
                        "$expand": "po_inv_statusSet",
                    },
                    success: function (oData) {
                        console.log("Inv Status")
                        console.log(oData);
                       
                        var jModel = new JSONModel(oData.po_inv_statusSet);
                        // // console.log(jModel)
                        that.getView().setModel(jModel, "invStatus");

                        setTimeout(() => {
                            BusyIndicator.hide();
                          }, 2000);
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },



            onclickSubmitted: function () {
                // let key = "S"
                this.selectedTable = "S";
                this.byId("tableObjSubmitted").setVisible(true)
                this.byId("tableObjVerified").setVisible(false)
                this.byId("tableObjBlocked").setVisible(false)
                this.byId("tableObjPayments").setVisible(false)

                this.getInvStatus(this.selectedTable)
            },
            onclickverified: function () {
                // let key = "V"
                this.selectedTable = "V";
                this.byId("tableObjSubmitted").setVisible(false)
                this.byId("tableObjVerified").setVisible(true)
                this.byId("tableObjBlocked").setVisible(false)
                this.byId("tableObjPayments").setVisible(false)

                this.getInvStatus(this.selectedTable)
            },
            onclickblocked: function () { 
                // let key = "B"
                this.selectedTable = "B";
                this.byId("tableObjSubmitted").setVisible(false)
                this.byId("tableObjVerified").setVisible(false)
                this.byId("tableObjBlocked").setVisible(true)
                this.byId("tableObjPayments").setVisible(false)

                this.getInvStatus(this.selectedTable)
            },
            onclickcleared: function () { 
                // let key = "C"
                this.selectedTable = "C";
                this.byId("tableObjSubmitted").setVisible(false)
                this.byId("tableObjVerified").setVisible(false)
                this.byId("tableObjBlocked").setVisible(false)
                this.byId("tableObjPayments").setVisible(true)

                this.getInvStatus(this.selectedTable)
            },
            onFilterInvoice: function(){
                var aFilter = [];
                var sQuery = this.byId("RefN").getValue()
                var dQuery = this.byId("invDate").getValue()
                var oList ;
                
                if(sQuery){
                    aFilter.push( new Filter("portal_ref", FilterOperator.Contains, sQuery));
                }
                else{
                    aFilter.push( new Filter("inv_date", FilterOperator.Contains, dQuery));
                }

                if(this.selectedTable == "S"){
                    oList = this.byId("tableObjSubmitted");
                }else if(this.selectedTable == "V"){
                    oList = this.byId("tableObjVerified");
                }else if(this.selectedTable == "B"){
                    oList = this.byId("tableObjBlocked");
                }else if(this.selectedTable == "C"){
                    oList = this.byId("tableObjPayments");
                }
                
                // Filter Binding
                // var oList = this.byId("tableObj");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);

                // Reset Filters
                this.byId("invDate").setDateValue(null)
                this.byId("RefN").setValue(null)
            }
        });
    });