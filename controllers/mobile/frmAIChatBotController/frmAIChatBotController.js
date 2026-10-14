define({
    chatHistory: [
        { 
            "role": "system", 
            "content": "You are a specialized assistant embedded in a mobile app. You are strictly restricted to answering questions related to Qatar (such as culture, geography, business, travel, history, laws, and local information). If a user asks a question about any topic completely unrelated to Qatar, politely decline to answer and remind them that you can only discuss Qatar-related topics. Keep answers concise and brief." 
        }
    ],

    onNavigate: function() {
        kony.print("--- ENTER onNavigate ---");
        var self = this;
        
        // Hide segment initially and show no chat history label/placeholder
        if (this.view.segChatHistory) {
            this.view.segChatHistory.isVisible = false;
            this.view.lblNoChatHistory.isVisible = true;
            this.view.segChatHistory.setData([]);
        }

        // 1. Send via Button Click
        if (this.view.btnSend) {
            this.view.btnSend.onClick = function() {
                self.sendMessageDirect();
            };
        }

        // 2. Send via Keyboard "Done" / "Enter" action
        if (this.view.txtMessageInput) {
            this.view.txtMessageInput.onDone = function() {
                self.sendMessageDirect();
            };
        }

        this.view.commonheader.configure({
            title: "Ask\\",
            action1: function () {
                new kony.mvc.Navigation("frmMyProfile").navigate();
            },
        });
        kony.print("--- EXIT onNavigate ---");
    },

    sendMessageDirect: function() {
        kony.print("--- ENTER sendMessageDirect ---");
        var rawUserText = this.view.txtMessageInput.text;
        if (!rawUserText || rawUserText.trim() === "") {
            kony.print("--- EXIT sendMessageDirect (Empty Input) ---");
            return;
        }

        var userText = rawUserText.replace(/[^\x20-\x7E]/g, "").trim();
        if (userText === "") userText = "Hello";

        this.chatHistory.push({ "role": "user", "content": userText });
        
        // User message with sknLblQNBSemibold16Px1b124b
        this.appendMessage("", userText, "sknLblQNBSemibold16Px1b124b");
        this.view.txtMessageInput.text = "";

        kony.application.showLoadingScreen(null, "Thinking...", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, {});

        var httpUrl = "https://api.groq.com/openai/v1/chat/completions";
        var apiKey = "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"; // Replace with your free Groq API key (gsk_...)

        var requestBody = {
            "model": "openai/gpt-oss-120b",
            "messages": this.chatHistory,
            "temperature": 0.7,
            "stream": false
        };

        var request = new kony.net.HttpRequest();
        request.open(constants.HTTP_METHOD_POST, httpUrl, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", "Bearer " + apiKey);

        request.onReadyStateChange = this.onReadyStateChangeHandler.bind(this, request);
        request.send(JSON.stringify(requestBody));
        kony.print("--- EXIT sendMessageDirect ---");
    },

    onReadyStateChangeHandler: function(request) {
        kony.print("--- ENTER onReadyStateChangeHandler --- [readyState: " + request.readyState + "]");

        if (request.readyState === 4) {
            kony.application.dismissLoadingScreen();
            kony.print("--- [DEBUG] Request Finished with Status: " + request.status + " ---");

            if (request.status === 200) {
                try {
                    kony.print("--- [DEBUG] Raw Response: " + request.responseText + " ---");
                    var response = JSON.parse(request.responseText);
                    var rawBotMessage = response.choices[0].message.content;
                    
                    var botMessage = rawBotMessage
                        .replace(/[^\x20-\x7E]/g, "")
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .trim();

                    this.chatHistory.push({ "role": "assistant", "content": botMessage });

                    kony.print("--- [DEBUG] Parsed Bot Message Length: " + botMessage.length + " ---");
                    
                    // AI message with sknLbl34Px50477D
                    this.appendMessage("", botMessage, "sknLbl34Px50477D");
                } catch (e) {
                    kony.print("--- [CHAT ERROR] JSON Parsing Failed: " + JSON.stringify(e) + " ---");
                    this.appendMessage("", "Error parsing response data.", "sknLbl34Px50477D");
                }
            } else {
                kony.print("--- [CHAT ERROR] HTTP Status Error: " + request.status + " Response: " + request.responseText + " ---");
                this.appendMessage("", "Failed to connect. Status: " + request.status, "sknLbl34Px50477D");
            }
        }
        kony.print("--- EXIT onReadyStateChangeHandler ---");
    },

    appendMessage: function(senderPrefix, messageText, labelSkin) {
        kony.print("--- ENTER appendMessage ---");
        
        var rawData = this.view.segChatHistory.data ? Array.from(this.view.segChatHistory.data) : [];
        
        var currentData = rawData.filter(function(row) {
            return row.lblCurrency && row.lblCurrency.text && row.lblCurrency.text.trim() !== "";
        });

        var formattedText = senderPrefix && senderPrefix !== "" ? senderPrefix + "  " + messageText : messageText;

        currentData.push({
            "template": "flxCurrencyList",
            "lblCurrency": { 
                "text": formattedText,
                "skin": labelSkin 
            }
        });
        
        if (this.view.segChatHistory) {
            this.view.lblNoChatHistory.isVisible = false;
            this.view.segChatHistory.isVisible = true;
            this.view.segChatHistory.setData(currentData);

            // AUTO-SCROLL TO LATEST ROW:
            var lastRowIndex = currentData.length - 1;
            if (lastRowIndex >= 0) {
                // Section 0, Index of the last item pushed
                this.view.segChatHistory.selectedRowIndex = [0, lastRowIndex];
            }
        }
        
        if (this.view.forceLayout) {
            this.view.forceLayout();
        }
        
        kony.print("--- EXIT appendMessage ---");
    }
});