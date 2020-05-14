var deleteIcon = "../assets/CaptionThis/img/delete.png";
var editIcon = "../assets/CaptionThis/img/edit.png";

var deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;

var editImg = document.createElement("img");
editImg.src = editIcon;

function renderIcon(icon) {
  return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

fabric.Object.prototype.borderColor = "blue";
fabric.Object.prototype.cornerColor = "blue";

fabric.Object.prototype.controls.edit = new fabric.Control({
  position: { x: 0.5, y: 0.5 },
  offsetY: 16,
  offsetX: 0,
  cursorStyle: "pointer",
  mouseUpHandler: editText,
  render: renderIcon(editImg),
  cornerSize: 24,
});

fabric.Object.prototype.controls.delete = new fabric.Control({
  position: { x: 0.5, y: -0.5 },
  offsetY: -16,
  offsetX: 0,
  cursorStyle: "pointer",
  mouseUpHandler: deleteObject,
  render: renderIcon(deleteImg),
  cornerSize: 24,
});

function deleteObject(eventData, target) {
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
}

function editText(eventData, target) {
  target.enterEditing();
}
