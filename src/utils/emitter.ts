// src/utils/emitter.ts

import mitt from "mitt";

type Events = {
  "show-notification": { type: "success" | "warning" | "error"; message: string };
};

const emitter = mitt<Events>();

export default emitter;
