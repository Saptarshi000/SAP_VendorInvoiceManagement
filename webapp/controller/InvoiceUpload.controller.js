sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sapvim.controller.InvoiceUpload", {
            onInit: function () {

            },
            handleFileChange: function (oEvent) {
                
                this.selectedFile = oEvent.getParameters().files[0];
                var fileUploaderObj = this.byId("invDoc");
                var fileName = fileUploaderObj.getValue();

                var fileNameTextObj = this.byId("selectedFileText");
                fileNameTextObj.setText(fileName);

                this.getView().byId("_IDGenPDFViewer").setSource(URL.createObjectURL(this.selectedFile));

                if (!fileName) {
                    MessageBox.warning("No File Selected");
                }
            }, 
            openPDF: function () {
                this.byId("_IDGenPDFViewer").downloadPDF();
            },
            handleFileChangeESign: function (oEvent) {
                
                this.selectedFile = oEvent.getParameters().files[0];
                var fileUploaderObj = this.byId("eSign");
                var fileName = fileUploaderObj.getValue();

                var fileNameTextObj = this.byId("selectedFileTextESign");
                fileNameTextObj.setText(fileName);

                this.getView().byId("_IDGenPDFViewerESign").setSource(URL.createObjectURL(this.selectedFile));

                if (!fileName) {
                    MessageBox.warning("No File Selected");
                }
            }, 
            openPDFeSign: function () {
                this.byId("_IDGenPDFViewerESign").downloadPDF();
            },
        });
    });
