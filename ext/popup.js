window.onload = function() {
  Path = document.getElementById("path");
  Title = document.getElementById("title");
  Select = makeSelect(document.getElementById("select"),
    document.getElementById("triangle"));

  init();
}

function init () {
  Path.oninput = input;
  Path.onkeydown = keydown;
  Title.onkeydown = title_keydown;


  chrome.tabs.query({active: true, currentWindow: true}, function(arr) {
    Url = arr[0].url;
    Title.value = arr[0].title;
  });

  T = chrome.extension.getBackgroundPage().Completer.trie;
}


function input() {
  Select.setOptions( T.autoComplete(Path.value.toLowerCase())
    .map(function(el) { return el.orig }) );
}

function keydown(e) {
  switch (e.which) {
    case 13:
      Select.el.style.display = "none";
      Title.style.display = "inline";
      Title.select();
      Title.focus();
      break;
    case 38: Select.up(); break;
    case 40: Select.down(); break;
    case 39:
      if (Path.selectionStart != Path.selectionEnd ||
          Path.selectionStart != Path.value.length) {
        break;
      }
      var tmp = Select.getValue();
      if (tmp !== undefined) {
        Path.value = tmp;
        input();
      }
      break;
  }
}

function title_keydown(e) {
  if (e.which != 13)
    return;

  chrome.extension.getBackgroundPage().save(Path.value, Title.value, Url);
  window.close();
}