const { GraphQLScalarType, Kind } = require("graphql");

const stringToBase64 = input => Buffer.from(input).toString("base64");

const base64ToString = input => Buffer.from(input, "base64").toString();

class TypedID {
  constructor(type, id) {
    this.type = type;
    this.id = id;
  }

  static fromString(input) {
    const parts = input.split(":");

    if (parts.length !== 2) {
      throw new Error(`Invalid input string: ${input}`);
    }

    const [typeBase64, idBase64] = parts;

    const type = base64ToString(typeBase64);
    const id = base64ToString(idBase64);

    return new TypedID(type, id);
  }

  assertType(type) {
    if (this.type !== type) {
      throw new Error(
        `Unexpected type for ${this.id}, expecting ${type} but has ${this.type}`
      );
    }
  }

  getIdWithTypeAssert(type) {
    this.assertType(type);
    return this.id;
  }

  toString() {
    const typeBase64 = stringToBase64(this.type);
    const idBase64 = stringToBase64(this.id);
    return `${typeBase64}:${idBase64}`;
  }

  toJSON() {
    return this.toString();
  }
}

const config = {
  name: "ID",
  description:
    'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
  serialize(input) {
    if (typeof input === "string") return input;
    if (!(input instanceof TypedID)) {
      throw new TypeError(
        `unexpected serialize type for TypedId: ${typeof input}`
      );
    }
    return input.toString();
  },
  parseValue(input) {
    if (input instanceof TypedID) {
      return input;
    }
    if (typeof input !== "string") {
      throw new TypeError(
        `unexpected parseValue type for TypedId: ${typeof input}`
      );
    }
    return TypedID.fromString(input);
  },
  parseLiteral(input) {
    if (input.kind !== Kind.STRING) {
      throw new TypeError(
        `unexpected parseLiteral type for TypedId: ${input.kind}`
      );
    }
    return TypedID.fromString(input.value);
  }
};

const GraphqlTypedIdScalar = new GraphQLScalarType(config);

module.exports = {TypedID, GraphqlTypedIdScalar}
