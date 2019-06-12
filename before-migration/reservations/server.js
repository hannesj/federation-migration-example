const { ApolloServer, gql } = require('apollo-server');
const { TypedID, GraphqlTypedIdScalar } = require('./TypedID');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Reservation {
    id: ID!
    userId: ID!
    reservationDate: String!
    status: String
  }

  type Query {
    reservations: [Reservation]!
    reservation(id: ID!): Reservation
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
  ID: GraphqlTypedIdScalar
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
