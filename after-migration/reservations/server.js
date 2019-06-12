const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { TypedID, GraphqlTypedIdScalar } = require('./TypedID');

const typeDefs = gql`
  scalar TypedID

  type Reservation @key(fields: "id") {
    id: TypedID!
    userId: TypedID!
    reservationDate: String!
    status: String
  }

  type Query {
    reservations: [Reservation]!
    reservation(id: TypedID!): Reservation
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    reservations: [Reservation]
  }
`;

const lookupReservation = (id) => {
  console.log(id);

  return {
    id: new TypedID("Reservation", "1"),
    userId: new TypedID("Reservation", "1"),
    reservationDate: 'today',
    status: 'good',
  };
};

const resolvers = {
  Query: {
    reservations: () => [lookupReservation(), lookupReservation()],
    reservation: (parent, {id}) => lookupReservation(id),
  },
  User: {
    reservations: () => [lookupReservation()],
  },
  Reservation: {
    __resolveReference: obj => lookupReservation(),
    userId: res => {
      console.log(res);
      return res.userId;
    },
  },
  TypedID: GraphqlTypedIdScalar
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
