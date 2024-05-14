sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("sapvim.controller.MyInvoice", {
            onInit: function () {
                let key = "S"
                
                this.getInvStatus(key) 
            },
            getInvStatus: function (key) {
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

                        // console.log()
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },
            onclickSubmitted: function () {
                let key = "S"
                this.getInvStatus(key)
            },
            onclickverified: function () {
                let key = "V"
                this.getInvStatus(key)
            },
            onclickblocked: function () { 
                let key = "B"
                this.getInvStatus(key)
            },
            onclickcleared: function () { 
                let key = "C"
                this.getInvStatus(key)
            },
            onFilterInvoice: function(){
                var aFilter = [];
                var sQuery = this.byId("RefN").getValue()
                var dQuery = this.byId("invDate").getValue()
                
                if(sQuery){
                    aFilter.push( new Filter("portal_ref", FilterOperator.Contains, sQuery));
                }
                else{
                    aFilter.push( new Filter("inv_date", FilterOperator.Contains, dQuery));
                }
                
                // Filter Binding
                var oList = this.byId("tableObj");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);

                // Reset Filters
                this.byId("invDate").setDateValue(null)
                this.byId("RefN").setValue(null)
            }
        });
    });
