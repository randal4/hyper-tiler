    // Saves options to chrome.storage.sync.
    function save_options() {
      var screenWidth = document.getElementById('screenWidth').value;
      var screenHeight = document.getElementById('screenHeight').value;
      var numWindowsWide = document.getElementById('numWindowsWide').value;
      var numWindowsHeight = document.getElementById('numWindowsHeight').value;
      var showAddress = document.getElementById('showAddress').checked;
      
      chrome.storage.sync.set({
        showAddress: showAddress,
        screenHeight: screenHeight,
        screenWidth: screenWidth,
        numWindowsHeight: numWindowsHeight,
        numWindowsWide: numWindowsWide
      }, function() {
        //Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.innerHTML = 'Options have been saved!';
        setTimeout(function() {
          status.innerHTML = '';
        }, 2000);
      });
    }
    
    // Restores state using the preferences stored in chrome.storage.
    function restore_options() {
      chrome.storage.sync.get({
        showAddress: false,
        screenHeight: '1080',
        screenWidth: '1920',
        numWindowsWide: '3',
        numWindowsHeight: '2'
      }, function(items) {
        document.getElementById('showAddress').checked = items.showAddress;
        document.getElementById('screenWidth').value = items.screenWidth;
        document.getElementById('screenHeight').value = items.screenHeight;
        document.getElementById('numWindowsHeight').value = items.numWindowsHeight;
        document.getElementById('numWindowsWide').value = items.numWindowsWide;
      });
    }
    
    document.addEventListener('DOMContentLoaded', restore_options);
    document.getElementById('save').addEventListener('click', save_options);