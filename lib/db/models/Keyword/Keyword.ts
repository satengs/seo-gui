import mongoose, { Schema } from 'mongoose';

//Search Metadata Schema
const SearchMetadataSchema = new mongoose.Schema({
  id: String,
  status: String,
  json_endpoint: String,
  created_at: Date,
  processed_at: Date,
  google_url: String,
  raw_html_file: String,
  total_time_taken: Number,
});

//Search Parameters Schema
const SearchParametersSchema = new mongoose.Schema({
  engine: String,
  q: String,
  google_domain: String,
  device: String,
  location_requested: String,
  location_used: String,
  hl: String,
  gl: String,
});

//Search Information Schema
const SearchInformationSchema = new mongoose.Schema({
  query_displayed: String,
  total_results: Number,
  time_taken_displayed: Number,
  organic_results_state: String,
});

//Site Link Schema
const SiteLinkSchema = new mongoose.Schema({
  title: String,
  snippets: [String],
});

//Ads Schema
const AdsSchema = new mongoose.Schema({
  position: Number,
  block_position: String,
  title: String,
  link: String,
  displayed_link: String,
  tracking_link: String,
  description: String,
  source: String,
  sitelinks: [SiteLinkSchema],
});

//Related Question Schema
const RelatedQuestionSchema = new mongoose.Schema({
  question: String,
  snippet: String,
  title: String,
  date: String,
  link: String,
  displayed_link: String,
  source_logo: String,
  next_page_token: String,
  serpapi_link: String,
});

//Knowledge graph Schema
const KnowledgeGraphSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  data: {
    type: Object,
  },
});

//AI Overview Schema
const AIOverviewSchema = new mongoose.Schema({
  id: {
    type: Number,
    autoIncrement: true,
  },
  data: {
    type: Object,
  },
});

//Organic Result Site Link Schema
const OrganicSiteLinkSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String,
});

//Organic Result Schema
const OrganicResultSchema = new mongoose.Schema({
  position: Number,
  title: String,
  link: String,
  redirect_link: String,
  displayed_link: String,
  favicon: String,
  snippet: String,
  snippet_highlighted_words: [String],
  sitelinks: {
    list: [OrganicSiteLinkSchema],
  },
  source: String,
});

//Perspectives Schema
const PerspectivesSchema = new mongoose.Schema({
  author: String,
  source: String,
  title: String,
  link: String,
  date: String,
});

//Related Searches Schema
const RelatedSearchesSchema = new mongoose.Schema({
  block_position: Number,
  query: String,
  link: String,
  serpapi_link: String,
});

//Discussions and Forums
const DiscussionsAndForums = new mongoose.Schema({
  title: String,
  link: String,
  date: String,
  extensions: [String],
  source: String,
});

const KeywordSchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: true,
      unique: true,
    },
    isDefaultKeywords: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
    },
    geography: {
      type: String,
      default: 'United States',
    },
    lastChecked: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    searchMetadata: SearchMetadataSchema,
    searchParameters: SearchParametersSchema,
    searchInformation: SearchInformationSchema,
    ads: [AdsSchema],
    relatedQuestions: [RelatedQuestionSchema],
    organicResults: [OrganicResultSchema],
    perspectives: [PerspectivesSchema],
    knowledgeGraph: KnowledgeGraphSchema,
    aiOverview: AIOverviewSchema,
    topStoriesLink: {
      type: String,
    },
    topStoriesSerpapiLink: {
      type: String,
    },
    relatedSearches: [RelatedSearchesSchema],
    discussionsAndForums: [DiscussionsAndForums],
  },
  {
    timestamps: true, // This option will add both createdAt and updatedAt fields automatically
  }
);

export default mongoose.models.Keyword ||
  mongoose.model('Keyword', KeywordSchema);
