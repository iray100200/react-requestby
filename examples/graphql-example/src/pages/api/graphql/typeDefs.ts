import { gql } from "apollo-server-micro"

export const typeDefinitions = gql`
   type book {
      name: String
      id: Int
   }

   type Query  {
      books: [book]
   }
`