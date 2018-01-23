window.onload = function scanForImages() {
  var imgElements = document.getElementsByTagName('img');

  var currentImage;

  /* for (var i = 0; i < imgElements.length; i++) {
    if (imgElements[i].hasAttribute("alt") === false) {
      console.log(imgElements[i].src, imgElements[i].dataSrc);
    }
  } */


  for (var i = 0; i < imgElements.length; i++) {
    //console.log(imgElements[i].src);
    if (checkForAltTag(imgElements[i]) && checkForJPEG(imgElements[i].src)) { //Also check whether the image is a jpg.
      createAltValue(imgElements[i]);
    } else if (!checkForAltTag(imgElements[i]) && checkForJPEG(imgElements[i].src)) {
      sendAltProperty(imgElements[i].src, imgElements[i].alt)
    }
  }
}

function checkForAltTag(element) {
  if ( (element.hasAttribute("alt") === false) || (element.getAttribute("alt") === "" || null) ) {
    //console.log('Does not have alt tag or a missing alt tag value');
    return true;
  } else {
    //console.log('Does have an alt tag or an alt tag value');
    return false;
  }
}


function createAltValue(img) {

  var imgUrl = img.src;
  currentImage = img;

  console.log('Create Alt Value for: ' + imgUrl);

  var apiUrl = 'https://v0fkjw6l82.execute-api.us-west-2.amazonaws.com/prod/auto-alt-text-api?url=' + imgUrl;

  var xhr = new XMLHttpRequest();

  xhr.open("GET", apiUrl, true);
    xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      var resp = JSON.parse(xhr.responseText);

      currentImage.setAttribute('alt', resp[0].captions[0].sentence);
      console.log(resp[0].captions[0].sentence);
    }
  }
  xhr.send();
}

function sendAltProperty(src, value) {
  console.log("Src: " + src + " - Value: " + value);
}

function checkForJPEG(value) {
  value = value.toLowerCase();
  if ((value.indexOf(".jpeg") !== -1) || (value.indexOf(".jpg") !== -1)) {
    //console.log('Contains .jpeg or .jpg');
    return true;
  } else {
    //console.log('Does not contain .jpeg or jpg');
    return false;
  }
}
