import { Client } from "@elastic/elasticsearch";
import logger from "../config/logger.js";

const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
});

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
                category: { type: "keyword" }, // Added category based on user request
                upvotes: { type: "integer" },
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
   * Index a single idea document
   * @param {Object} idea 
   */
  async indexIdea(idea) {
    try {
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
          upvotes: idea.upvotes || 0,
        },
      });
      // Optionally refresh to make it searchable immediately, but standard 1s refresh is usually fine
    } catch (error) {
      logger.error(`Error indexing idea ${idea._id}:`, error);
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
      if (error.meta?.statusCode === 404) return; // Ignore if already not there
      logger.error(`Error deleting idea ${ideaId} from index:`, error);
    }
  },

  /**
   * Search ideas across multiple fields
   * @param {String} queryText 
   */
  async searchIdeas(queryText) {
    if (!queryText) return [];

    try {
      const result = await esClient.search({
        index: INDEX_NAME,
        body: {
          query: {
            multi_match: {
              query: queryText,
              fields: ["title^3", "problem^2", "solution", "tags", "category"],
              fuzziness: "AUTO",
            },
          },
          _source: ["id", "title", "problem", "category", "tags"],
          size: 10,
        },
      });

      return result.hits.hits.map(hit => hit._source);
    } catch (error) {
      logger.error("Error searching ideas in Elasticsearch:", error);
      return [];
    }
  },
};

export default elasticsearchService;
