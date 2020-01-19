// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var screenWidth;
var screenHeight;
var numWindowsWide;
var numWindowsHeight;
var showAddress;

var winIds = [];

chrome.storage.sync.get({
  showAddress: false,
  screenHeight: '1080',
  screenWidth: '1920',
  numWindowsWide: '3',
  numWindowsHeight: '2'
}, function(items) {
  showAddress = items.showAddress;
  screenWidth = items.screenWidth;
  screenHeight = items.screenHeight;
  numWindowsHeight = items.numWindowsHeight;
  numWindowsWide = items.numWindowsWide;

  init();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  chrome.storage.sync.get({
    showAddress: false,
    screenHeight: '1080',
    screenWidth: '1920',
    numWindowsWide: '3',
    numWindowsHeight: '2'
  }, function(items) {
    showAddress = items.showAddress;
    screenWidth = items.screenWidth;
    screenHeight = items.screenHeight;
    numWindowsHeight = items.numWindowsHeight;
    numWindowsWide = items.numWindowsWide;

    chrome.contextMenus.removeAll(function() {init();})
  });
});

function init(){
  var rowNumber = 1;

  for(var i = 0; i < numWindowsHeight * numWindowsWide; i++){
    if(i%numWindowsWide == 0){
      chrome.contextMenus.create({type:"separator",contexts : ["link"]});
      rowNumber++;
    }

    chrome.contextMenus.create({
      "title": (i+1)+ "", 
      "onclick":getClickHandler(i),
      "contexts" : ["link"]
    });
  }

  chrome.contextMenus.create({type:"separator",contexts : ["link"]});
  
  chrome.contextMenus.create({
    "title": "Close All",
    "onclick": closeAllWindows,
    "contexts" : ["link"]
  })

  chrome.contextMenus.create({type:"separator",contexts : ["link"]});

  chrome.contextMenus.create({
    "title": "Options",
    "onclick": function(){chrome.runtime.openOptionsPage();},
    "contexts" : ["link"]
  });

}

function closeAllWindows(){
  for(var x = 0; x < winIds.length; x++){
    if(winIds[x] != undefined){
      chrome.windows.remove(winIds[x]);
      winIds[x] = undefined;
    }
  }
}

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler(windowNumber) {
  return function(info, tab) {

    var linkUrl = info.linkUrl;

    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
    console.log('showAddress:' + showAddress);

    // Create a new window to the info page.
    // 1920 × 991
    // each 640 x 495 to make 6 windows
    var windowWidth = Math.floor(screenWidth/numWindowsWide);
    var windowHeight = Math.floor(screenHeight/numWindowsHeight);
    var windowLeft = (windowNumber%numWindowsWide)*windowWidth;
    var windowTop = Math.floor(windowNumber/numWindowsWide) * windowHeight

    if(winIds[windowNumber] == undefined ){
      chrome.windows.create({ url: linkUrl, width: windowWidth, height: windowHeight, left: windowLeft, top: windowTop, type:showAddress?"normal":"popup", incognito: tab.incognito},
          function(window){
            winIds[windowNumber] = window.id;
          });
    } else{
      chrome.tabs.query({ windowId: winIds[windowNumber]}, 
          function(tabs){
            if(tabs.length > 0){
              chrome.tabs.update(tabs[0].id, {url: linkUrl});
            } else{
              chrome.windows.create({ url: linkUrl, width: windowWidth, height: windowHeight, left: windowLeft, top: windowTop, type: showAddress?"normal":"popup", incognito: tab.incognito},
                function(window){
                  winIds[windowNumber] = window.id;
                });
            }
          });
    }
  };
};