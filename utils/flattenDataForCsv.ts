import { csvParser } from './index';

type DataRow = any;

export function flattenDataForCsv(data: DataRow[], type: string) {
  let headers: string[] = ['Keyword', 'Device', 'Location', 'Date'];
  let rows: string[][] = [];

  const getHistoricalDates = (row: any) =>
    Object.keys(row.historicalData || {});

  const getKeywordData = (row: any, date: string, field: string) =>
    row.historicalData[date]?.keywordData?.data?.[field];

  const buildBaseRow = (row: any, date: string) => ({
    keyword: row.term,
    device: row.device,
    location: row.location,
    date,
  });

  const handlers: Record<string, () => void> = {
    ai_overview: () => {
      const flattenedRows: any[] = [];

      const extractTextBlocks = (blocks: any[], base: any) => {
        blocks.forEach((block: any) => {
          if (block.type === 'paragraph') {
            flattenedRows.push({
              ...base,
              section: 'text_block',
              content_type: 'paragraph',
              snippet: block.snippet || '',
              title: '',
              link: '',
              source: '',
            });
          } else if (block.type === 'list') {
            const combined = (block.list || [])
              .map((item: any) => (item.snippet ? `• ${item?.snippet}` : ''))
              .join('\n');
            flattenedRows.push({
              ...base,
              section: 'text_block',
              content_type: 'list_item',
              snippet: combined,
              title: '',
              link: '',
              source: '',
            });
          } else if (block.type === 'expandable') {
            const newBase = {
              ...base,
              expandable_title: block.title || '',
              expandable_subtitle: block.subtitle || '',
            };
            extractTextBlocks(block.text_blocks || [], newBase);
          }
        });
      };

      data.forEach((row) => {
        getHistoricalDates(row).forEach((date) => {
          const aiOverview = getKeywordData(row, date, 'ai_overview');
          const base = {
            ...buildBaseRow(row, date),
            expandable_title: '',
            expandable_subtitle: '',
          };

          if (aiOverview?.text_blocks) {
            extractTextBlocks(aiOverview.text_blocks, base);
          }

          if (aiOverview?.references) {
            aiOverview.references.forEach((ref: any) => {
              flattenedRows.push({
                ...base,
                section: 'reference',
                content_type: 'reference',
                title: ref.title || '',
                link: ref.link || '',
                source: ref.source || '',
                snippet: ref.snippet || '',
              });
            });
          }
        });
      });

      headers = Array.from(
        new Set(flattenedRows.flatMap((row) => Object.keys(row)))
      );

      rows = flattenedRows.map((row) =>
        headers.map((header) => String(row[header] || '').replace(/"/g, '""'))
      );
    },

    reddit: () => {
      headers = [
        ...headers,
        'Title',
        'Snippet',
        'Link',
        'Source',
        'Displayed Link',
        ...Array.from({ length: 9 }, (_, i) => `Reddit Answer ${i + 1}`),
        'Site links',
      ];

      data.forEach((row) => {
        getHistoricalDates(row).forEach((date) => {
          const redditResults =
            getKeywordData(row, date, 'organic_results') || [];

          redditResults
            .filter(
              (result: any) =>
                typeof result?.source === 'string' &&
                /\breddit\b/i.test(result.source.toLowerCase())
            )
            .forEach((post: any) => {
              const {
                title,
                link,
                displayed_link,
                snippet,
                sitelinks,
                answers = [],
              } = post;

              const redditAnswers: string[] = Array.from(
                { length: 9 },
                (_, i) => answers[i]?.link || ''
              );

              const siteLinks = (sitelinks?.list || [])
                .map(
                  (item: any) =>
                    `${item.title || 'No title'}\n   📅 ${item.date || 'No date'}\n   💬 ${item.answer_count || 0} answers\n   🔗 ${item.link || 'No link'}`
                )
                .join('\n\n');

              rows.push([
                row.term,
                row.device,
                row.location,
                date,
                title || '',
                snippet || '',
                link || '',
                post.source || '',
                displayed_link || '',
                ...redditAnswers,
                siteLinks,
              ]);
            });
        });
      });
    },

    inline_videos: () => {
      headers = [...headers, 'Title', 'Thumbnail', 'Link', 'Duration'];

      data.forEach((row) => {
        getHistoricalDates(row).forEach((date) => {
          const videos = getKeywordData(row, date, 'inline_videos') || [];
          videos.forEach((video: any) => {
            rows.push([
              row.term,
              row.device,
              row.location,
              date,
              video.title || '',
              video.thumbnail || '',
              video.link || '',
              video.duration || '',
            ]);
          });
        });
      });
    },

    knowledge_graph: () => {
      headers = [
        ...headers,
        'Title',
        'Type',
        'KGMID',
        'Knowledge Graph Link',
        'Website',
        'Customer Service',
        'Date Founded',
        'President',
      ];

      data.forEach((row) => {
        getHistoricalDates(row).forEach((date) => {
          const graph = getKeywordData(row, date, 'knowledge_graph') || {};
          rows.push([
            row.term,
            row.device,
            row.location,
            date,
            graph.title || '',
            graph.entity_type || '',
            graph.kgmid || '',
            graph.knowledge_graph_search_link || '',
            graph.website || '',
            graph.customer_service || '',
            graph.date_founded || '',
            graph.president || '',
          ]);
        });
      });
    },

    related_questions: () => {
      headers = [
        ...headers,
        'Question',
        'Snippet',
        'Title',
        'Link',
        'List Items',
        'Displayed Link',
      ];

      data.forEach((row) => {
        getHistoricalDates(row).forEach((date) => {
          const questions =
            getKeywordData(row, date, 'related_questions') || [];
          questions.forEach((q: any) => {
            const listItems = (q.list || [])
              .map((item: any) => `• ${item}`)
              .join('\n');
            rows.push([
              row.term,
              row.device,
              row.location,
              date,
              q.question || '',
              q.snippet || '',
              q.title || '',
              q.link || '',
              listItems,
              q.displayed_link || '',
            ]);
          });
        });
      });
    },
  };

  if (handlers[type]) handlers[type]();

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  csvParser(csvContent, `${type}_data.csv`);
}
