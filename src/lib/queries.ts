export const QUERY_PRODUCTS = `
  query Products($search: String, $cat: [String], $first: Int!, $after: String) {
    products(
      where: {
        search: $search
        categoryIn: $cat
      }
      first: $first
      after: $after
    ) {
      nodes {
        id
        databaseId
        slug
        name
        type
        description
        shortDescription
        image { 
          sourceUrl 
          altText 
        }
        productCategories {
          nodes {
            slug
            name
          }
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockQuantity
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockQuantity
          stockStatus
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const QUERY_CATEGORIES = `
  query Categories {
    productCategories(first: 100, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;
export const QUERY_PRODUCT_SLUGS = `
  query ProductSlugs {
    products(first: 1000) {
      nodes {
        slug
      }
    }
  }
`;

export const QUERY_PRODUCT = `
  query Product($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      slug
      name
      description
      image {
        sourceUrl
        altText
      }
    }
  }
`;
