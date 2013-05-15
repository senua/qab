function select(el, triangle) {
  el.className += " select";
  this.el = el;
  this.triangle = triangle;
  triangle.style.display = "none";
  this.selected = 0;
  this.n_items = 0;
}

select.prototype.setOptions = function (arr) {
  this.n_items = arr.length;
  triangle.style.display = (this.n_items ? "" : "none");
  
  this.el.innerHTML = arr.map(function(el) {return '<div>' + el + '</div>'}).join('\n');
  this.setSelected(0);
  this.selected = 0;
}

select.prototype.setSelected = function (ind) {
  if (ind < 0 || ind >= this.n_items)
    return;

  this.el.children[this.selected].className = "";
  this.el.children[ind].className = "select-item-selected";
  this.selected = ind;

  this.triangle.style.top = this.el.children[ind].offsetTop +
                            this.el.children[ind].offsetHeight/2 -
                            this.triangle.offsetHeight/2 + 'px';
}

select.prototype.getValue = function () {
  if (this.selected < 0 || this.selected >= this.n_items)
    return undefined;

  return this.el.children[this.selected].innerHTML;
}

select.prototype.up = function (ind) {
  this.setSelected (this.selected - 1);
}

select.prototype.down = function (ind) {
  this.setSelected (this.selected + 1);
}

function makeSelect(el, triangle) {
  return el.select = new select(el, triangle);
}