
define(["Navigation"], function (Navigation) {
    return {
        selectedFile: null,
        nativePickerListener: null,
        pickerRequestCode: 7821,

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            this.view.onDeviceBack = this.backNavigation;
        },

        init: function () {
            kony.print("ATTACH PROOF :: INIT");
        },

        preShow: function () {
            var scope = this;
            if (this.view.flxAttchProof) {
                this.view.flxAttchProof.onClick = function () {
                    scope.launchFileBrowser();
                };
            }
        },

        postShow: function () {
            this.updateAttachmentUI();
        },

        onHide: function () {
            kony.print("ATTACH PROOF :: ON HIDE");
        },

        backNavigation: function () {
            var prevForm = kony.application.getPreviousForm();
            if (prevForm) {
                new kony.mvc.Navigation(prevForm).navigate();
            }
        },

        ensureNativePickerListener: function () {
            var scope = this;
            if (this.nativePickerListener) {
                return true;
            }

            try {
                var KonyMain = java.import("com.konylabs.android.KonyMain");
                var Listener = java.newClass(
                    "QNBAttachProofPickerListener",
                    "com.konylabs.ffi.KonyActivityLifeCycleListener",
                    [],
                    {
                        onActivityResult: function (requestCode, resultCode, data) {
                            if (requestCode != scope.pickerRequestCode) {
                                return;
                            }
                            scope.handlePickerResult(resultCode, data);
                        }
                    }
                );

                this.nativePickerListener = new Listener();
                KonyMain.addActivityLifeCycleListener(this.nativePickerListener);
                kony.print("ATTACH PROOF :: Native result listener registered");
                return true;
            } catch (err) {
                kony.print("ATTACH PROOF :: LISTENER ERROR :: " + err);
                this.showMessage(
                    "Unable to initialize the native PDF picker.",
                    "Attachment Error"
                );
                return false;
            }
        },

        launchFileBrowser: function () {
            try {
                kony.print("ATTACH PROOF :: Opening Android PDF picker");

                if (!this.ensureNativePickerListener()) {
                    return;
                }

                var KonyMain = java.import("com.konylabs.android.KonyMain");
                var Intent = java.import("android.content.Intent");
                var context = KonyMain.getActivityContext();

                var intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/pdf");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

                context.startActivityForResult(intent, this.pickerRequestCode);
            } catch (err) {
                kony.print("ATTACH PROOF :: PICKER ERROR :: " + err);
                this.showMessage(
                    "Unable to open the document picker. Please try again.",
                    "Attachment Error"
                );
            }
        },

        handlePickerResult: function (resultCode, data) {
            try {
                var Activity = java.import("android.app.Activity");

                if (resultCode != Activity.RESULT_OK || !data) {
                    kony.print("ATTACH PROOF :: Picker cancelled");
                    return;
                }

                var uri = data.getData();
                if (!uri) {
                    kony.print("ATTACH PROOF :: No document URI returned");
                    this.showMessage(
                        "The selected document could not be accessed.",
                        "Attachment Error"
                    );
                    return;
                }

                var KonyMain = java.import("com.konylabs.android.KonyMain");
                var OpenableColumns = java.import("android.provider.OpenableColumns");
                var context = KonyMain.getActivityContext();
                var resolver = context.getContentResolver();
                var fileName = "";
                var fileType = resolver.getType(uri);

                try {
                    var projection = java.newArray(
                        "java.lang.String",
                        [OpenableColumns.DISPLAY_NAME]
                    );
                    var cursor = resolver.query(
                        uri,
                        projection,
                        null,
                        null,
                        null
                    );

                    if (cursor) {
                        try {
                            if (cursor.moveToFirst()) {
                                var nameIndex = cursor.getColumnIndex(
                                    OpenableColumns.DISPLAY_NAME
                                );
                                if (nameIndex >= 0) {
                                    fileName = String(cursor.getString(nameIndex));
                                }
                            }
                        } finally {
                            cursor.close();
                        }
                    }
                } catch (queryErr) {
                    kony.print("ATTACH PROOF :: FILENAME QUERY ERROR :: " + queryErr);
                }

                if (!fileName) {
                    fileName = String(uri.getLastPathSegment() || "");
                }

                if (!/\.pdf$/i.test(fileName) &&
                    fileType !== "application/pdf") {
                    this.showMessage(
                        "Please select a PDF file.",
                        "Invalid File"
                    );
                    return;
                }

                try {
                    resolver.takePersistableUriPermission(
                        uri,
                        IntentFlagsReadPermission()
                    );
                } catch (permissionErr) {
                    kony.print(
                        "ATTACH PROOF :: Persistable URI grant unavailable :: " +
                        permissionErr
                    );
                }

                this.onFileSelected(
                    fileName,
                    String(uri.toString()),
                    fileType || "application/pdf"
                );
            } catch (err) {
                kony.print("ATTACH PROOF :: RESULT ERROR :: " + err);
                this.showMessage(
                    "Unable to read the selected PDF.",
                    "Attachment Error"
                );
            }

            function IntentFlagsReadPermission() {
                var Intent = java.import("android.content.Intent");
                return Intent.FLAG_GRANT_READ_URI_PERMISSION;
            }
        },

        onFileSelected: function (fileName, fileUri, fileType) {
            if (!fileName || !fileUri) {
                kony.print("ATTACH PROOF :: Invalid file result");
                return;
            }

            if (!/\.pdf$/i.test(fileName) &&
                fileType !== "application/pdf") {
                this.showMessage("Please select a PDF file.", "Invalid File");
                return;
            }

            this.selectedFile = {
                fileName: fileName,
                fileUri: fileUri,
                fileType: fileType || "application/pdf"
            };

            this.updateAttachmentUI();
            kony.print("ATTACH PROOF :: SELECTED :: " + fileName);
            kony.print("ATTACH PROOF :: URI :: " + fileUri);
        },

        updateAttachmentUI: function () {
            if (!this.view.lblAttachProof) {
                return;
            }

            this.view.lblAttachProof.text =
                this.selectedFile && this.selectedFile.fileName
                    ? this.selectedFile.fileName
                    : "Attach PDF Proof";
        },

        showMessage: function (message, title) {
            kony.ui.Alert({
                message: message,
                alertType: constants.ALERT_TYPE_INFO,
                alertTitle: title || "Attachment",
                yesLabel: "OK"
            }, {});
        }
    };
});