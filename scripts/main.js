const Scene         = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive      = require('Reactive');
const Blocks        = require('Blocks');
const Patches       = require('Patches');
const Time          = require('Time');

export const Diagnostics = require('Diagnostics');

(async function () {
  const objects       = await Scene.root.findFirst('objects');
  const planeTracker0 = await Scene.root.findFirst("planeTracker0");

  TouchGestures.onTap(planeTracker0).subscribe(function(touch)
  {
    planeTracker0.trackPoint(touch.location);
    Blocks.instantiate('block0').then(function(block) 
    {
      Reactive.once().subscribeWithSnapshot(
        {
            objX : planeTracker0.worldTransform.position.x,
            objY : planeTracker0.worldTransform.position.y,
            objZ : planeTracker0.worldTransform.position.z
        },
        (val, snap)=>{
          objects.addChild(block);
          block.worldTransform.position = Reactive.point(snap.objX,snap.objY, snap.objZ);
        });
        Patches.inputs.setBoolean('grass_sound', true);

        //#region BUG_OF_SPARK_WITH_PLAYING_AUDIO
        Patches.inputs.setBoolean('grass_looping', true);
        Time.setTimeout(() =>
        {
          Patches.inputs.setBoolean('grass_looping', false);
        }, 0.001);
        //#endregion
    });
  });
})();
