const original = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  trace: console.trace,
  debug: console.debug,
  info: console.info,
  group: console.group,
  groupCollapsed: console.groupCollapsed,
};

console.log = function (...args) {
  original.log(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }

      return item;
    }) ?? [])
  );
};

console.error = function (...args) {
  original.error(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }

      return item;
    }) ?? [])
  );
};

console.warn = function (...args) {
  original.warn(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }
      return item;
    }) ?? [])
  );
};

console.trace = function (...args) {
  original.trace(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }
      return item;
    }) ?? [])
  );
};

console.debug = function (...args) {
  original.debug(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }
      return item;
    }) ?? [])
  );
};

console.info = function (...args) {
  original.info(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }
      return item;
    }) ?? [])
  );
};

console.group = function (...args) {
  original.group(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }
      return item;
    }) ?? [])
  );
};

console.groupCollapsed = function (...args) {
  original.groupCollapsed(
    ...(args?.map((item) => {
      if (item instanceof Error) {
        return item.toString();
      }
      return item;
    }) ?? [])
  );
};
