import { Client } from "@elastic/elasticsearch";
import logger from "../config/logger.js";
import aiService from "./ai.service.js"; // Import AI service to generate query embeddings

let clientOptions = {};

if (process.env.ELASTICSEARCH_NODE && process.env.ELASTICSEARCH_NODE.startsWith("http")) {
  clientOptions.node = process.env.ELASTICSEARCH_NODE;
} else if (process.env.ELASTICSEARCH_CLOUD_ID) {
  clientOptions.cloud = { id: process.env.ELASTICSEARCH_CLOUD_ID };
  clientOptions.auth = {
    username: process.env.ELASTICSEARCH_USERNAME || "elastic",
    password: process.env.ELASTICSEARCH_PASSWORD
  };
} else {
  clientOptions.node = "http://localhost:9200";
}

const esClient = new Client(clientOptions);

const INDEX_NAME = "ideas";

export const elasticsearchService = {
  /**
   * Initializes the Elasticsearch index with proper mappings
   */
  async createIndex() {
    try {
      const indexExists = await esClient.indices.exists({ index: INDEX_NAME });
      if (!indexExists) {
        await esClient.indices.create({
          index: INDEX_NAME,
          body: {
            mappings: {
              properties: {
                id: { type: "keyword" },
                title: { type: "text", analyzer: "standard" },
                problem: { type: "text", analyzer: "standard" },
                solution: { type: "text", analyzer: "standard" },
                tags: { type: "keyword" },
                category: { type: "keyword" },
                difficulty: { type: "keyword" },
                authorUsername: { type: "keyword" },
                upvotes: { type: "integer" },
                commentCount: { type: "integer" },
                createdAt: { type: "date" },
                embedding: {
                  type: "dense_vector",
                  dims: 1536,
                  index: true,
                  similarity: "cosine"
                }
              },
            },
          },
        });
        logger.info(`Elasticsearch index '${INDEX_NAME}' created.`);
      }
    } catch (error) {
      logger.error("Error creating Elasticsearch index:", error);
    }
  },

  /**
   * Drops the index (used for re-syncing)
   */
  async dropIndex() {
    try {
      const indexExists = await esClient.indices.exists({ index: INDEX_NAME });
      if (indexExists) {
        await esClient.indices.delete({ index: INDEX_NAME });
        logger.info(`Elasticsearch index '${INDEX_NAME}' deleted.`);
      }
    } catch (error) {
      logger.error("Error deleting Elasticsearch index:", error);
    }
  },

  /**
   * Index a single idea document
   * @param {Object} idea 
   */
  async indexIdea(idea) {
    try {
      // Prepare embedding
      let embedding = null;
      if (idea.embedding && Array.isArray(idea.embedding) && idea.embedding.length === 1536) {
        embedding = idea.embedding;
      }

      // Dynamically fetch commentCount if not explicitly passed
      let commentCount = idea.commentCount;
      if (commentCount === undefined) {
        try {
          const mongoose = (await import("mongoose")).default;
          commentCount = await mongoose.model("Comment").countDocuments({ idea: idea._id });
        } catch (err) {
          commentCount = 0;
        }
      }

      await esClient.index({
        index: INDEX_NAME,
        id: idea._id.toString(),
        body: {
          id: idea._id.toString(),
          title: idea.title,
          problem: idea.problem,
          solution: idea.solution,
          tags: idea.tags?.map(t => t.name || t) || [],
          category: idea.category?.name || idea.category || "",
          difficulty: idea.difficulty || "Beginner",
          authorUsername: idea.author?.username || "",
          upvotes: idea.upvotes || 0,
          commentCount: commentCount,
          createdAt: idea.createdAt,
          embedding: embedding
        },
      });
    } catch (error) {
      logger.error(`Error indexing idea ${idea._id}:`, error.message);
    }
  },

  /**
   * Delete an idea from the index
   * @param {String} ideaId 
   */
  async deleteIdea(ideaId) {
    try {
      await esClient.delete({
        index: INDEX_NAME,
        id: ideaId.toString(),
      });
    } catch (error) {
      if (error.meta?.statusCode === 404) return;
      logger.error(`Error deleting idea ${ideaId} from index:`, error);
    }
  },

  /**
   * Search ideas using hybrid search and filters
   */
  async searchIdeas({ q, category, difficulty, sort, page = 1, limit = 20 }) {
    try {
      const from = (page - 1) * limit;
      let queryBody = {
        bool: {
          must: [],
          filter: []
        }
      };

      // Filters
      if (category) {
        queryBody.bool.filter.push({ term: { category: category } });
      }
      if (difficulty) {
        queryBody.bool.filter.push({ term: { difficulty: difficulty } });
      }

      let knn = undefined;

      // Text Query / Semantic Search
      if (q) {
        // If the query contains a colon, it's advanced syntax (e.g., category:"AI")
        if (q.includes(":")) {
          queryBody.bool.must.push({
            query_string: {
              query: q,
              default_operator: "AND"
            }
          });
        } else {
          // Standard text search
          queryBody.bool.must.push({
            multi_match: {
              query: q,
              fields: ["title^3", "problem^2", "solution", "tags"],
              fuzziness: "AUTO",
            }
          });

          // Attempt Semantic Search
          try {
            const queryEmbedding = await aiService.generateQueryEmbedding(q);
            if (queryEmbedding && queryEmbedding.length === 1536) {
              knn = {
                field: "embedding",
                query_vector: queryEmbedding,
                k: limit,
                num_candidates: 100,
                boost: 0.5,
              };
            }
          } catch (e) {
            logger.warn("Semantic search failed to generate embedding:", e.message);
          }
        }
      } else {
        // If no query, just match all
        queryBody.bool.must.push({ match_all: {} });
      }

      // Sorting
      let sortBody = [];
      if (!q) {
        // Only sort if no text query (otherwise rely on ES relevance score)
        if (sort === "oldest") sortBody = [{ createdAt: "asc" }];
        else if (sort === "top") sortBody = [{ upvotes: "desc" }];
        else if (sort === "discussed") sortBody = [{ commentCount: "desc" }];
        else sortBody = [{ createdAt: "desc" }];
      }

      const searchReq = {
        index: INDEX_NAME,
        body: {
          query: queryBody,
          _source: ["id", "title", "problem", "category", "tags", "difficulty", "authorUsername", "upvotes", "commentCount", "createdAt"],
          from,
          size: limit,
          sort: sortBody.length > 0 ? sortBody : undefined
        },
      };

      if (knn && knn.query_vector) {
        searchReq.body.knn = knn;
      }

      const result = await esClient.search(searchReq);

      const total = typeof result.hits.total === 'number' ? result.hits.total : result.hits.total.value;
      
      return {
        ideas: result.hits.hits.map(hit => hit._source),
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error("Error searching ideas in Elasticsearch:", error.message);
      return { ideas: [], total: 0, page, totalPages: 0 };
    }
  },

  /**
   * Suggest tags using terms aggregation
   */
  async suggestTags(prefix) {
    if (!prefix) return [];
    try {
      const result = await esClient.search({
        index: INDEX_NAME,
        body: {
          size: 0,
          query: {
            prefix: {
              tags: {
                value: prefix.toLowerCase()
              }
            }
          },
          aggs: {
            suggested_tags: {
              terms: {
                field: "tags",
                include: `${prefix.toLowerCase()}.*`,
                size: 5
              }
            }
          }
        }
      });
      return result.aggregations?.suggested_tags?.buckets?.map(b => b.key) || [];
    } catch (error) {
      logger.error("Error suggesting tags:", error.message);
      return [];
    }
  }
};

export default elasticsearchService;
