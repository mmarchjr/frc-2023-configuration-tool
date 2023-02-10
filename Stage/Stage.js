/* eslint-disable require-yield, eqeqeq */

import {
  Stage as StageBase,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Stage extends StageBase {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("backdrop1", "./Stage/costumes/backdrop1.svg", {
        x: 240,
        y: 180
      })
    ];

    this.sounds = [new Sound("pop", "./Stage/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked)
    ];

    this.vars.data = 0;
    this.vars.controller = 0;
    this.vars.left = 0;
    this.vars.right = 0;
    this.vars.output = ["double click the following output and copy it.", 10];

    this.watchers.output = new Watcher({
      label: "output",
      style: "normal",
      visible: false,
      value: () => this.vars.output,
      x: 240,
      y: 180,
      width: 480,
      height: 360
    });
  }

  *whenGreenFlagClicked() {
    yield* this.collectData();
  }

  *process() {
    this.vars.output = [];
    if (this.vars.controller == "xbox") {
      this.vars.data = 0;
    }
    if (this.vars.controller == "joystick") {
      this.vars.data = 1;
    }
    if (this.vars.left == "turn") {
      this.vars.data += 10;
    }
    if (this.vars.left == "move") {
      this.vars.data += 0;
    }
    if (2 > this.vars.data.length) {
      while (!(2 == this.vars.data.length)) {
        this.vars.data = "" + 0 + this.vars.data;
      }
    }
    this.vars.output.push("double click the following output and copy it.");
    this.vars.output.push(this.vars.data);
    this.watchers.output.visible = true;
  }

  *collectData() {
    this.watchers.output.visible = false;
    this.vars.data = 0;
    this.vars.controller = 0;
    this.vars.left = 0;
    this.vars.right = 0;
    yield* this.askAndWait(
      "do you want to use an xbox controller or a joystick(type 1 for xbox, type 2 for joystick)"
    );
    if (this.answer == 1 || this.answer == 2) {
      if (this.answer == 1) {
        this.vars.controller = "xbox";
        yield* this.askAndWait(
          "what do you want the left stick to control?(1 for turning, 2 for moving)"
        );
        if (this.answer == 1 || this.answer == 2) {
          if (this.answer == 1) {
            this.vars.left = "turn";
            this.vars.right = "move";
          } else {
            this.vars.left = "move";
            this.vars.right = "turn";
          }
          yield* this.askAndWait(
            "thanks, you can copy your data from the following(press enter to continue)"
          );
          this.warp(this.process)();
          /* TODO: Implement stop all */ null;
        }
      } else {
        this.vars.controller = "joystick";
        yield* this.askAndWait(
          "thanks, you can copy your data from the following(press enter to continue)"
        );
        this.warp(this.process)();
        /* TODO: Implement stop all */ null;
      }
    }
    yield* this.askAndWait("incorrect data, press enter to restart");
    this.warp(this.collectData)();
  }
}
