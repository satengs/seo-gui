import {
    Bot,
    BarChartHorizontal,
    TriangleAlert,
    Presentation,
    Search,
    BookOpen,
    Plus,
    Gavel,
    MapPin,
    MessagesSquare,
    Calendar,
    Info,
    Eye,
    Book,
    Telescope,
    Image,
    SearchCheck,
    Tags,
    ShoppingCart,
    Video,
    Briefcase,
    Brain,
    Sparkles,
    Radio,
    Map,
    Newspaper,
    Utensils,
    List,
    FileInput,
    Lightbulb,
    Globe,
    Plane,
    Store,
    QuestionCircle,
    Hat,
    Filter,
    ThLarge,
    GraduationCap,
    Film,
    Camera,
    Running,
    Landmark,
    TrendingUp,
    Twitter,
    Layers,
} from 'lucide-react';

const featureIcons = {
    ai_overview: {
        icon: Bot,
        label: 'AI Overview',
        bgClass: 'bg-blue-100 dark:bg-blue-900',
        textClass: 'text-blue-800 dark:text-blue-200',
        borderClass: 'border-blue-200 dark:border-blue-800'
    },
    ad_results: {
        icon: BarChartHorizontal,
        label: 'Ad Results',
        bgClass: 'bg-green-100 dark:bg-green-900',
        textClass: 'text-green-800 dark:text-green-200',
        borderClass: 'border-green-200 dark:border-green-800'
    },
    answer_box: {
        icon: TriangleAlert,
        label: 'Answer Box',
        bgClass: 'bg-red-100 dark:bg-red-900',
        textClass: 'text-red-800 dark:text-red-200',
        borderClass: 'border-red-200 dark:border-red-800'
    },
    available_on: {
        icon: Presentation,
        label: 'Available On',
        bgClass: 'bg-yellow-100 dark:bg-yellow-900',
        textClass: 'text-yellow-800 dark:text-yellow-200',
        borderClass: 'border-yellow-200 dark:border-yellow-800'
    },
    broaden_searches: {
        icon: Search,
        label: 'Broaden Searches',
        bgClass: 'bg-purple-100 dark:bg-purple-900',
        textClass: 'text-purple-800 dark:text-purple-200',
        borderClass: 'border-purple-200 dark:border-purple-800'
    },
    buying_guide: {
        icon: BookOpen,
        label: 'Buying Guide',
        bgClass: 'bg-indigo-100 dark:bg-indigo-900',
        textClass: 'text-indigo-800 dark:text-indigo-200',
        borderClass: 'border-indigo-200 dark:border-indigo-800'
    },
    complementary_results: {
        icon: Plus,
        label: 'Complementary Results',
        bgClass: 'bg-gray-100 dark:bg-gray-900',
        textClass: 'text-gray-800 dark:text-gray-200',
        borderClass: 'border-gray-200 dark:border-gray-800'
    },
    dmca_messages: {
        icon: Gavel,
        label: 'DMCA Messages',
        bgClass: 'bg-red-100 dark:bg-red-900',
        textClass: 'text-red-800 dark:text-red-200',
        borderClass: 'border-red-200 dark:border-red-800'
    },
    discover_more_places: {
        icon: MapPin,
        label: 'Discover More Places',
        bgClass: 'bg-teal-100 dark:bg-teal-900',
        textClass: 'text-teal-800 dark:text-teal-200',
        borderClass: 'border-teal-200 dark:border-teal-800'
    },
    discussions_forums: {
        icon: MessagesSquare,
        label: 'Discussions and Forums',
        bgClass: 'bg-cyan-100 dark:bg-cyan-900',
        textClass: 'text-cyan-800 dark:text-cyan-200',
        borderClass: 'border-cyan-200 dark:border-cyan-800'
    },
    events_results: {
        icon: Calendar,
        label: 'Events Results',
        bgClass: 'bg-orange-100 dark:bg-orange-900',
        textClass: 'text-orange-800 dark:text-orange-200',
        borderClass: 'border-orange-200 dark:border-orange-800'
    },
    google_about_this_result: {
        icon: Info,
        label: 'Google About This Result API',
        bgClass: 'bg-gray-100 dark:bg-gray-900',
        textClass: 'text-gray-800 dark:text-gray-200',
        borderClass: 'border-gray-200 dark:border-gray-800'
    },
    google_ads_transparency: {
        icon: Eye,
        label: 'Google Ads Transparency API',
        bgClass: 'bg-blue-100 dark:bg-blue-900',
        textClass: 'text-blue-800 dark:text-blue-200',
        borderClass: 'border-blue-200 dark:border-blue-800'
    },
    grammar_check: {
        icon: Book,
        label: 'Grammar Check',
        bgClass: 'bg-yellow-100 dark:bg-yellow-900',
        textClass: 'text-yellow-800 dark:text-yellow-200',
        borderClass: 'border-yellow-200 dark:border-yellow-800'
    },
    immersive_products: {
        icon: Telescope,
        label: 'Immersive Products',
        bgClass: 'bg-indigo-100 dark:bg-indigo-900',
        textClass: 'text-indigo-800 dark:text-indigo-200',
        borderClass: 'border-indigo-200 dark:border-indigo-800'
    },
    inline_images: {
        icon: Image,
        label: 'Inline Images',
        bgClass: 'bg-green-100 dark:bg-green-900',
        textClass: 'text-green-800 dark:text-green-200',
        borderClass: 'border-green-200 dark:border-green-800'
    },
    jobs_results: {
        icon: Briefcase,
        label: 'Jobs Results',
        bgClass: 'bg-purple-100 dark:bg-purple-900',
        textClass: 'text-purple-800 dark:text-purple-200',
        borderClass: 'border-purple-200 dark:border-purple-800'
    },
    knowledge_graph: {
        icon: Brain,
        label: 'Knowledge Graph',
        bgClass: 'bg-teal-100 dark:bg-teal-900',
        textClass: 'text-teal-800 dark:text-teal-200',
        borderClass: 'border-teal-200 dark:border-teal-800'
    },
    latest_posts: {
        icon: Sparkles,
        label: 'Latest Posts',
        bgClass: 'bg-pink-100 dark:bg-pink-900',
        textClass: 'text-pink-800 dark:text-pink-200',
        borderClass: 'border-pink-200 dark:border-pink-800'
    },
    local_news: {
        icon: Radio,
        label: 'Local News',
        bgClass: 'bg-red-100 dark:bg-red-900',
        textClass: 'text-red-800 dark:text-red-200',
        borderClass: 'border-red-200 dark:border-red-800'
    },
    map_results: {
        icon: Map,
        label: 'Local Pack',
        bgClass: 'bg-green-100 dark:bg-green-900',
        textClass: 'text-green-800 dark:text-green-200',
        borderClass: 'border-green-200 dark:border-green-800'
    },
    news_results: {
        icon: Newspaper,
        label: 'News Results',
        bgClass: 'bg-blue-100 dark:bg-blue-900',
        textClass: 'text-blue-800 dark:text-blue-200',
        borderClass: 'border-blue-200 dark:border-blue-800'
    },
    product_results: {
        icon: Store,
        label: 'Product Results',
        bgClass: 'bg-gray-100 dark:bg-gray-900',
        textClass: 'text-gray-800 dark:text-gray-200',
        borderClass: 'border-gray-200 dark:border-gray-800'
    },
    twitter_results: {
        icon: Twitter,
        label: 'Twitter Results',
        bgClass: 'bg-blue-100 dark:bg-blue-900',
        textClass: 'text-blue-800 dark:text-blue-200',
        borderClass: 'border-blue-200 dark:border-blue-800'
    }
};

export default featureIcons;
