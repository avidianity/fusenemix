const originalErrorToString = Error.prototype.toString;

Error.prototype.toString = function (indentLevel = 0) {
  let errorMessage = `${'\t'.repeat(indentLevel)}${originalErrorToString.call(
    this,
  )}`;

  if (this.cause instanceof Error) {
    errorMessage += `\n${this.cause.toString(indentLevel + 1)}`;
  }

  return errorMessage;
};

Error.prototype.toJSON = function () {
  const alt = {
    type: this.name,
  } as any;

  const _this = this as any;
  Object.getOwnPropertyNames(_this).forEach(function (key) {
    const value = _this[key];

    if (value instanceof Error && key === 'cause') {
      alt[key] = value.toJSON();
    } else if (_this instanceof AggregateError && key === 'errors') {
      alt[key] = _this.errors.map((error) => {
        if (error instanceof Error) {
          return error.toJSON();
        }

        return error;
      });
    } else {
      alt[key] = value;
    }
  }, _this);

  if ('stack' in alt) {
    alt.stack = alt.stack
      .split(/\r?\n/)
      .map((string: string) => string.trim())
      .filter((_: any, i: number) => i !== 0);
  }

  return alt;
};

const originalAggregateErrorToString = AggregateError.prototype.toString;

AggregateError.prototype.toString = function (indentLevel = 0) {
  let errorMessage = `${'\t'.repeat(
    indentLevel,
  )}${originalAggregateErrorToString.call(this)}`;

  if (this.cause instanceof Error) {
    errorMessage += `\n${this.cause.toString(indentLevel + 1)}`;
  }

  if (this.errors) {
    errorMessage += this.errors.map((error) => {
      if (error instanceof Error) {
        return `\n${error.toString(indentLevel + 1)}`;
      }

      return error;
    });
  }

  return errorMessage;
};
