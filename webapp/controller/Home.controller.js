sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sapvim.controller.Home", {
            onInit: function () {
                var oData = {
                    "SelectedProduct": "USD",
                    "SelectedProduct2": "PO",
                    "SelectedProduct3": "PO123",
                    "SelectedProduct4": "Apollo Private Limited",
                    "ProductCollection": [
                        {
                            "cuurencyId": "USD",
                            "Name": "USD"
                        },
                        {
                            "cuurencyId": "INR",
                            "Name": "INR"
                        },
                        {
                            "cuurencyId": "AUD",
                            "Name": "AUD"
                        },
                        {
                            "cuurencyId": "CAD",
                            "Name": "CAD"
                        },
                        {
                            "cuurencyId": "EUR",
                            "Name": "EUR"
                        }
                    ],
                    "ProductCollection2": [
                        {
                            "cuurencyId": "PO",
                            "Name": "PO"
                        },
                        {
                            "cuurencyId": "Non-Po",
                            "Name": "Non-Po"
                        },
                    ],
                    "ProductCollection3": [
                        {
                            "PoNo": "PO123",
                            "Name": "PO123"
                        },
                        {
                            "PoNo": "PO1234",
                            "Name": "PO1234"
                        },
                        {
                            "PoNo": "PO12345",
                            "Name": "PO12345"
                        },
                    ],
                    "ProductCollection4": [
                        {
                            "PoNo": "Apollo Private Limited",
                            "Name": "Apollo Private Limited"
                        },
                        {
                            "PoNo": "Dr Reddy Labs",
                            "Name": "Dr Reddy Labs"
                        },
                        {
                            "PoNo": "Matrix Labs",
                            "Name": "Matrix Labs"
                        },
                    ],
                    "Editable": true,
                    "Enabled": true
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);


                var oVizFrame = this.oVizFrame = this.getView().byId("_IDGenVizFrame1");
                var oVizFrame1 = this.oVizFrame = this.getView().byId("_IDGendfVizFrame1");
                // var oVizFrame2 = this.oVizFrame = this.getView().byId("_IDGendfVizdfFrame1");
                var jsonData1 = [
                    { Month: 'Jan', Invoices: "454" },
                    { Month: 'Feb', Invoices: "512" },
                    { Month: 'Mar', Invoices: "156" },
                    { Month: 'Apr', Invoices: "56" },
                    { Month: 'May', Invoices: "562" },
                    { Month: 'Jun', Invoices: "566" },
                   ]
                var jsonModel = new JSONModel();
                jsonModel.setData(jsonData1);
                oVizFrame.setModel(jsonModel);
                oVizFrame1.setModel(jsonModel);
                // oVizFrame2.setModel(jsonModel);
            }
        });
    });
