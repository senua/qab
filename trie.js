/*
* TRIE implementation in Javascript
* Copyright (c) 2010 Saurabh Odhyan | http://odhyan.com
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* Date: Nov 7, 2010
*/

/*
 * some changes was made by Vladimir S-O in 2013 for smart file path
 * autocompletion
 */

/*
* A trie, or prefix tree, is a multi-way tree structure useful for storing strings over an alphabet. 
* It has been used to store large dictionaries of English (say) words in spell-checking programs 
* and in natural-language "understanding" programs.    
* @see http://en.wikipedia.org/wiki/Trie
* @see http://www.csse.monash.edu.au/~lloyd/tildeAlgDS/Tree/Trie/
/*

* @class Trie
* @constructor
*/  
Trie = function() {
    this.words = 0;
    this.prefixes = 0;
    this.children = [];
    this.lastData = undefined;
};

Trie.prototype = {
    
    /*
    * Insert a word into the dictionary. 
    * Recursively traverse through the trie nodes, and create new node if does not already exist.
    *
    * @method insert
    * @param {String} str Word to insert in the dictionary
    * @param {Integer} pos Current index of the string to be inserted
    * @return {Void}
    */
    insert: function(str, data, pos) {
        if (typeof str != "string") {
          if (str.path === undefined) {
            // not path/data object - should be array
            for (var i=0; i<str.length; ++i) {
              this.insert (str[i]);
            }
          }
          else {
            data = str.data;
            str = str.path;
          }
        }

        
        if(str.length == 0) { //blank string cannot be inserted
            return;
        }
        
        var T = this,
            k,
            child;
            
        if(pos === undefined) {
            pos = 0;
        }
        if(pos === str.length) {
            T.words ++;
            T.data = data;
            return;
        }
        T.prefixes ++;
        k = str[pos];
        if(T.children[k] === undefined) { //if node for this char doesn't exist, create one
            T.children[k] = new Trie();
        }
        child = T.children[k];
        child.insert(str, data, pos + 1);
    },
    
    /*
    * Remove a word from the dictionary.
    *
    * @method remove
    * @param {String} str Word to be removed
    * @param {Integer} pos Current index of the string to be removed
    * @return {Void}
    */
    remove: function(str, pos) {
        if(str.length == 0) {
            return;
        }
        
        var T = this,
            k,
            child;
        
        if(pos === undefined) {
            pos = 0;
        }   
        if(T === undefined) {
            return;
        }
        if(pos === str.length) {
            T.words --;
            return;
        }
        T.prefixes --;
        k = str[pos];
        child = T.children[k];
        child.remove(str, pos + 1);
    },
    
    /*
    * Update an existing word in the dictionary. 
    * This method removes the old word from the dictionary and inserts the new word.
    *
    * @method update
    * @param {String} strOld The old word to be replaced
    * @param {String} strNew The new word to be inserted
    * @return {Void}
    */
    update: function(strOld, strNew, newData) {
        if(strOld.length == 0 || strNew.length == 0) {
            return;
        }
        this.remove(strOld);
        this.insert(strNew, newData);
    },
    
    /*
    * Count the number of times a given word has been inserted into the dictionary
    *
    * @method countWord
    * @param {String} str Word to get count of
    * @param {Integer} pos Current index of the given word
    * @return {Integer} The number of times a given word exists in the dictionary
    */
    countWord: function(str, pos) {
        if(str.length == 0) {
            return 0;
        }
        
        var T = this,
            k,
            child,
            ret = 0;
        
        if(pos === undefined) {
            pos = 0;
        }   
        if(pos === str.length) {
            return T.words;
        }
        k = str[pos];
        child = T.children[k];
        if(child !== undefined) { //node exists
            ret = child.countWord(str, pos + 1);
        }
        return ret;
    },

    findLastPath: function(str) {
        if(str.length == 0) {
            return undefined;
        }

        var cur = this,
            last = undefined;

        if (cur.words > 0)
            last = cur.data;
            
        for (var i = 0; i < str.length; ++i) {
          var cur = cur.children[str[i]];
          if (cur === undefined)
            break;

          if (cur.words > 0)
            last = cur.data;
        }

        return last;
    },
    
    /*
    * Count the number of times a given prefix exists in the dictionary
    *
    * @method countPrefix
    * @param {String} str Prefix to get count of
    * @param {Integer} pos Current index of the given prefix
    * @return {Integer} The number of times a given prefix exists in the dictionary
    */
    countPrefix: function(str, pos) {
        if(str.length == 0) {
            return 0;
        }
        
        var T = this,
            k,
            child,
            ret = 0;

        if(pos === undefined) {
            pos = 0;
        }
        if(pos === str.length) {
            return T.prefixes;
        }
        var k = str[pos];
        child = T.children[k];
        if(child !== undefined) { //node exists
            ret = child.countPrefix(str, pos + 1); 
        }
        return ret; 
    },
    
    /*
    * Find a word in the dictionary
    *
    * @method find
    * @param {String} str The word to find in the dictionary
    * @return {Boolean} True if the word exists in the dictionary, else false
    */
    find: function(str) {
        if(str.length == 0) {
            return false;
        }
        
        if(this.countWord(str) > 0) {
            return true;
        } else {
            return false;
        }
    },
    
    /*
    * Get all words in the dictionary
    *
    * @method getAllWords
    * @param {String} str Prefix of current word
    * @return {Array} Array of words in the dictionary
    */
    getAllWords: function(str, ban_slash) {
        var T = this,
            k,
            child,
            ret = [];
        if(str === undefined) {
            str = "";
        }
        if(T === undefined) {
            return [];
        }
        if(T.words > 0 && ban_slash) {
            ret.push(T.data);
        }
        if (ban_slash && str[str.length - 1] == '/') {
          return ret;
        }
        for(k in T.children) {
            child = T.children[k];
            ret = ret.concat(child.getAllWords(str + k, true));
        }
        return ret;
    },
    
    /*
    * Autocomplete a given prefix
    *
    * @method autoComplete
    * @param {String} str Prefix to be completed based on dictionary entries
    * @param {Integer} pos Current index of the prefix
    * @return {Array} Array of possible suggestions
    */
    autoComplete: function(str, pos) {
        if(str.length == 0) {
            return [];
        }
        
        var T = this,
            k,
            child;
        
        if(pos === undefined) {
            pos = 0;
        }   
        k = str[pos];
        child = T.children[k];
        if(child === undefined) { //node doesn't exist
            return [];
        }
        if(pos === str.length - 1) {
            return child.getAllWords(str);
        }
        return child.autoComplete(str, pos + 1);
    }
};
