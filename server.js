import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `
  type Book {
    title: String!
    author: String!
  }
  type Author {
    name: String!
    books: [Book]
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type User {
    id: ID!
    username: String!
    fullName: String
  } 
  
  type Query {
      books: [Book!]!
      allUsers: [User!]!
      authors: [Author!]!
      allTweets: [Tweet!]!
      tweet(id: ID!): Tweet
  }
  type Mutation {
    addBook(title: String, author: String): Book
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const authors = [
    {
        name: 'Kate Chopin'
    },
    {
        name: 'Paul Auster'
    }
]

let users = [
    {
        id: '1',
        firstName: "Nico",
        lastName: "las"
    },
    {
        id: '2',
        fisrtName: "Elon",
        lastName: "Musk"
    }
]

let tweets = [
    {
        id: '1',
        text: 'first tweet',
        userId: '2'
    },
    {
        id: '2',
        text: 'Seceod tweet',
        userId: '1'
    }
]

const resolvers = { // 매핑
    Query: {
        books: () => books,
        allUsers: () => users,
        allTweets: () => tweets,
        authors: () => authors,
        tweet: (root, { id }) => {
            return tweets.find((tweet) => tweet.id === id);
        },
    },
    Mutation: {
        postTweet: (_, { text, userID }) => {
            const newTweet = {
                id: tweets.length + 1,
                text,
                userID,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet: (_, { id }) => {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter((tweet) => tweet.id !== id);
            return true;
        }

        // author: () => authors
    },
    User: {
        // fullName: (root) => {
        //     console.log(root);
        //     return "hello";
        // }
        fullName: ({firstName, lastName}) => {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        author: ({userId}) => {
            return users.find(user => user.id === userId);
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);