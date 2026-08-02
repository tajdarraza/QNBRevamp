/*
#
#  Created by Team Kony.
#  Copyright (c) 2017 Kony Inc. All rights reserved.
#
*/

define(function() {
  return {
    /**
		 * @constructor constructor
		 * @param basicConfig
		 * @param layoutConfig
		 * @param pspConfig
		*/
    constructor: function(baseConfig, layoutConfig, pspConfig) { 
      try{
        this.lastOption = 1;
        this.screenHeight = kony.os.deviceInfo().screenHeight;
        this.screenWidth = kony.os.deviceInfo().screenWidth;
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @initGettersSetters Logic for getters/setters of custom properties
		*/
    initGettersSetters: function() {
      try{
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function actionSheetPreshow
		 * @scope private
		 * @description this function is invoked each time the action sheet gets loaded.
		*/
    actionSheetPreshow : function(){
      try{
        this.view.isVisible = false;
        this.view.onClick = this.dismiss;
        this.view.forceLayout();
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function show
		 * @scope private
		 * @description this function is invoked to change the visibility of action sheet to true.
		*/
    show : function(){
      try{
        kony.print("inside show");
        this.setDataToActionSheet();
        //         this.lastOption = 1;
        //         if(this.headerMainText === null || this.headerMainText === ""){
        //           this.view.lblTitleText.isVisible = false;
        //           this.view.lblDescriptionText.isVisible = false;
        //           this.view.lblHeaderUnderline.isVisible = false;
        //         }
        //         else{
        //           this.view.lblTitleText.isVisible = true;
        //           this.view.lblHeaderUnderline.isVisible = true;
        //           if(this.headerSubText === null || this.headerSubText === ""){
        //             this.view.lblDescriptionText.isVisible = false;
        //           }
        //           else{
        //             this.view.lblDescriptionText.isVisible = true;
        //           }
        //         }
        //         if(this.option1Text === null || this.option1Text === ""){
        //           this.view.btnOption1.isVisible = false;
        //           this.view.lblUnderline2.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption1.isVisible = true;
        //           this.view.lblUnderline2.isVisible = true;
        //         }
        //         if(this.option2Text === null || this.option2Text === ""){
        //           this.view.btnOption2.isVisible = false;
        //           this.view.lblUnderline3.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption2.isVisible = true;
        //           this.view.lblUnderline3.isVisible = true;
        //           this.lastOption = 2;
        //         }
        //         if(this.option3Text === null || this.option3Text === ""){
        //           this.view.btnOption3.isVisible = false;
        //           this.view.lblUnderline4.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption3.isVisible = true;
        //           this.view.lblUnderline4.isVisible = true;
        //           this.lastOption = 3;
        //         }
        //         if(this.option4Text === null || this.option4Text === ""){
        //           this.view.btnOption4.isVisible = false;
        //           this.view.lblUnderline5.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption4.isVisible = true;
        //           this.view.lblUnderline5.isVisible = true;
        //           this.lastOption = 4;
        //         }
        //         if(this.option5Text === null || this.option5Text === ""){
        //           this.view.btnOption5.isVisible = false;
        //           this.view.lblUnderline6.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption5.isVisible = true;
        //           this.view.lblUnderline6.isVisible = true;
        //           this.lastOption = 5;
        //         }
        //         if(this.option6Text === null || this.option6Text === ""){
        //           this.view.btnOption6.isVisible = false;
        //           this.view.lblUnderline7.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption6.isVisible = true;
        //           this.view.lblUnderline7.isVisible = true;
        //           this.lastOption = 6;
        //         }
        //         if(this.option7Text === null || this.option7Text === ""){
        //           this.view.btnOption7.isVisible = false;
        //           this.view.lblUnderline8.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption7.isVisible = true;
        //           this.view.lblUnderline8.isVisible = true;
        //           this.lastOption = 7;
        //         }
        //         if(this.option8Text === null || this.option8Text === ""){
        //           this.view.btnOption8.isVisible = false;
        //         }
        //         else{
        //           this.view.btnOption8.isVisible = true;
        //           this.lastOption = 8;
        //         }
        //         if(this.lastOption !== 8){
        //           this.view["lblUnderline"+(this.lastOption+1)].isVisible = false;
        //         }
        this.view.centerX = "50%";
        this.view.centerY = "50%";
        this.view.height = "100%";
        this.view.width = "100%";
        this.view.flxActionSheetContent.bottom = "-100%";
        this.view.isVisible = true;
        var bottomToSet = (this.screenWidth/this.screenHeight) * 5;
        this.view.flxActionSheetContent.animate(
          kony.ui.createAnimation({
            "100": {
              "bottom": bottomToSet+"%",
              "stepConfig": {
                "timingFunction": kony.anim.EASE
              }
            }
          }), {
            "delay": 0,
            "iterationCount": 1,
            "fillMode": kony.anim.FILL_MODE_FORWARDS,
            "duration": 0.5
          }, { }
        );
        this.view.forceLayout();
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function dismiss
		 * @scope private
		 * @description this function is invoked to change the visibility of action sheet to false.
		*/
    dismiss : function(){
      try{
        this.view.flxActionSheetContent.animate(
          kony.ui.createAnimation({
            "100": {
              "bottom":"-100%",
              "stepConfig": {
                "timingFunction": kony.anim.EASE
              }
            }
          }), {
            "delay": 0,
            "iterationCount": 1,
            "fillMode": kony.anim.FILL_MODE_FORWARDS,
            "duration": 0.4
          }, {
            animationEnd : function(){
              this.view.isVisible = false;
            }.bind(this)
          }
        );
        this.view.forceLayout();
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option1Clicked
		 * @scope private
		 * @description this function is invoked when the first option of action sheeet is clicked.
		*/
    option1Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption1 !== undefined && this.onClickOption1 !== null){
          this.onClickOption1();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option2Clicked
		 * @scope private
		 * @description this function is invoked when the second option of action sheeet is clicked.
		*/
    option2Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption2 !== undefined && this.onClickOption2 !== null){
          this.onClickOption2();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option3Clicked
		 * @scope private
		 * @description this function is invoked when the third option of action sheeet is clicked.
		*/
    option3Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption3 !== undefined && this.onClickOption3 !== null){
          this.onClickOption3();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option4Clicked
		 * @scope private
		 * @description this function is invoked when the fourth option of action sheeet is clicked.
		*/
    option4Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption4 !== undefined && this.onClickOption4 !== null){
          this.onClickOption4();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option5Clicked
		 * @scope private
		 * @description this function is invoked when the fifth option of action sheeet is clicked.
		*/
    option5Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption5 !== undefined && this.onClickOption5 !== null){
          this.onClickOption5();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option6Clicked
		 * @scope private
		 * @description this function is invoked when the sixth option of action sheeet is clicked.
		*/
    option6Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption6 !== undefined && this.onClickOption6 !== null){
          this.onClickOption6();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option7Clicked
		 * @scope private
		 * @description this function is invoked when the seventh option of action sheeet is clicked.
		*/
    option7Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption7 !== undefined && this.onClickOption7 !== null){
          this.onClickOption7();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function option8Clicked
		 * @scope private
		 * @description this function is invoked when the eighth option of action sheeet is clicked.
		*/
    option8Clicked : function(){
      try{
        this.dismiss();
        if(this.onClickOption8 !== undefined && this.onClickOption8 !== null){
          this.onClickOption8();
        }
      }
      catch(e){
        throw e;
      }
    },

    /**
		 * @function onCloseClick
		 * @scope private
		 * @description this function is invoked when the close of action sheeet is clicked.
		*/
    onCloseClick : function(){
      try{
        this.dismiss();
        if(this.onClose !== undefined && this.onClose !== null){
          this.onClose();
        }
      }
      catch(e){
        throw e;
      }
    },

    clear: function(){
      try{
//         for(var i=1; i<=8; i++){
//           this.view["btnOption"+i].text = "";
//         }
      }catch(e){
        kony.print("Error in clear-->"+e);
      }
    },

    setDataToActionSheet: function(){
      try{
        var data = dataToSet;
        kony.print("this.screenHeight--"+this.screenHeight);
        if(kony.os.deviceInfo.name == "android"){
          if((this.screenHeight - 120) > 50*data.length){
            this.view.flxBtns.height = 50*data.length+"dp";
          }else{
            this.view.flxBtns.height = this.screenHeight - 240+ "dp";
          }
        } else {
          if((this.screenHeight - 240) > 50*data.length){
            this.view.flxBtns.height = 50*data.length+"dp";
          }else{
            this.view.flxBtns.height = this.screenHeight - 240+ "dp";
          }
        }
        
        kony.print("Height--"+this.view.flxBtns.height);
        this.view.flxBtns.removeAll();
        for(var i=0; i<data.length; i++){
          var newData = data[i];
          var txt = newData.txtVal;
          var lblUnderline = new kony.ui.Label({
            "height": "1dp",
            "id": "lblUnderline"+i,
            "isVisible": true,
            "left": "0dp",
            "skin": "sknLblGreyLine",
            "textStyle": {},
            "top": "0dp",
            "width": "100%",
            "zIndex": 1
          },{
            "contentAlignment": constants.CONTENT_ALIGN_MIDDLE_LEFT,
            "padding": [0, 0, 0, 0],
            "paddingInPixel": false
          },{
            "renderAsAnchor": false,
            "textCopyable": false
          });
          var btnData = new kony.ui.Button({
            "focusSkin": "sknBtn34pxBlue",
            "height": "48dp",
            "id": "btnOption1"+i,
            "isVisible": true,
            "left": "0%",
            "onClick": this.clickedBtn.bind(this, i),
            "skin": "sknBtn34pxBlue",
            "text": txt,
            "top": "0dp",
            "width": "100%",
            "zIndex": 1
          }, {
            "contentAlignment": constants.CONTENT_ALIGN_CENTER,
            "displayText": true,
            "padding": [0, 0, 0, 0],
            "paddingInPixel": false
          }, {});
          if(i !== data.length-1){
            this.view.flxBtns.add(btnData);
            this.view.flxBtns.add(lblUnderline);
          }else{
            this.view.flxBtns.add(btnData);
          }
        }
      }catch(e){
        alert(JSON.stringify(e));
        kony.print("Error in setDataToActionSheet");
      }
    },

    clickedBtn: function(i){
      try{
        kony.print("index is--"+i);
        if(langOpened){
          var val = "fr";
          if(kony.string.equalsIgnoreCase(QNBConstants.langSettings[i],"Arabic"))
          	val = "ar";
          else if(kony.string.equalsIgnoreCase(QNBConstants.langSettings[i],"English"))
          	val = "en";
          /*if(i === 1){
            val = "ar";
          }
          if(i === 2){
            val = "fr";
          }*/
          dataToSet[i].fnAssigned(val);
        }else{
          if(postLoginUnit){
            dataToSet[i].fnAssigned(dataToSet[i].unitID);
          }else{
            kony.store.setItem("unit", dataToSet[i].unitID);
            dataToSet[i].fnAssigned(dataToSet[i].txtVal);
          }
        }
        this.dismiss();
      }catch(e){
        kony.print("Error in clickedBtn--"+e);
      }
    }
  };
});