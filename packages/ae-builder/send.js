const ae = require("after-effects");

async function sendToAE(data) {
  console.log(data);
  try {
    await ae.execute((data) => {
      function sanitizedColor(v) {
        return Math.floor((v / 255) * 1000) / 1000;
      }

      function renderLayer(layer) {
        const text = app.project.activeItem.layers.addText(layer.value);

        text.motionBlur = true;
        text.anchorPoint.setValue([
          layer.width / 2,
          (layer.textHeight / 4) * -1,
        ]);

        const sourceText = text.property("Source Text");
        if (sourceText) {
          const textDoc = sourceText.value;
          textDoc.fillColor = [
            sanitizedColor(layer.color[0]),
            sanitizedColor(layer.color[1]),
            sanitizedColor(layer.color[2]),
          ];
          textDoc.font = data.fontRegular;
          textDoc.fontSize = data.fontSize;
          if (layer.italic) {
            textDoc.font = data.fontItalic;
          }
          textDoc.tracking = -1;
          sourceText.setValue(textDoc);
        }

        text.startTime = layer.startTime;
        text.outPoint = layer.endTime;
        text.position.setValueAtTime(layer.startTime, [
          layer.location[0] + layer.width / 2,
          layer.location[1] + layer.height / 2,
          0.0,
        ]);

        layer.transitions.forEach((transition) => {
          if (transition.type == "alpha") {
            text.opacity.setValueAtTime(transition.time, transition.value);
          }
          if (transition.type == "move") {
            text.position.setValueAtTime(transition.time, [
              transition.location[0] + layer.width / 2,
              transition.location[1] + layer.height / 2,
              0.0,
            ]);
          }
          if (transition.type == "scale") {
            text.scale.setValueAtTime(transition.time, [
              transition.value,
              transition.value,
            ]);
          }
        });
      }

      app.beginUndoGroup("Adding code");
      app.project.items
        .addComp(
          data.compName,
          Math.ceil(data.extents[0]),
          Math.ceil(data.extents[1]),
          1,
          data.totalTime,
          30
        )
        .openInViewer();

      if (data.rectangles.length > 0) {
        app.project.activeItem.bgColor = [1, 1, 1];

        const background = app.project.activeItem.layers.addShape();
        background.motionBlur = true;
        background.position.setValue([0, 0]);

        data.rectangles.forEach((r, i) => {
          if (i > 0) {
            background.anchorPoint.setValueAtTime(
              r.time - 0.2,
              data.rectangles[i - 1].anchor
            );
          }
          background.anchorPoint.setValueAtTime(r.time, r.anchor);
        });

        const myShapeGroup = background.property("ADBE Root Vectors Group");
        const shapeGroup = myShapeGroup.addProperty("ADBE Vector Group");
        shapeGroup.name = "Background";

        const rect = shapeGroup
          .property("Contents")
          .addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Roundness").setValue(20);
        rect
          .property("ADBE Vector Rect Position")
          .setValue([
            (data.rectangles[0].size[0] / 2) * -1,
            (data.rectangles[0].size[1] / 2) * -1 - 10,
          ]);

        data.rectangles.forEach((r, i) => {
          if (i > 0) {
            rect
              .property("ADBE Vector Rect Size")
              .setValueAtTime(r.time - 0.2, [
                data.rectangles[i - 1].size[0] - 10,
                data.rectangles[i - 1].size[1],
              ]);
          }
          rect
            .property("ADBE Vector Rect Size")
            .setValueAtTime(r.time, [r.size[0] - 10, r.size[1] - 10]);
        });

        const fill = shapeGroup
          .property("Contents")
          .addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([0, 0, 0]);
        fill.property("ADBE Vector Fill Opacity").setValue(80);

        const stroke = shapeGroup
          .property("Contents")
          .addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Color").setValue([0, 0, 0]);
        stroke.property("ADBE Vector Stroke Width").setValue(10);
        stroke.property("ADBE Vector Stroke Opacity").setValue(100);
      }

      data.layers.forEach(renderLayer);

      app.endUndoGroup();
    }, data);
  } catch (e) {}
}

module.exports = sendToAE;
