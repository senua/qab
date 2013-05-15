window.onload = function() {
  Words = document.getElementById('words');
  Prefix = document.getElementById('prefix');
  Output = makeSelect(document.getElementById('output'));
  Last = document.getElementById('last');

  Words.oninput = upd;
  Prefix.oninput = comp;
  document.getElementById('load').onclick = upd_from_bookmars;

  Prefix.onkeydown = function (e) {
    switch (e.which) {
      case 37:
//         if (Prefix.value[Prefix.value.length-1] == '/')
//           Prefix.value = Prefix.value.slice(0, -1);
//         Prefix.value = Prefix.value.slice(0, Prefix.value.lastIndexOf('/')+1);
        
//         comp();
        break;
      case 38: Output.up(); break;
      case 40: Output.down(); break;
      case 39:
        if (Prefix.selectionStart != Prefix.selectionEnd ||
            Prefix.selectionStart != Prefix.value.length) {
          break;
        }
        var tmp = Output.getValue();
        if (tmp !== undefined) {
          Prefix.value = tmp;
          comp();
        }
        break;
    }
  }

  upd();
}

function upd() {
  var paths = Words.value.split('\n').filter(function(el) {return el.length})
    .map(function(el){
      return {
        path: el.toLowerCase(),
        data: {
          orig: el,
          id: '?'
        }
      }
    });
  T = new Trie();

  T.insert (paths);

  comp();
}

function upd_from_bookmars() {
  Completer.makeBookmarksTrie(function() {
    T = Completer.trie;
    Words.value = Completer.paths.map (function(el) {return el.data.orig}).join('\n');

    comp();
  });
}

function comp() {
  last = T.findLastPath(Prefix.value.toLowerCase());
  if (last) {
    Last.innerHTML = last.orig + ' -> ' + last.id;
  }
  else {
    Last.innerHTML = "no path"
  }
  Output.setOptions( T.autoComplete(Prefix.value.toLowerCase())
    .map(function(el) { return el.orig }) );
}
