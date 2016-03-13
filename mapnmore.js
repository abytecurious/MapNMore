// *****************************************************
// Main Script for the addon - MapNMore                *
// *****************************************************
//        __  __           _  _ __  __                 *
//       |  \/  |__ _ _ __| \| |  \/  |___ _ _ ___     *
//       | |\/| / _` | '_ \ .` | |\/| / _ \ '_/ -_)    *
//       |_|  |_\__,_| .__/_|\_|_|  |_\___/_| \___|    *
//                    |_|                              *
// - - - - - - - - - - - - - - - - - - - - - - - - - - *
// Author     Ramesh Vishveshwar (abytecurious)        *
// Version    0.0.3                                    *
// - - - - - - - - - - - - - - - - - - - - - - - - - - *
// MapNMore is a firefox addon that integrates into    *
// your Firefox session and allows you to select text  *
// and locate it on Google or Bing Maps                *
// You can also use this text as a start/end point on  *
// either provider to get directions.                  *
// - - - - - - - - - - - - - - - - - - - - - - - - - - *
// Version | Description                               *
// - - - - - - - - - - - - - - - - - - - - - - - - - - *
// 0.0.1   | Initial Build                             *
// 0.0.2   | Updated based on AMO feedback             *
// 0.0.3   | Included Preferences                      *
//         |                                           *
//         |                                           *
// - - - - - - - - - - - - - - - - - - - - - - - - - - *
// Latest source code can be downloaded/forked from    *
// GitHub. https://github.com/abytecurious/MapNMore    *
// - - - - - - - - - - - - - - - - - - - - - - - - - - *
// Report bugs/issues on GitHub (or) tweet me your     *
// problems @abytecurious                              *
// - - - - - - - - - - - - - - - - - - - - - - - - - - *
// Thanks for reading and using this add-on.           *
//                                                     *
// *****************************************************
// Required SDK modules --------------------------------
var self = require('sdk/self');
var cmenu = require("sdk/context-menu");
var tabs = require("sdk/tabs");
var selection = require("sdk/selection");
var preferences = require("sdk/simple-prefs").prefs;

// Menu Items (grouped by provider) --------------------
// Google Maps -----------------------------------------
var itmGMaps = cmenu.Item({
	label: "Google Maps",
	contentScript: 'self.on("click", function () { self.postMessage(); });',
	onMessage: function () {
		OpenTabs("GM", "q=", selection.text);
	}
});
var itmGMapsSt = cmenu.Item({
	label: "Google Maps as Starting Point",
	contentScript: 'self.on("click", function () { self.postMessage(); });',
	onMessage: function () {
		OpenTabs("GM", "saddr=", selection.text);
	}
});
var itmGMapsEn = cmenu.Item({
	label: "Google Maps as End Point",
	contentScript: 'self.on("click", function () { self.postMessage(); });',
	onMessage: function () {
		OpenTabs("GM", "daddr=", selection.text);
	}
});
// Bing Maps -------------------------------------------
var itmBingMaps = cmenu.Item({
	label: "Bing Maps",
	contentScript: 'self.on("click", function () { self.postMessage(); });',
	onMessage: function () {
		OpenTabs("BM", "where1=", selection.text);
	}
});
var itmBingMapsSt = cmenu.Item({
  label: "Bing Maps as Starting Point",
  contentScript: 'self.on("click", function () { self.postMessage(); });',
  onMessage: function () {
        OpenTabs("BM", "rtp=adr.", selection.text);
	}
});
var itmBingMapsEn = cmenu.Item({
  label: "Bing Maps as End Point",
  contentScript: 'self.on("click", function () { self.postMessage(); });',
  onMessage: function () function () {
        OpenTabs("BM", "rtp=~adr.", selection.text);
	}
});
// Default Search option -------------------------------
var itmDefault = cmenu.Item({
   label: "Locate"
});
// More Options Menu (under the Main Menu) -------------
var MenMore = cmenu.Menu({
  label: "More",
  image: self.data.url("more-menu-16.png"),
  items: [itmGMapsSt, itmGMapsEn, itmBingMapsSt, itmBingMapsEn]
});
// Main Menu (visible on Right-Click) ------------------
var LocateMenu = cmenu.Menu({
  label: "Locate",
  context: cmenu.SelectionContext(),
  contentScript: 'self.on("context", function () {' +
				 '  var text = window.getSelection().toString();' +
				 '  if (text.length > 17)' +
				 '    text = text.substr(0, 17) + "... on";' +
				 '  return "Locate " + text;' +
				 '});',
  image: self.data.url("mapnmore-16.png"),
  items: [itmDefault, itmGMaps, itmBingMaps, MenMore]
});
// Main Function for Opening Tabs ----------------------
function OpenTabs(provider, activity, address) {
	var OpenURL = '';
	// Fixed multiple spaces to be replaced by single '+' (Thanks to AMO reviewer Ganzert)
	address = address.replace(/(\s\s+)/gm,'+').replace(/(?:\r\n|\r|\n|\s)/gm,'+');
	switch (provider) {
		case "GM":
			OpenURL = "https://www.google.com/maps?" + activity + address;
		break;
		case "BM":
			OpenURL = "http://www.bing.com/maps/default.aspx?" + activity + address;
		break;
		default:
			console.error("MapNMore: [e099] Function called with invalid Provider. Provider value: "+provider);
	}
	tabs.open(OpenURL);
}