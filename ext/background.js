Completer = {
  paths: [],
  trie: false,

  sortPaths: function() {
    this.paths.sort(function(a, b) {
      return a.path.slice(0, -1) < b.path.slice(0, -1) ? -1 : 1;
    });
  },
  
  dfs_pr: function(root, prefix) {
    if (root.children === undefined)
      return;

    var cld = root.children;
    var n_cld = cld.length;
    var path = prefix + root.title + '/';

    this.paths.push ({
      path: path.toLowerCase(),
      data: {
        orig: path,
        id: root.id
      }
    });

    for (var i = 0; i < n_cld; ++i) {
      this.dfs_pr (cld[i], path);
    }
  },

  dfs: function(root) {
    if (root.children === undefined)
      return;

    var cld = root.children;
    var n_cld = cld.length;

    for (var i = 0; i < n_cld; ++i) {
      this.dfs_pr (cld[i], "");
      this.dfs (cld[i]);
    }
  },

  makeBookmarksTrie: function() {
    chrome.bookmarks.getSubTree("1", function(root) {
      var that = Completer;
      that.paths = [];
      that.dfs(root[0]);
      that.trie = new Trie();

      that.sortPaths();
      
      that.trie.insert (that.paths);
    });
  }
}

function create(root_id, pathArr, callback) {
  if (pathArr.length == 0)
    return callback(root_id);

  var first = pathArr.shift();
  var res;
  
  chrome.bookmarks.create({
    parentId: root_id,
    title: first
  }, function(el) {
    create(el.id, pathArr, callback);
  });
}

function lookup(path, callback) {
  var root_id = "1";
  var last = Completer.trie.findLastPath(path.toLowerCase());
 
  if (last) {
    if (last.orig != path.slice(0, last.orig.length))
      console.log("findLastPath ERROR!");

    path = path.slice(last.orig.length);
    root_id = last.id;
  }

  arr = path.split('/').map(function(el) {return el.trim()})
    .filter(function(el) {return el.length});

  create(root_id, arr, callback);
}

function findEmptyLeft(callback) {
  chrome.bookmarks.getChildren("1", function(arr) {
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i].title == "") {
        callback (i);
        return;
      }
    }

    callback (0);
  });
}

function save(path, title, url) {
  if (path == "" && title == "") {
    findEmptyLeft(function (ind) {
      _save_ind(path, title, url, ind);
    });
  }
  else {
    _save_ind(path, title, url);
  }
}

function _save_ind(path, title, url, index) {
  lookup(path, function(id) {
    chrome.bookmarks.create({
      parentId: id,
      title: title,
      url: url,
      index: index
    });
  });
}

Completer.makeBookmarksTrie();
chrome.bookmarks.onCreated.addListener(Completer.makeBookmarksTrie);
chrome.bookmarks.onRemoved.addListener(Completer.makeBookmarksTrie);
chrome.bookmarks.onChanged.addListener(Completer.makeBookmarksTrie);
chrome.bookmarks.onMoved.addListener(Completer.makeBookmarksTrie);
chrome.bookmarks.onImportEnded.addListener(Completer.makeBookmarksTrie);
